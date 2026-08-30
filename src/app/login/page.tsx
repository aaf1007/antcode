export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-5 py-16 sm:px-8">
      <section aria-labelledby="login-heading" className="max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
          AntCode
        </p>
        <h1 id="login-heading" className="mt-3 text-4xl font-semibold tracking-tight text-[color:var(--text-h)]">
          Sign in
        </h1>
        <p className="mt-4 leading-7 text-[color:var(--text)]">
          Login will be available here soon.
        </p>
      </section>
    </main>
  );
}
