"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  age: number;
  school: string;
}

export default function LoginPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadInitialUsers = async () => {
      try {
        const response = await fetch("/api/user");

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const initialUsers: User[] = await response.json();

        if (isActive) {
          setUsers(initialUsers);
        }
      } catch {
        if (isActive) {
          setError("We could not load accounts right now. Please try again.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialUsers();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="flex items-center mx-auto px-5 sm:px-8 py-16 max-w-6xl min-h-[calc(100vh-4rem)]">
      <section aria-labelledby="login-heading" className="max-w-xl">
        <p className="font-semibold text-accent-text text-sm uppercase tracking-[0.18em]">
          AntCode
        </p>
        <h1 id="login-heading" className="mt-3 font-semibold text-ink text-4xl tracking-tight">
          Sign in
        </h1>
        <p className="mt-4 text-ink/70 leading-7">
          Login will be available here soon.
        </p>

        {isLoading && (
          <p className="mt-4 text-ink/70 text-sm" role="status">
            Loading accounts…
          </p>
        )}

        {!isLoading && error && (
          <p className="mt-4 text-danger text-sm">{error}</p>
        )}

        {!isLoading && !error && (
          <p className="mt-4 text-ink/70 text-sm">
            {users.length} {users.length === 1 ? "account" : "accounts"} available
          </p>
        )}
      </section>
    </main>
  );
}
