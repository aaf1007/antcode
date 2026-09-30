import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

// The browser reaches Express through the same-origin /api proxy.
export const authClient = createAuthClient({ plugins: [usernameClient()] });
