"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignOutPage() {
  const { signOut, loaded } = useClerk();

  useEffect(() => {
    if (loaded) void signOut({ redirectUrl: "/" });
  }, [loaded, signOut]);

  return (
    <main className="shell">
      <div className="card">
        <div className="eyebrow">See you soon</div>
        <h1>Signing you out…</h1>
      </div>
    </main>
  );
}
