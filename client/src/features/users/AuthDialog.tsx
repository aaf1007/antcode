import { useEffect, useRef, useState } from "react";
import { AuthForm, type AuthMode } from "./AuthForm";

export function AuthDialog({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<AuthMode>("sign-up");

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog ref={dialogRef} onCancel={(event) => { event.preventDefault(); onClose(); }} aria-labelledby="auth-dialog-title" className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-6 text-ink shadow-2xl backdrop:bg-black/60">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 id="auth-dialog-title" className="font-heading text-2xl font-bold">{mode === "sign-up" ? "Create an account to submit" : "Sign in to submit"}</h2>
          <p className="mt-1 text-sm text-ink/70">Your code stays in the workbench. After signing in, click Submit again.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close account dialog" className="rounded-md px-2 py-1 text-2xl leading-none hover:bg-ink/10">×</button>
      </div>
      <AuthForm mode={mode} onSuccess={onSuccess} />
      <p className="mt-5 text-center text-sm text-ink/75">
        {mode === "sign-up" ? "Already have an account? " : "New to AntCode? "}
        <button type="button" onClick={() => setMode(mode === "sign-up" ? "sign-in" : "sign-up")} className="font-semibold text-accent-text underline">
          {mode === "sign-up" ? "Sign in" : "Create an account"}
        </button>
      </p>
    </dialog>
  );
}
