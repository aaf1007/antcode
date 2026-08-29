# AntCode Next.js Full-Stack Migration Design

## Summary

Migrate the current Vite/React client and Express server into one Next.js App Router application. Preserve the existing application behavior and backend layering while replacing framework-specific wiring. Add a simple Tailwind CSS homepage built from React components.

## Goals

- Replace Vite, React Router, and Express with one Next.js application.
- Preserve the existing problem service, repository, Sequelize model, database data, and API behavior.
- Preserve the existing `/api/problem`, `/api/problem/[problemId]`, `/api/user`, and `/api/user/[userId]` URLs.
- Keep database code server-only and use the Node.js runtime for routes that access Sequelize.
- Use only two component locations:
  - `src/components` for general page, layout, and reusable UI components.
  - `src/features/<feature>/components` for feature-specific components.
- Build a simple responsive homepage with Tailwind CSS.
- Retain and migrate the current repository tests.
- Report every intentional bug fix or behavior correction after implementation.

## Non-goals

- No authentication implementation.
- No new backend features, business rules, filtering, sorting, or submission system.
- No ORM replacement or database schema redesign.
- No generic middleware framework or abstractions that the current application does not need.
- No separate public API version or renamed REST endpoints.
- No deployment-provider-specific configuration beyond a normal Node-compatible Next.js build.

## Application Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── problem/
│   │   │   ├── route.ts
│   │   │   └── [problemId]/route.ts
│   │   └── user/
│   │       ├── route.ts
│   │       └── [userId]/route.ts
│   ├── login/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── home/Hero.tsx
│   └── layout/Navbar.tsx
├── features/
│   └── problems/
│       ├── components/
│       │   ├── ProblemCard.tsx
│       │   └── ProblemList.tsx
│       ├── data/problems.json
│       ├── problem.model.ts
│       ├── problem.repository.test.ts
│       ├── problem.repository.ts
│       ├── problem.seed.ts
│       ├── problem.service.ts
│       └── problem.types.ts
└── lib/
    └── db/
        └── sequelize.ts
```

The existing problem data will move to `src/features/problems/data/problems.json`, and its seed script will move to `src/features/problems/problem.seed.ts`. The root `seed` package script will continue invoking it with the same optional `--force` behavior.

### Folder responsibilities

- `app`: Next.js page, layout, loading, and Route Handler entry points. Route Handlers replace Express routers and remain thin HTTP adapters.
- `components`: UI that is not owned by a business feature, such as the homepage hero and navigation.
- `features/problems`: All problem-domain contracts, Sequelize model code, repository code, service code, tests, and feature UI.
- `lib/db`: Shared Sequelize initialization because database connectivity is infrastructure that may serve more than one feature.

No React components will be stored inside route-specific `_components` folders. A component either belongs to the general `components` tree or to a feature's `components` tree.

## Data and Request Flow

The homepage will preserve the current client-driven request flow:

```text
Homepage
  -> ProblemList client component
  -> GET /api/problem
  -> Next.js Route Handler
  -> problem service
  -> problem repository
  -> Sequelize
  -> PostgreSQL
```

The API will continue returning the same JSON shapes and use the existing query parameters:

- `limit`: defaults to `30`.
- `jump`: defaults to `0`.
- `hasMore`: indicates whether another slice exists.

The existing service and repository responsibilities remain unchanged. In particular, pagination will continue to slice the result in the Route Handler rather than introducing a new database pagination strategy during this migration.

## API Migration

Express routers will become App Router `route.ts` files using Web `Request` and `Response` APIs. Each handler will retain the current try/catch behavior and status codes unless a documented correctness fix is necessary.

- `GET /api/problem` returns `ProblemPagination`.
- `GET /api/problem/[problemId]` returns the problem, `404` when absent, and `502` on an unexpected data failure.
- `GET /api/user` returns the current in-memory user list.
- `GET /api/user/[userId]` retains the current lookup response contract.

CORS configuration will be removed because the UI and API will share one origin. No replacement middleware is needed. The existing empty middleware file will not be migrated.

## Homepage Design

The homepage will be simple, responsive, and implemented with Tailwind CSS. It will contain:

- A `Navbar` with the AntCode name and current navigation.
- A compact `Hero` describing the coding-practice purpose of the application.
- A `ProblemList` that owns the existing client-side fetch, loading, and error state.
- A `ProblemCard` for each problem snippet.
- A refresh/load control that reuses the current fetch behavior rather than adding new pagination functionality.

Loading and error messages will appear once around the list rather than once for every rendered problem. The UI will use the existing neutral and purple visual direction and will not add a separate design system.

## Types and Server Boundaries

All problem-domain types will move into `src/features/problems/problem.types.ts`, including `Problem`, `ProblemSnippet`, `ProblemPagination`, `Difficulty`, `TopicTag`, `CodeSnippet`, and `NeetcodeMeta`.

That file will contain only type declarations so both server and client code can import it safely. Sequelize runtime code remains in `problem.model.ts`, and database/service/repository modules remain server-only.

## Error Handling

- Route Handlers translate failures into the same JSON responses and status codes used by the Express routes.
- Unexpected failures are logged on the server and do not expose database details to the browser.
- The homepage presents a single readable error state and allows the current request to be retried.
- Missing data is handled explicitly instead of allowing a second response to be sent.

No generic error hierarchy or reusable handler wrapper will be introduced during this migration.

## Configuration and Environment

- Replace the two package manifests and lockfiles with one root Next.js package manifest and lockfile.
- Configure Next.js, TypeScript, ESLint, and Tailwind CSS at the repository root.
- Move the ignored server environment configuration to the Next.js root without exposing or committing secrets.
- Use Next.js environment loading instead of explicitly invoking `dotenv` in application code.
- Preserve the current PostgreSQL environment variable names and fallback values.

## Allowed Correctness Fixes

The migration may include these small fixes, all of which will be reported afterward:

- Align the client problem type field names with the server response: `topicTags` and `acRate`.
- Use primitive `boolean` rather than boxed `Boolean` in the pagination type.
- Stop the user-by-ID handler after sending its missing-user response so it cannot send two responses.
- Place loading and error states outside the problem rendering loop.
- Correct visible spelling mistakes in migrated UI copy.
- Remove stale comments that describe code which no longer exists.

No other behavior change will be made without expanding this design and obtaining approval.

## Migration Sequence

1. Establish the root Next.js package and configuration.
2. Migrate shared database setup and the problem domain modules.
3. Migrate repository tests and confirm the data layer remains correct.
4. Replace Express routes with Next.js Route Handlers.
5. Build the Tailwind homepage and migrate the empty login page.
6. Verify API contracts and browser behavior.
7. Remove obsolete Vite, React Router, Express, and CORS files and dependencies.
8. Run the complete verification suite and report fixes and remaining caveats.

## Verification

Completion requires all of the following:

- Existing repository tests pass after migration.
- Type checking succeeds.
- ESLint succeeds.
- The Next.js production build succeeds.
- The homepage renders responsively and handles loading, success, empty, and failure states.
- Both problem API endpoints return the expected responses.
- Both user API endpoints return the expected responses without double-response errors.
- No Vite, React Router, Express, or CORS runtime dependency remains.
- No environment secret is committed.
