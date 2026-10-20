import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="shell">
      <div className="auth-wrap">
        <div className="auth-head">
          <div className="eyebrow">Members only</div>
          <h1>Welcome back</h1>
          <p>Sign in with the email you used to buy the playbook.</p>
        </div>
        <SignIn fallbackRedirectUrl="/playbook" />
      </div>
    </main>
  );
}
