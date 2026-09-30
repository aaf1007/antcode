import { Link } from "react-router";
import { useAuthNav, type AuthNavState } from "./useAuthNav";

export function AuthNavControls({ onNavigate }: { onNavigate?: () => void }) {
  return <AuthNavView auth={useAuthNav()} onNavigate={onNavigate} />;
}

/** Renders auth controls from shared state so multiple placements don't each subscribe to the session. */
export function AuthNavView({ auth, onNavigate }: { auth: AuthNavState; onNavigate?: () => void }) {
  const { session, isPending, signingOut, signOutError, returnTo, signOut } = auth;
  const suffix = `?returnTo=${encodeURIComponent(returnTo)}`;

  if (isPending) return <span role="status" className="text-xs text-ink/60">Checking account…</span>;
  if (session) return (
    <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
      <span className="max-w-28 truncate font-semibold text-ink/80" title={session.user.username ?? session.user.name}>{session.user.username ?? session.user.name}</span>
      <button type="button" disabled={signingOut} onClick={() => void signOut(onNavigate)} className="min-h-9 shrink-0 rounded-md px-2 font-semibold hover:bg-ink/10 disabled:opacity-50">{signingOut ? "Signing out…" : "Sign out"}</button>
      {signOutError && <span role="alert" className="w-full text-xs text-danger">Could not sign out. Please try again.</span>}
    </div>
  );
  return (
    <div className="flex items-center gap-1 text-sm font-semibold">
      <Link to={`/sign-in${suffix}`} onClick={onNavigate} className="rounded-md px-2 py-2 hover:bg-ink/10">Sign in</Link>
      <Link to={`/sign-up${suffix}`} onClick={onNavigate} className="rounded-md bg-accent/15 px-2 py-2 text-accent-text hover:bg-accent/25">Sign up</Link>
    </div>
  );
}
