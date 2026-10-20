import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk reads the session on every request. Access is enforced next to the content itself:
// app/playbook/route.ts and app/media/[file]/route.ts check the signed-in user before serving.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Everything except Next.js build assets
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
