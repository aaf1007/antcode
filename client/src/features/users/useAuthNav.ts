import { useState } from "react";
import { useLocation } from "react-router";
import { authClient } from "./auth-client";

export type AuthNavState = ReturnType<typeof useAuthNav>;

/** One session subscription and sign-out state, shareable by every placement of the auth controls. */
export function useAuthNav() {
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState(false);
  const { pathname, search, hash } = useLocation();
  const { data: session, isPending } = authClient.useSession();
  const returnTo = pathname === "/sign-in" || pathname === "/sign-up" ? "/problem" : `${pathname}${search}${hash}`;

  const signOut = async (onSignedOut?: () => void) => {
    if (signingOut) return;
    setSigningOut(true);
    setSignOutError(false);
    try {
      const response = await authClient.signOut();
      if (response.error) setSignOutError(true);
      else onSignedOut?.();
    } catch {
      setSignOutError(true);
    } finally {
      setSigningOut(false);
    }
  };

  return { session, isPending, signingOut, signOutError, returnTo, signOut };
}
