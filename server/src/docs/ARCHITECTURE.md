# Server architecture

The root npm scripts run the client and server together. Server application
code lives entirely under `server/src`, with tests under `server/tests`.

```text
server/
├── src/
│   ├── db/
│   │   ├── prisma/                # Client and contract artifacts
│   │   ├── migrations/
│   │   ├── raw/
│   │   └── seed/
│   ├── docs/
│   ├── middleware/
│   │   └── error-handler.ts
│   ├── problems/
│   │   └── problem.catalog.ts
│   ├── routes/
│   │   └── problem.routes.ts
│   ├── types/
│   │   └── problem.types.ts
│   ├── app.ts
│   ├── config.ts
│   └── server.ts
├── tests/
└── tsconfig.json
```

Problem requests flow through **route → problem catalog → Prisma**:

- `routes` exports Express routers with inline `router.get(...)` callbacks.
  Each callback reads HTTP parameters, calls the problem catalog, and sends a
  response. Express 5 forwards async failures to the error middleware.
- `problems/problem.catalog.ts` owns problem lookup, cursor normalization,
  pagination, and the public database projections. This keeps the module's
  interface small without adding pass-through service and repository layers.
- `db` owns the Prisma client, contract artifacts, migrations, raw data, and
  seed data. It does not import routes or React components.
- `middleware` handles shared HTTP concerns. Unexpected failures are logged
  server-side and return HTTP 500 with `{ "error": "Internal server error." }`.
  Malformed JSON and URL parameters return HTTP 400. Known body-parser client
  errors retain their status, including 413 for oversized bodies and 415 for
  unsupported encodings, with a generic `Invalid request.` message.
- `types` owns shared API data shapes. The frontend imports API types with
  `import type` only.
- `app.ts` exports the configured Express app, registering JSON parsing, API
  routes, API 404s, and the error middleware in order.
- `config.ts` loads the root environment, validates the port, and exports the
  development mode, port, and host before Express initializes.
- `server.ts` opens the listener and exits on startup errors.
  It uses normal process termination; active requests are not drained on exit.

Modules use direct imports; there is no app/router factory chain or separate
handler layer. To add a problem endpoint, register a callback on its router and
call the corresponding catalog function.

Run `npm run dev:server` from the repository root for the API on port 5001.
Run `npm run build:server` to emit JavaScript to `server/dist`. The production
entry is `server/dist/server.js`, which serves only the API. It has no dependency
on `client/dist`; frontend hosting and page fallbacks belong to the frontend host.
Generated contracts, raw datasets, and migration history stay under `db`;
the build copies only the contract JSON needed at runtime. Run seed and
migration commands from source through the root npm/Prisma commands.

The root `.env` and `prisma.config.ts` remain shared configuration entry points.
See [DB_SETUP.md](DB_SETUP.md) for database setup.

## Verification

Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` from
the repository root. API tests replace catalog exports with Node's native module
mocks before loading the app, while catalog tests replace the Prisma adapter.
API boundary tests verify that frontend pages and assets return 404.
The test command enables `--experimental-test-module-mocks`; these tests do not
need a database connection. Live smoke checks use the existing local database
to verify development proxying and the compiled production API entry point.
In production, configure the frontend host to proxy `/api` to Express before its
SPA fallback, since the browser uses relative API URLs.
