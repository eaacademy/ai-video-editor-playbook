import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { hasPlaybookAccess } from "@/lib/access";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await currentUser();
  if (user && hasPlaybookAccess(user)) redirect("/playbook");

  const buyUrl = process.env.NEXT_PUBLIC_BUY_URL;

  return (
    <main className="shell">
      <div className="card">
        <div className="eyebrow">The complete beginner&apos;s playbook</div>
        <h1>
          Build your own <em>AI video editor</em>
        </h1>
        <p className="lead">From zero to your first AI-edited video. No coding experience required.</p>
        <div className="actions">
          {user ? (
            <a className="btn btn-wine" href="/playbook">Open the playbook</a>
          ) : (
            <a className="btn btn-wine" href="/sign-in">Sign in</a>
          )}
          {buyUrl ? (
            <a className="btn btn-line" href={buyUrl}>Get the playbook</a>
          ) : null}
        </div>
        <div className="note">
          <strong>Just bought it?</strong> Check your email for your invitation from EA Academy. It has the
          link to create your login.
        </div>
        <p className="foot">Created by Hana Marigmen · EA Academy</p>
      </div>
    </main>
  );
}
