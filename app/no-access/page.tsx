import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { hasPlaybookAccess } from "@/lib/access";

export const dynamic = "force-dynamic";

export default async function NoAccess() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  if (hasPlaybookAccess(user)) redirect("/playbook");

  const buyUrl = process.env.NEXT_PUBLIC_BUY_URL;
  const email = user.primaryEmailAddress?.emailAddress;

  return (
    <main className="shell">
      <div className="card">
        <div className="eyebrow">Almost there</div>
        <h1>This account doesn&apos;t have access yet</h1>
        <p className="lead">
          You&apos;re signed in{email ? ` as ${email}` : ""}, but we couldn&apos;t find a playbook purchase for
          this account.
        </p>
        <div className="actions">
          {buyUrl ? <a className="btn btn-wine" href={buyUrl}>Get the playbook</a> : null}
          <a className="btn btn-line" href="/sign-out">Sign out and try another email</a>
        </div>
        <div className="note">
          <strong>Already paid?</strong> Sign in with the same email you used at checkout, or reply to your
          receipt email and we&apos;ll sort it out.
        </div>
      </div>
    </main>
  );
}
