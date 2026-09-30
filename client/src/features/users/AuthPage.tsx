import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AuthForm, type AuthMode } from "./AuthForm";
import { authClient } from "./auth-client";
import { safeReturnTo } from "./return-to";

export function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const destination = safeReturnTo(params.get("returnTo"));
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) navigate(destination, { replace: true });
  }, [destination, isPending, navigate, session]);

  const otherMode = mode === "sign-up" ? "sign-in" : "sign-up";
  const otherPath = `/${otherMode}?returnTo=${encodeURIComponent(destination)}`;

  return (
    <main className="mx-auto max-w-md px-5 py-12 sm:py-20">
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <h1 className="font-heading text-3xl font-bold">{mode === "sign-up" ? "Create your AntCode account" : "Welcome back"}</h1>
        <p className="mb-6 mt-2 text-sm text-ink/70">{mode === "sign-up" ? "Sign up to submit your workbench simulation." : "Sign in with your email or username."}</p>
        {isPending && <p role="status" className="mb-3 text-sm text-ink/65">Checking your session…</p>}
        {!session && <AuthForm mode={mode} disabled={isPending} onSuccess={() => navigate(destination, { replace: true })} />}
        <p className="mt-5 text-center text-sm text-ink/75">
          {mode === "sign-up" ? "Already have an account? " : "New to AntCode? "}
          <Link to={otherPath} className="font-semibold text-accent-text underline">{mode === "sign-up" ? "Sign in" : "Create an account"}</Link>
        </p>
      </div>
    </main>
  );
}
