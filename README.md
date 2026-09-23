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

Follow [server/src/docs/DB_SETUP.md](server/src/docs/DB_SETUP.md) to start PostgreSQL and initialize
and seed a fresh database. Existing databases and Prisma contracts continue
working with this application; the framework migration needs no schema change.

```bash
npm run dev               # frontend at http://localhost:3000; API at :5001
npm test                  # HTTP and theme tests; no database required
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

The `.env` file contains `DATABASE_URL`; only the backend reads the database
connection. `API_PORT` changes the development backend port (default 5001).
Restart development after changing environment variables. Vite always uses
port 3000 unless you pass a CLI override to `dev:client`.

## Production

```bash
npm ci
npm run build
npm start
```

`npm start` runs only the Express API on port 3000. Set `PORT` and `HOST`
to change its listener. Supply `DATABASE_URL` through the deployment environment
or the root `.env` file. The backend can be built independently with
`npm run build:server` and does not require a client build.

Deploy `server/dist/`, `package.json`, and `package-lock.json` to the backend
host. Install runtime dependencies with `npm ci --omit=dev --ignore-scripts`
and run `npm start` from that deployment root.

Build the frontend with `npm run build:client` and publish `client/dist/` to
its own static host. Configure that host to proxy `/api` requests to Express,
and to serve `index.html` for frontend page routes such as `/problem/two-sum`.
The frontend uses relative `/api` URLs, so the proxy must take precedence over
the frontend fallback. Express serves no frontend HTML or assets.

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
│   ├── db/                # Prisma client, repositories, schema, migrations, seed data
│   ├── docs/              # Backend architecture and database guides
│   ├── middleware/        # Shared Express middleware
│   ├── routes/            # Routers with inline router.get callbacks
│   ├── services/          # Application logic
│   ├── types/             # API data shapes
│   ├── app.ts             # Exported Express API app
│   ├── config.ts          # Environment and ports
│   └── server.ts          # Port validation and API listener
├── tests/                 # API and service tests
└── tsconfig.json
package.json               # One install and shared commands for both apps
prisma.config.ts           # Points Prisma to server/src/db
```

Browser components use relative `/api` URLs. Keep database queries and Node
runtime dependencies under `server/src/`. Requests flow through
`routes → services → db` through direct imports. Route files register inline
callbacks with `router.get(...)`; services export ordinary functions.
`app.ts` exports the configured Express app and `server.ts` starts it. Browser code may import
**types** from `server/src/types`; ESLint rejects runtime server imports, and
Vite serves only the client and its dependencies. See
[the backend architecture guide](server/src/docs/ARCHITECTURE.md) for responsibilities.

Run all npm commands from the repository root. The root `.env`, lockfile, and
package manifest are shared; production outputs are `client/dist` and `server/dist`.

`npm test` uses Node's native module mocks to replace database queries while
exercising the real routes and services over HTTP. The test command enables
`--experimental-test-module-mocks`; no running database is needed for these tests.

`server/src/db/prisma/contract.prisma` remains the schema source of truth. Never edit
`contract.json` or `contract.d.ts` manually. Run `npm run contract:emit` after
changing the schema, then follow the database setup guide for migrations.

The theme initializer is shared by React and Vite's HTML transform, so the saved
light/dark preference applies before the app paints. Josefin Sans is self-hosted
from the Fontsource package; no Google Fonts request is needed at runtime.
