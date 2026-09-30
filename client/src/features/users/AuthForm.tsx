import { useId, useState, type FormEvent } from "react";
import { authClient } from "./auth-client";

export type AuthMode = "sign-up" | "sign-in";

export function AuthForm({ mode, onSuccess, disabled = false }: { mode: AuthMode; onSuccess: () => void; disabled?: boolean }) {
  const isSignUp = mode === "sign-up";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [previousMode, setPreviousMode] = useState(mode);
  const id = useId();
  const usernameHintId = `${id}-username-hint`;
  const passwordHintId = `${id}-password-hint`;
  const errorId = `${id}-error`;
  const describedBy = (...ids: (string | false)[]) => [...ids, error && errorId].filter(Boolean).join(" ") || undefined;
  const invalid = error ? true : undefined;

  // Keep typed values when switching modes; carry the sign-up identity into the sign-in field.
  if (mode !== previousMode) {
    setPreviousMode(mode);
    setError("");
    if (mode === "sign-in" && !identifier) setIdentifier(email.trim() || username.trim());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      let response;
      if (isSignUp) {
        const trimmedUsername = username.trim();
        response = await authClient.signUp.email({ username: trimmedUsername, name: trimmedUsername, email: email.trim(), password });
      } else {
        const trimmedIdentifier = identifier.trim();
        response = trimmedIdentifier.includes("@")
          ? await authClient.signIn.email({ email: trimmedIdentifier, password })
          : await authClient.signIn.username({ username: trimmedIdentifier, password });
      }
      if (response.error) {
        setError(response.error.status === 429
          ? "Too many attempts. Please wait and try again."
          : response.error.message || (isSignUp ? "Unable to create your account." : "Unable to sign in."));
        return;
      }
      onSuccess();
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <fieldset disabled={disabled} className="min-w-0 space-y-4 border-0 p-0">
        {isSignUp ? (
          <>
            <label className="block text-sm font-semibold">
              Username
              <input autoComplete="username" required minLength={3} maxLength={30} pattern="[A-Za-z0-9_.]{3,30}" title="3–30 letters, numbers, underscores, or dots" aria-describedby={describedBy(usernameHintId)} aria-invalid={invalid} value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-line bg-canvas px-3 text-ink" />
            </label>
            <p id={usernameHintId} className="-mt-2 text-xs text-ink/65">3–30 letters, numbers, underscores, or dots.</p>
            <label className="block text-sm font-semibold">
              Email
              <input type="email" autoComplete="email" required aria-describedby={describedBy()} aria-invalid={invalid} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-line bg-canvas px-3 text-ink" />
            </label>
          </>
        ) : (
          <label className="block text-sm font-semibold">
            Email or username
            <input autoComplete="username" required aria-describedby={describedBy()} aria-invalid={invalid} value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-line bg-canvas px-3 text-ink" />
          </label>
        )}
        <label className="block text-sm font-semibold">
          Password
          <input type="password" autoComplete={isSignUp ? "new-password" : "current-password"} required minLength={isSignUp ? 8 : undefined} maxLength={128} aria-describedby={describedBy(isSignUp && passwordHintId)} aria-invalid={invalid} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-line bg-canvas px-3 text-ink" />
        </label>
        {isSignUp && <p id={passwordHintId} className="-mt-2 text-xs text-ink/65">Use 8–128 characters.</p>}
        {error && <p id={errorId} role="alert" className="rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</p>}
        <button type="submit" disabled={submitting} className="min-h-11 w-full rounded-lg bg-primary px-4 font-bold text-white disabled:opacity-50">
          {submitting ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
        </button>
      </fieldset>
    </form>
  );
}
