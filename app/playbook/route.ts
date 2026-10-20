import { readFile } from "node:fs/promises";
import path from "node:path";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasPlaybookAccess } from "@/lib/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let cachedHtml: string | null = null;
async function playbookHtml(): Promise<string> {
  if (!cachedHtml) {
    cachedHtml = await readFile(path.join(process.cwd(), "content", "playbook.html"), "utf-8");
  }
  return cachedHtml;
}

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("redirect_url", "/playbook");
    return NextResponse.redirect(signIn);
  }
  if (!hasPlaybookAccess(user)) {
    return NextResponse.redirect(new URL("/no-access", request.url));
  }

  return new Response(await playbookHtml(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}
