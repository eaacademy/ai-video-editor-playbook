import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="shell">
      <div className="auth-wrap">
        <div className="auth-head">
          <div className="eyebrow">You&apos;re in</div>
          <h1>Create your login</h1>
          <p>Use the link from your invitation email. Sign-ups are for playbook buyers only.</p>
        </div>
        <SignUp fallbackRedirectUrl="/playbook" />
      </div>
    </main>
  );
}
