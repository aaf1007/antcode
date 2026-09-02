# AntCode

Learn to code and practice for coding interviews

## Introduction

A friendly platform for learning and practicing to code that is tailored for students.

Designed for students to practice algorithmic problem solving, receive AI feedback and track progress.

Stack: Next.js 16, React 19, PostgreSQL 18, Prisma Next (Prisma 8), Tailwind CSS 4

Plans:
- LeetCode style questions with custom learning and preparation paths (similar to NeetCode 250)
- Coding sandbox editor with judge for submissions
- AI hint generator for coding questions

## Development

```bash
npm install
npm run dev            # http://localhost:3000/
npm test
npm run build
npm run contract:emit  # regenerate DB types after editing the schema
npm run seed           # not implemented yet
```

The database runs in Docker and needs a one-time setup before `npm run dev` is
useful. See **[docs/DB_SETUP.md](docs/DB_SETUP.md)** — start there on a fresh
clone.

The connection string is read from `DATABASE_URL` in the root `.env` file. Copy
`.env.example` to `.env` to get the default that matches `docker-compose.yml`.

## Project Structure

```text
database/                   # Everything about the database lives here
├── prisma/
│   ├── contract.prisma     # The schema — the only file you edit
│   ├── contract.json       # Generated, do not edit
│   ├── contract.d.ts       # Generated, do not edit
│   └── db.ts               # The database client
├── migrations/             # Generated migration packages (committed)
└── raw/                    # Source datasets used for seeding

src/
├── app/                    # Next.js pages, layouts, and API route handlers
├── components/             # General UI shared across the application
└── features/               # Product/domain code grouped by feature
    ├── problems/
    │   ├── components/     # Problem-specific UI
    │   ├── data/           # Problem seed data
    │   ├── problem.repository.ts
    │   ├── problem.service.ts
    │   └── problem.types.ts
    └── users/              # User-specific data and behavior
```

### Folder conventions

- `database` owns every data concern: the schema, the generated types, the
  migration history, and the raw datasets we seed from. It sits outside `src`
  because it is not application source — it is the data layer the application
  is built on, and `raw/` in particular holds large files that should never be
  pulled into the app bundle.
- `app` contains Next.js entry points. Pages compose components and API route
  handlers translate HTTP requests into calls to feature services. Keep these
  files thin; business logic does not belong here.
- `components` contains general React components that are not owned by one
  feature, such as navigation and homepage layout components.
- `features` contains code tied to a product capability. Models, repositories,
  services, types, data, tests, and feature-specific components stay with the
  feature that owns them.
- `lib` is reserved for feature-independent infrastructure such as logging,
  storage clients, and generic utilities. It does not exist yet — create
  `src/lib/` when there is something genuinely shared to put in it, and keep
  problem, user, or other business-specific rules out of it.

React components have only two homes:

1. `src/components` for general or application-wide UI.
2. `src/features/<feature>/components` for feature-specific UI.

Dependencies should flow in one direction:

```text
app → features → database
```

A feature may import the client from `database/prisma/db` and shared helpers
from `lib`, but neither may import from a feature. As a quick test, if deleting
a feature would also remove a file, that file belongs inside the feature.

### Working with the schema

The schema is contract-first: `database/prisma/contract.prisma` is the single
source of truth, and `contract.json` / `contract.d.ts` are generated from it.
After any schema edit, run `npm run contract:emit` — otherwise your types and
the database planner are working from a stale copy.

