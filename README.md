# AntCode

Learn to code and practice for coding interviews. AntCode is a student-focused
platform for algorithm practice, with plans for coding submissions, AI hints,
and progress tracking.

Stack: React 19, Vite 8, React Router 7, Express 5, TanStack Query,
Tailwind CSS 4, PostgreSQL 18, and Prisma 8 (Prisma Next).

## Development

Use Node.js **22.12+** (Node 24 LTS recommended) and npm.

```bash
npm install
cp .env.example .env       # on a fresh clone; keep your existing .env
```

Before running auth commands, generate a secret with `openssl rand -base64 48`
and put it in `.env` as `BETTER_AUTH_SECRET`. The empty example value is
intentionally rejected at startup.

Follow [server/src/docs/DB_SETUP.md](server/src/docs/DB_SETUP.md) to start PostgreSQL and initialize
and seed a fresh database. Existing databases and Prisma contracts continue
working with this application; the framework migration needs no schema change.

```bash
npm run auth:migrate      # first-time setup: create Better Auth tables
npm run auth:check        # verify the auth schema
npm run dev               # frontend at http://localhost:3000; API at :5001
npm test                  # HTTP and theme tests; no database required
npm run test:auth         # auth integration tests; requires a disposable PostgreSQL database
npm run typecheck         # browser, backend, and tooling TypeScript
npm run lint
npm run build             # typecheck and build both frontend and backend
npm run contract:emit     # regenerate DB artifacts after schema edits
npm run seed              # clears and reloads the problem catalog
```

`npm run dev` starts Vite and Express together and stops both when you exit.
Vite provides React hot reload and proxies `/api` to Express. `tsx watch`
restarts Express when backend files change. You can also run `npm run dev:client`
and `npm run dev:server` in separate terminals.

The `.env` file contains `DATABASE_URL`, `BETTER_AUTH_SECRET` (at least 32 random
characters), and `BETTER_AUTH_URL` (the browser-facing origin, normally
`http://localhost:3000`). Only the backend reads the database connection and
secret. `API_PORT` changes the development backend port (default 5001).
In development, Express and Vite listen on `127.0.0.1` only; set `HOST` for
Express or pass `--host` to `dev:client` to expose them on the network.
Restart development after changing environment variables. Vite always uses
port 3000 unless you pass a CLI override to `dev:client`.

Better Auth owns the separate PostgreSQL `auth` schema;
Prisma Next continues to own the problem catalog in `public`. The generated
initial auth SQL is kept at `server/src/db/auth/schema.sql` for review.
The pinned Better Auth CLI derives migrations from the auth configuration and
the live schema; do not overwrite the committed initial SQL by generating
against a database that has already been migrated. See
[Authentication](docs/AUTHENTICATION.md) for the request flow, code ownership,
session rules, and test setup.

## Production

```bash
npm ci
npm run build
npm start
```

`npm start` runs only the Express API on port 3000, listening on all
interfaces (`0.0.0.0`). Set `PORT` and `HOST` to change its listener.
Supply `DATABASE_URL`, `BETTER_AUTH_SECRET`, and
`BETTER_AUTH_URL` through the deployment environment or the root `.env` file.
The backend can be built independently with
`npm run build:server` and does not require a client build.

Run `npm run auth:migrate` and `npm run auth:check` as a deployment migration
step **before** starting the new API version. Keep the CLI and dev dependencies
available to that step. Set `BETTER_AUTH_URL` to the public HTTPS frontend
origin, and configure `BETTER_AUTH_TRUSTED_PROXIES` with only the addresses or
CIDRs of proxies that sanitize forwarded IP headers. Keep the API origin
reachable only through those proxies. Express resolves the client IP from the
socket and trusted proxy chain before Better Auth uses it for rate limiting.
Monitor auth endpoint errors and rate
limits without logging passwords, cookies, or session tokens.

Deploy `server/dist/`, `.npmrc`, `package.json`, and `package-lock.json` to the backend
host. Install runtime dependencies with `npm ci --omit=dev --ignore-scripts`
and run `npm start` from that deployment root.

