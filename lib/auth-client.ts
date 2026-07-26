import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // No baseURL override: this app serves its own auth routes at
  // /api/auth/[...all], so better-auth defaults to same-origin.
  // (The previous hardcoded fallback pointed at a Vercel deployment
  // that isn't reachable from localhost, which is why sign-in was
  // throwing "Failed to fetch".)
  plugins: [emailOTPClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;