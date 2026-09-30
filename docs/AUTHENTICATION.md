# Authentication

AntCode uses Better Auth for email/password accounts and browser sessions. The
catalog and workbench stay available to guests. Only the workbench's simulated
Submit action is gated; there is no saved submission endpoint yet.

## Request flow and ownership

```text
Browser → same-origin /api/auth/* → Vite proxy (development) or frontend proxy
        → Express → Better Auth → PostgreSQL auth schema
```

- [server/src/app.ts](../server/src/app.ts) mounts Better Auth before
  `express.json()`, so Better Auth reads its own request body and handles its
  own routes.
- [server/src/auth/auth.ts](../server/src/auth/auth.ts) defines Better Auth's
  database, account, session, rate-limit, and origin settings. Better Auth owns
  its tables in PostgreSQL's `auth` schema. Prisma owns the problem catalog in
  `public`; there is no Prisma user model.
- [auth-client.ts](../client/src/features/users/auth-client.ts) is the browser
  client. Its requests use the current origin and `/api/auth` path, so browser
  cookies stay first party. `AuthForm`, `AuthDialog`, `AuthPage`, and
  `AuthNavControls` use this client; they do not call the database directly.
- [Workbench.tsx](../client/src/features/workbench/components/Workbench.tsx)
  applies the Submit gate. `useWorkbench` still owns the editor draft and
  simulation.

Registration sends username, email, and password to
`/api/auth/sign-up/email`. The server hook requires username, trims it, and
sets Better Auth's `name` and the plugin's `displayUsername` to that username,
replacing any submitted values. A sign-up that includes `image` is rejected.
The username plugin validates and normalizes the username for case-insensitive
uniqueness. If two concurrent sign-ups claim the same username, the database
unique constraint rejects the second; an after hook reports it with the
plugin's `USERNAME_IS_ALREADY_TAKEN` code and message. Better Auth keeps that
response's HTTP 422 status, where a non-concurrent duplicate gets 400. Better Auth hashes the
password, creates the account and session, and returns an HTTP-only session
cookie. Sign-in sends the single input to `/api/auth/sign-in/email` when it
contains `@`, or `/api/auth/sign-in/username` otherwise. Sign-out calls
`/api/auth/sign-out` to revoke the database session.

Profile fields are fixed after registration. `/api/auth/update-user` rejects
`name`, `displayUsername`, and `image`, and the username plugin keeps the
username immutable.

## Session and workbench rules

The cookie contains a Better Auth session token. Better Auth checks its
database row on requests; the browser does not hold a JWT for this release.
Sessions expire seven days after sign-in. Session refresh and cookie caching
are disabled, so activity does not extend expiry and sign-out takes effect
promptly. Production cookies are Secure and HTTP-only. All API instances need
the same `BETTER_AUTH_SECRET` and auth database.

`authClient.useSession()` supplies navigation and workbench identity. While the
initial session lookup is pending or has failed, Submit is disabled and offers
a retry on failure; Run remains available. A guest Submit click opens the
sign-up dialog, which also offers sign-in. The dialog is rendered beside the
workbench, leaving the editor, language, and custom input mounted. On success
it closes and returns focus to Submit. The user must click Submit again.

Before a signed-in Submit, the workbench calls `authClient.getSession()` again.
This catches a session that expired while the tab was open. A valid session
continues to the existing browser simulation; an expired session opens the
guest dialog. Any future server-side submission endpoint must verify the
Better Auth session on the server. The current client gate is product behavior,
not authorization for a server resource.

## Configuration and database changes

| Setting | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection used by Better Auth and the catalog |
| `BETTER_AUTH_SECRET` | Shared high-entropy secret, at least 32 characters |
| `BETTER_AUTH_URL` | Public browser origin, HTTPS in production |
| `BETTER_AUTH_TRUSTED_PROXIES` | Comma-separated IPs/CIDRs of trusted ingress proxies |