Build the frontend with `npm run build:client` and publish `client/dist/` to
its own static host. Configure that host to proxy `/api` requests to Express,
and to serve `index.html` for frontend page routes such as `/problem/two-sum`.
The frontend uses relative `/api` URLs, so the proxy must take precedence over
the frontend fallback. Express serves no frontend HTML or assets.

Users can sign up and sign in at `/sign-up` and `/sign-in`. Better Auth handles
the browser session at `/api/auth/*`. Guests can still browse and Run; Submit
opens account creation over the workbench. Signed-in Submit remains a local
simulation and records no progress.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/problem` | Paginated problem catalog |
| `/problem/:slug` | Problem details |
| `GET /api/problem?after=<frontendId>` | `{ problems, nextCursor }` |
| `GET /api/problem/:slug` | `{ problem, workbench }`, or a JSON 404 |

The API keeps the existing successful response bodies and page size.
Unexpected failures return HTTP 500 with `{ "error": "Internal server error." }`.
Malformed JSON and URL parameters return JSON 400 responses; oversized bodies
return 413 and unsupported body encodings return 415. API routes also support
HEAD and OPTIONS; unsupported methods return 405.

## Project structure

```text
client/
├── src/                   # React pages, components, features, and app setup
├── public/                # Static assets
├── tests/                 # Frontend and generated-HTML tests
├── index.html
├── vite.config.ts
├── postcss.config.mjs
└── tsconfig.json
server/
├── src/
│   ├── db/                # Prisma catalog and Better Auth schema SQL
│   ├── auth/              # Better Auth configuration
│   ├── docs/              # Backend architecture and database guides
│   ├── middleware/        # Shared Express middleware
│   ├── problems/          # Problem catalog behavior
│   ├── routes/            # Catalog HTTP routes
│   ├── types/             # API data shapes
│   ├── app.ts             # Exported Express API app
│   ├── config.ts          # Environment and ports
│   └── server.ts          # Port validation and API listener
├── tests/                 # API and catalog tests
├── integration/           # Disposable PostgreSQL auth tests
└── tsconfig.json
package.json               # One install and shared commands for both apps
prisma.config.ts           # Points Prisma to server/src/db
```

Browser modules use relative `/api` URLs. Keep database queries and Node
runtime dependencies under `server/src/`. Catalog requests flow through
`routes → problem catalog → Prisma`; Better Auth owns `/api/auth/*` and its
separate database schema. `app.ts` exports the configured Express app and
`server.ts` starts it. Browser code may import
**types** from `server/src/types`; ESLint rejects runtime server imports, and
Vite serves only the client and its dependencies. See
[the backend architecture guide](server/src/docs/ARCHITECTURE.md) for responsibilities.

Run all npm commands from the repository root. The root `.env`, lockfile, and
package manifest are shared; production outputs are `client/dist` and `server/dist`.

`npm test` uses Node's native module mocks to replace catalog database queries
while exercising the real routes and catalog logic over HTTP. It runs with
`NODE_ENV=test` and skips only Better Auth's startup schema check, so no
running database is needed; the skip has no effect in production. `npm run
test:auth` requires `AUTH_TEST_DATABASE_URL` pointing to a disposable database
with `auth_test` in its name; it refuses the normal development database.
Migrate the test database first by running `auth:migrate` with `DATABASE_URL`
set to the same URL. Set a test `BETTER_AUTH_SECRET` and an HTTPS
`BETTER_AUTH_URL`. The test command sets `NODE_ENV=production` to check secure
cookie attributes.

`server/src/db/prisma/contract.prisma` remains the schema source of truth. Never edit
`contract.json` or `contract.d.ts` manually. Run `npm run contract:emit` after
changing the schema, then follow the database setup guide for migrations.

The theme initializer is shared by React and Vite's HTML transform, so the saved
light/dark preference applies before the app paints. Josefin Sans is self-hosted
from the Fontsource package; no Google Fonts request is needed at runtime.
