# AntCode

Learn to code and practice for coding interviews

## Introduction

A friendly platform for learning and practicing to code that is tailored for students.

Designed for students to practice algorithmic problem solving, receive AI feedback and track progress.

Stack: Next.js, PostgreSQL

Plans:
- LeetCode style questions with custom learning and preparation paths (similar to NeetCode 250)
- Coding sandbox editor with judge for submissions
- AI hint generator for coding questions

## Development

```bash
npm install
npm run dev
npm test
npm run build
npm run seed
```
http://localhost:3000/
PostgreSQL configuration is read from the root `.env.local` file. Use the
existing `DB_*` variable names when configuring the database connection.

## Project Structure

```text
src/
├── app/                    # Next.js pages, layouts, and API route handlers
├── components/             # General UI shared across the application
├── features/               # Product/domain code grouped by feature
│   ├── problems/
│   │   ├── components/     # Problem-specific UI
│   │   ├── data/           # Problem seed data
│   │   ├── problem.model.ts
│   │   ├── problem.repository.ts
│   │   ├── problem.service.ts
│   │   └── problem.types.ts
│   └── users/              # User-specific data and behavior
└── lib/                    # Shared technical infrastructure
    └── db/                 # Database configuration and connections
```

### Folder conventions

- `app` contains Next.js entry points. Pages compose components and API route
  handlers translate HTTP requests into calls to feature services. Keep these
  files thin; business logic does not belong here.
- `components` contains general React components that are not owned by one
  feature, such as navigation and homepage layout components.
- `features` contains code tied to a product capability. Models, repositories,
  services, types, data, tests, and feature-specific components stay with the
  feature that owns them.
- `lib` contains feature-independent infrastructure such as database setup,
  environment loading, logging, storage clients, and generic utilities. It
  should not contain problem, user, or other business-specific rules.

React components have only two homes:

1. `src/components` for general or application-wide UI.
2. `src/features/<feature>/components` for feature-specific UI.

Dependencies should flow in one direction:

```text
app → features → lib
```

A feature may import shared infrastructure from `lib`, but `lib` must not
import from a feature. As a quick test, if deleting a feature would also remove
a file, that file belongs inside the feature rather than `lib`.
