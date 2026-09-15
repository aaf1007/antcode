# React, Vite, and Express migration

> Historical migration plan. The subsequent client/server folder reorganization
> is documented in `README.md` and `server/src/docs/ARCHITECTURE.md`.

Preserve AntCode's homepage, problem catalog, detail page, responsive styling,
theme preference, pagination, and existing problem API response bodies.

## Structure

- Keep the existing repository, npm lockfile, React 19, Tailwind 4, TanStack
  Query, and PostgreSQL/Prisma contract. No database migrations or seed reloads.
- `src/` contains browser code. React Router replaces Next layouts, links, and
  dynamic route parameters for `/`, `/problem`, and `/problem/:problemId`.
- `server/` contains Express routes and problem queries. The process entry
  point owns the Prisma connection and closes it on shutdown. A separate app
  factory accepts query dependencies so HTTP tests require no live database.
- `database/` remains the home of Prisma contracts, migrations, and seed data.
  Browser code can import generated types but cannot import database runtime.
- Vite serves the frontend on port 3000 and proxies `/api` to Express on 3001.
  One development command starts both processes and stops both on exit.
- The build emits browser assets to `dist/client` and Node ESM to `dist/server`
  (with the compiled database module under `dist/database`). Express serves
  both the API and the browser build in production on `PORT`, default 3000.

## Compatibility

`GET /api/problem?after=...` returns `{ problems, nextCursor }`; detail requests
return `{ problem }`, 404 for missing problems, and the existing generic 500
messages on query failures. Cursors outside PostgreSQL's positive int4 range
are normalized before querying. Unknown API routes return JSON, never HTML.
Preserve GET/HEAD/OPTIONS support and return 405 for unsupported API methods.

Keep the existing metadata and SVG icon in Vite's HTML/public entry points.
Self-host Josefin Sans with Fontsource. Inject the existing tested theme
initializer into the HTML head before the app loads. React Router handles
internal navigation, hash scrolling, browser history, and unknown-page UI.

The frontend becomes a client-rendered SPA; Next server rendering and automatic
link prefetching are removed. Production deep links must serve the SPA shell.
API/database code and environment secrets must stay out of client assets.

## Validation

Adapt API tests to real HTTP requests against Express, with injected query
results/errors. Cover cursor normalization, success/empty/error responses,
missing records, methods, unknown API paths, and static/deep-link serving.
Retain theme tests and test the actual transformed HTML initializer. Run
typechecking, ESLint, tests, both production builds, and browser smoke checks
for navigation, pagination, theme persistence, mobile layout, and deep links.