Generate `BETTER_AUTH_SECRET` with `openssl rand -base64 48` or an equivalent
cryptographically secure generator. The empty example and the previous public
placeholder are rejected at startup. A production `BETTER_AUTH_URL` using
HTTP is also rejected, because Better Auth derives the Secure cookie attribute
from that URL. `BETTER_AUTH_URL` is the only trusted origin: startup fails if
`BETTER_AUTH_TRUSTED_ORIGINS` is set, because Better Auth would otherwise add
those origins to its origin/CSRF allowlist.

The repository's `.npmrc` enables legacy peer resolution because this pinned
Better Auth release (and its bundled `@better-auth/prisma-adapter`) declares an
optional `prisma@^5 || ^6 || ^7` peer, which conflicts with the Prisma 8 CLI;
a strict `npm install` fails with `ERESOLVE`.
AntCode uses Better Auth's Kysely/PostgreSQL adapter, not its Prisma adapter.

Express derives the client IP from the socket and configured trusted proxies,
then replaces the forwarded IP header before Better Auth uses it for database
rate limiting. If no proxy is configured, Express uses the socket IP. In AWS,
restrict direct access to the API origin and have the proxy sanitize forwarded
headers. Better Auth accepts requests only from the configured browser origin
and applies its origin/CSRF checks to state-changing requests. Do not log
passwords, cookies, or session tokens.

The pinned Better Auth CLI derives migrations from `auth.ts`. The generated
initial SQL is at [schema.sql](../server/src/db/auth/schema.sql) for review.
On a fresh database, run `npm run auth:migrate` and `npm run auth:check` before
starting the API. Repeat that sequence before deploying auth configuration
changes.
Keep the migration CLI available in the migration job even if the runtime
deployment installs production dependencies only.

`npm test` runs database-free tests with `NODE_ENV=test` and is the only
script that sets `BETTER_AUTH_SKIP_SCHEMA_CHECK=1`. The skip is ignored when
`NODE_ENV=production`, so production startup always validates the schema. `npm run test:auth` requires an explicit
`AUTH_TEST_DATABASE_URL` whose database name contains `auth_test`; it refuses
the normal development database before loading the auth module. Migrate that
disposable database first with `DATABASE_URL` set to the same URL. The auth
suite checks registration, sign-in, expiration, sign-out, origin rejection,
locked profile fields, concurrent duplicate usernames, rate limiting, and
forwarded-IP handling. It runs in production mode to check
the Secure cookie attribute. Remove the disposable database after the suite.

With the root `.env` configured as in the README, the full disposable test
cycle for the local Docker PostgreSQL service is:

```bash
export AUTH_TEST_DATABASE_URL="postgresql://antcode:antcode@localhost:5433/antcode_auth_test"
docker compose exec -T postgres createdb -U antcode antcode_auth_test
DATABASE_URL="$AUTH_TEST_DATABASE_URL" npm run auth:migrate
DATABASE_URL="$AUTH_TEST_DATABASE_URL" npm run auth:check
BETTER_AUTH_URL="https://antcode.test" BETTER_AUTH_SECRET="test-only-better-auth-secret-000000000000" npm run test:auth
docker compose exec -T postgres dropdb -U antcode antcode_auth_test
```

## Where to change behavior

| Change | Start here |
| --- | --- |
| Account fields, session expiry, rate limits | [auth.ts](../server/src/auth/auth.ts) |
| Auth endpoint mount or proxy IP handling | [app.ts](../server/src/app.ts) |
| Sign-in and sign-up fields or errors | [AuthForm.tsx](../client/src/features/users/AuthForm.tsx) |
| Dialog focus or mode switching | [AuthDialog.tsx](../client/src/features/users/AuthDialog.tsx) |
| Guest Submit behavior | [Workbench.tsx](../client/src/features/workbench/components/Workbench.tsx) |
| Auth database shape | Better Auth config, then `auth:migrate` and `auth:check` |

This release has no OAuth, verification email, password reset, profile editing,
JWT plugin, or persisted submissions.
