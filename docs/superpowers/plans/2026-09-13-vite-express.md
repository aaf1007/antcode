# Vite and Express Implementation Plan

> Historical migration plan. The subsequent client/server folder reorganization
> is documented in `README.md` and `server/src/docs/ARCHITECTURE.md`.

> Execute inline, checking each deliverable before continuing.

**Goal:** Replace Next.js with React/Vite and Express while preserving AntCode.

**Architecture:** A browser-only `src/` talks to Express `/api` routes in
`server/`. Development uses a Vite proxy; production uses one Express process.

**Tech Stack:** React 19, React Router, Vite 8, Express 5, TypeScript,
Tailwind 4, TanStack Query, existing Prisma 8 and PostgreSQL.

**Spec:** `docs/superpowers/specs/2026-09-13-vite-express-design.md`

## Constraints

- Preserve existing page URLs, UI, theme, API response bodies, and database.
- No schema changes, destructive seed runs, deployment, or publishing.
- Keep database imports outside browser source except erased type imports.

## Tasks

- [x] **Express HTTP boundary:** Adapt `tests/api/problem.test.ts` to HTTP
  requests against `createApp({ problems, logger, staticDir? })`. Add static
  routing coverage. Run the tests before adding the factory to confirm failure.
  Implement `server/app.ts`, `server/features/problems/problem.routes.ts`,
  `server/features/problems/problem.queries.ts`, and `server/index.ts`.
  Verify API bodies, status codes, cursor handling, and database-free tests.
- [x] **React entry and routes:** Add `index.html`, `src/main.tsx`,
  `src/app/App.tsx`, route pages, and route scroll handling. Replace `next/link`
  with React Router `Link`/`to`, and `usePathname` with `useLocation`. Preserve
  markup, CSS, query behavior, icon, font, and pre-paint theme initialization.
- [x] **Toolchain and lifecycle:** Add Vite config, browser/server TypeScript
  configs, Express development/start scripts, font/router/server dependencies,
  and React/TypeScript ESLint configuration. Remove Next runtime/configuration.
  Build with `vite build` and `tsc -p tsconfig.server.json`; start emitted Node
  JavaScript without relying on a development TypeScript loader.
- [x] **Verification and documentation:** Run `npm test`, `npm run typecheck`,
  `npm run lint`, and `npm run build`. Smoke-test development proxy and
  production static assets/deep links. Check the browser for navigation,
  pagination, theme persistence, mobile rendering, and console errors. Update
  README, environment example, and database setup instructions for the new
  commands and Node version. Review the final diff and report limitations.

## Verification results

- `npm run typecheck`, `npm run lint`, and `npm run build` pass.
- `npm test`: 26 tests pass, including real Express HTTP requests and Vite
  output checks for pre-paint theme initialization, fonts, and server exclusion.
- Existing PostgreSQL through both the development proxy and compiled server:
  50 rows, cursor 50, second page starting at 51, Two Sum detail, and missing
  problem 404 all verified. No schema changes or seed commands were run.
- Browser: homepage, local font, 50-to-100-row pagination, detail navigation
  and refresh, theme persistence, and 390px mobile width verified. Browser
  back navigation restored the catalog scroll position exactly (1066px).
- Code review found an initial hash-scroll issue in StrictMode. A browser
  assertion reproduced it, then passed after initial POP hash scrolling was
  made synchronous.
- Client build assets contain no Prisma runtime or database URL. Direct Vite
  requests for `.env`, `server/`, and `database/` return 403.
