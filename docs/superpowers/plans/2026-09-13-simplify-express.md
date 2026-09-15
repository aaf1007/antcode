# Simplify Express Implementation Plan

> Follow-up: the user subsequently requested an API-only backend. Frontend static
> serving, SPA fallback, and the startup dependency on `client/dist` have been
> removed. The historical static-serving requirements below are superseded.
> Current architecture and hosting instructions are in README.md and
> server/src/docs/ARCHITECTURE.md. The API-only follow-up passes 40 tests, builds,
> typechecking, lint, and a live deployment check with no client files present.

> **For agentic workers:** Use superpowers:executing-plans to implement this plan with the explicitly requested subagents.

**Goal:** Replace backend factories with direct imports, an exported Express app, and inline `router.get(...)` callbacks.

**Architecture:** Requests flow from the app to the router, plain service functions, and existing database queries. One middleware handles unexpected errors. A small configuration module loads the environment before Express and provides development/production settings to both entry points.

**Tech Stack:** Express 5, TypeScript, Node 24, Prisma 8, Node's test runner.

**Spec:** User-approved examples in this task: ordinary `router.get` callbacks, no separate route handler files, plain app export, direct service imports. User authorized implementation and subagents on September 13, 2026.

## Global Constraints

- Keep top-level client/server separation and existing backend folders.
- Use inline `router.get(...)` callbacks; do not create handler or controller files.
- Preserve pagination, successful responses, API 404s, method handling, client deep links, and bounded database shutdown.
- Unexpected failures use the approved shared JSON response `{ "error": "Internal server error." }`.
- Do not change database queries, schema, generated contracts, or data.
- Preserve existing uncommitted migration work; no commit, push, or deployment is requested.
- No new dependencies; test-only native module mocks may require a Node test flag.

## Task 1: Direct routes and services

**Owner:** Parent; tests owned by the test subagent.

**Files:** `server/src/routes/problem.routes.ts`, `server/src/services/problem.service.ts`, `server/src/types/problem.types.ts`, `server/src/types/logger.ts`.

**Interfaces:** Default router export; service exports `listProblems(cursor: string | null): Promise<ProblemPage>` and `getProblemItem(problemId: string): Promise<ProblemItem | null>`.

- [x] Adapt existing HTTP/service tests to mock the database repository before importing the real app/service; observe failure against the factory implementation.
- [x] Replace the router factory with `const router = Router()`, inline GET callbacks, existing method handling, and `export default router`.
- [x] Replace the service factory with a plain pagination function and a direct export of the existing item query. Preserve first duplicate cursor value, integer truncation and the INT4 limit.
- [x] Remove unused factory interfaces and logger type after consumers have migrated.
- [x] Run the behavior tests covering pagination, details, missing IDs, URI errors, and generic database errors.

## Task 2: App, configuration, and startup

**Owner:** Bootstrap subagent; tests owned by the test subagent.

**Files:** `server/src/app.ts`, `server/src/server.ts`, `server/src/config.ts`, `server/src/middleware/error-handler.ts`, `server/tests/**`, test command in `package.json`.

**Interfaces:** Default Express app; named `errorHandler`; named `config` with `development`, `port`, `host`, and optional `clientDir`.

- [x] Update static/HTTP tests to consume the exported app, using temporary client files and mocked configuration.
- [x] Export the app and register JSON parsing, the problem router, API 404 middleware, production static files/SPA fallback, and shared error middleware in order.
- [x] Export shared configuration with root dotenv loading, API_PORT/3001 for `--dev`, PORT/3000 otherwise, HOST, and the production client directory.
- [x] Keep startup validation and bounded graceful shutdown in `server.ts`, using direct app/config/database imports.
- [x] Verify malformed JSON returns 400, database failures return safe 500 responses, unknown assets do not receive HTML, and production page refreshes resolve.

## Task 3: Integration, documentation, and review

**Owner:** Parent, with independent review subagent.

**Files:** `README.md`, `server/src/docs/ARCHITECTURE.md`, this plan.

- [x] Document direct imports, inline routes, configuration, and test-only module mocks.
- [x] Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.
- [x] Verify development proxy and compiled production API/page/asset behavior against the existing local database; stop only the temporary production process.
- [x] Request independent review of bootstrap, routes, tests, and integration; resolve actionable findings.
- [x] Record verification and leave changes uncommitted.

## Completion evidence

- 40 tests pass, including parser 400/413/415 responses and unknown-error 500 responses.
- Full build, TypeScript checks, ESLint, and git diff whitespace checks pass.
- Live development proxy/direct API checks passed pagination, details, missing IDs, and malformed JSON.
- Compiled production checks passed live API, SPA page refreshes, assets, API/asset 404s, and clean SIGTERM exit.
- Independent review identified the parser-status regression; the fix and regression tests were reviewed and approved.
- Changes remain uncommitted on codex/react-vite-express.
