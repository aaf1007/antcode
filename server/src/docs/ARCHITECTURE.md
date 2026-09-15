# Server architecture

The root npm scripts run the client and server together. Server application
code lives entirely under `server/src`, with tests under `server/tests`.

```text
server/
├── src/
│   ├── db/
│   │   ├── problem.repository.ts
│   │   ├── prisma/                # Client and contract artifacts
│   │   ├── migrations/
│   │   ├── raw/
│   │   └── seed/
│   ├── docs/
│   ├── middleware/
│   │   └── error-handler.ts
│   ├── routes/
│   │   └── problem.routes.ts
│   ├── services/
│   │   └── problem.service.ts
│   ├── types/
│   │   └── problem.types.ts
│   ├── app.ts
│   ├── config.ts
│   └── server.ts
├── tests/
└── tsconfig.json
```

Requests flow through **routes → services → db**:

- `routes` exports Express routers with inline `router.get(...)` callbacks.
  Each callback reads HTTP parameters, calls an imported service function, and
  sends a response. Express 5 forwards async failures to the error middleware.
- `services` implements application behavior, such as cursor normalization and
  pagination responses. It does not depend on Express or create DB connections.
- `db` owns Prisma queries, the database client, schema artifacts, migrations,
  and seed data. It does not import routes or React components.
- `middleware` handles shared HTTP concerns. Unexpected failures are logged
  server-side and return HTTP 500 with `{ "error": "Internal server error." }`.
  Malformed JSON and URL parameters return HTTP 400. Known body-parser client
  errors retain their status, including 413 for oversized bodies and 415 for
  unsupported encodings, with a generic `Invalid request.` message.
- `types` owns shared API data shapes. The frontend imports API types with
  `import type` only.
- `app.ts` exports the configured Express app, registering JSON parsing, API
  routes, API 404s, and the error middleware in order.
- `config.ts` loads the root environment and exports the development mode,
  port, and host before Express initializes.
- `server.ts` validates the port, opens the listener, and exits on startup errors.
  It uses normal process termination; active requests are not drained on exit.

Modules use direct imports. Services are plain exported functions; there is no
app/router/service factory chain or separate handler layer. To add an endpoint,
register a callback on its router and call the corresponding service function.

Run `npm run dev:server` from the repository root for the API on port 3001.
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
the repository root. Tests replace repository exports with Node's native module
mocks before loading the app, then exercise the real routes and service logic.
API boundary tests verify that frontend pages and assets return 404.
The test command enables `--experimental-test-module-mocks`; these tests do not
need a database connection. Live smoke checks use the existing local database
to verify development proxying and the compiled production API entry point.
In production, configure the frontend host to proxy `/api` to Express before its
SPA fallback, since the browser uses relative API URLs.
