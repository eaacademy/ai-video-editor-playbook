import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { grantPlaybookAccess, type ClerkAccessClient } from "@/lib/grant-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HANDLED = new Set(["checkout.session.completed", "checkout.session.async_payment_succeeded"]);

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

export async function POST(request: Request) {
  let stripe: Stripe;
  let webhookSecret: string;
  let appUrl: string;
  try {
    stripe = new Stripe(requiredEnv("STRIPE_SECRET_KEY"));
    webhookSecret = requiredEnv("STRIPE_WEBHOOK_SECRET");
    appUrl = requiredEnv("APP_URL").replace(/\/$/, "");
  } catch (error) {
    console.error("[stripe-webhook] configuration error:", (error as Error).message);
    return new Response("Server not configured", { status: 500 });
  }

  // Verify the request really came from Stripe (raw body + signature header).
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (!HANDLED.has(event.type)) {
    return Response.json({ received: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Only the playbook's Payment Link grants access (when configured), so other products don't.
  const onlyLink = process.env.STRIPE_PAYMENT_LINK_ID;
  const sessionLink = typeof session.payment_link === "string" ? session.payment_link : session.payment_link?.id;
  if (onlyLink && sessionLink !== onlyLink) {
    return Response.json({ received: true, ignored: "different payment link" });
  }

  // Paid, or free with a 100%-off code (useful for testing and comped access).
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    return Response.json({ received: true, ignored: `payment status ${session.payment_status}` });
  }

  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) {
    console.error("[stripe-webhook] paid session without an email", session.id);
    return new Response("No customer email on session", { status: 422 });
  }

  try {
    const clerk = (await clerkClient()) as unknown as ClerkAccessClient;
    const result = await grantPlaybookAccess(clerk, email, `${appUrl}/sign-up`);
    console.log(`[stripe-webhook] ${session.id}: ${result}`);
    return Response.json({ received: true, result });
  } catch (error) {
    // 500 makes Stripe retry later.
    console.error("[stripe-webhook] could not grant access for", session.id, error);
    return new Response("Could not grant access", { status: 500 });
  }
}
