/**
 * Access rule: a user can open the playbook when their Clerk public metadata has
 * { "playbook": true }. The Stripe webhook sets it after payment.
 * To revoke access, set it to false in the Clerk dashboard (or delete the user).
 */
export const ACCESS_KEY = "playbook";

export function hasPlaybookAccess(
  user: { publicMetadata?: Record<string, unknown> | null } | null | undefined,
): boolean {
  return user?.publicMetadata?.[ACCESS_KEY] === true;
}
