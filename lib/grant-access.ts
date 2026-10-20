import { ACCESS_KEY } from "./access";

/** The parts of the Clerk backend client this module uses (kept small so it is easy to test). */
export interface ClerkAccessClient {
  users: {
    getUserList(params: { emailAddress: string[] }): Promise<{
      data: { id: string; publicMetadata: Record<string, unknown> }[];
    }>;
    updateUserMetadata(
      userId: string,
      params: { publicMetadata: Record<string, unknown> },
    ): Promise<unknown>;
  };
  invitations: {
    createInvitation(params: {
      emailAddress: string;
      redirectUrl?: string;
      publicMetadata?: Record<string, unknown>;
      notify?: boolean;
      ignoreExisting?: boolean;
    }): Promise<unknown>;
  };
}

export type GrantResult = "updated-existing-user" | "invited-new-user";

/**
 * Give a paying customer access.
 * - Existing account with that email: switch access on.
 * - No account yet: send a Clerk invitation; access is applied when they accept and sign up.
 */
export async function grantPlaybookAccess(
  clerk: ClerkAccessClient,
  rawEmail: string,
  signUpUrl: string,
): Promise<GrantResult> {
  const email = rawEmail.trim().toLowerCase();
  const existing = await clerk.users.getUserList({ emailAddress: [email] });

  if (existing.data.length > 0) {
    for (const user of existing.data) {
      await clerk.users.updateUserMetadata(user.id, {
        publicMetadata: { [ACCESS_KEY]: true },
      });
    }
    return "updated-existing-user";
  }

  await clerk.invitations.createInvitation({
    emailAddress: email,
    redirectUrl: signUpUrl,
    publicMetadata: { [ACCESS_KEY]: true },
    notify: true,
    ignoreExisting: true,
  });
  return "invited-new-user";
}
