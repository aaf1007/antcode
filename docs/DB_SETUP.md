# Database Setup (PostgreSQL via Docker)

AntCode uses PostgreSQL, running in a Docker container, for local development. Everyone runs their **own** container locally.

The schema is managed by **Prisma Next (Prisma 8)**, which is *contract-first*: you edit one file — `database/prisma/contract.prisma` — and Prisma derives the TypeScript types, the SQL, and the migrations from it. This is **not** the same tool as the Prisma ORM you may have used before; the commands are different (`db update`, `migration plan`, not `prisma migrate dev`). Follow the commands in this document rather than older tutorials or AI answers.

## Prerequisites

- **Docker Desktop** installed and running.
  Download: https://www.docker.com/products/docker-desktop/
  - Windows users: this requires WSL2, which the installer will prompt you to set up.
  - After installing, make sure Docker Desktop is actually **running** (check for the whale icon in your system tray / menu bar) before running any `docker` commands.
- **Node.js 20+** and `npm install` already run once in the repo.

## First-time setup

All commands run from the **repo root** (`antcode/`). That is where `prisma.config.ts` lives, and the Prisma CLI looks for it in the current directory.

### 1. Start PostgreSQL

```bash
docker compose up -d
```

Confirm it is running:

```bash
docker compose ps
```

You want to see `antcode-db` with a `healthy` status.

### 2. Create your `.env`

```bash
cp .env.example .env
```

That gives you:

```
DATABASE_URL="postgresql://antcode:antcode@localhost:5433/antcode_db"
```

The credentials match the `docker-compose.yml` service, so the defaults work as-is — you should not need to edit this file.

`.env` is gitignored (only `.env.example` is committed), so your local connection string never gets pushed. Note it is `.env`, **not** `.env.local`, and the variable is `DATABASE_URL` — a single connection string, not separate `DB_HOST` / `DB_USER` / `DB_PASSWORD` variables.

### 3. Generate the contract artifacts

```bash
npm run contract:emit
```

This reads `database/prisma/contract.prisma` and writes two generated files next to it:

- `contract.json` — what the migration planner and the runtime read
- `contract.d.ts` — the TypeScript types your queries get

**Never edit those two by hand.** They are regenerated every time and your changes would be overwritten. Edit `contract.prisma` and re-run this command.

This step does not need the database to be running.

### 4. Create the schema in your database

```bash
npx prisma db init
```

This creates every table in your local database and *signs* it — writing a marker that records which version of the contract your database is at, so later commands can tell whether the two still agree.

### 5. Seed the problem data

```bash
npm run seed
```

> **Not implemented yet.** The seed script does not exist at the time of writing. When it lands it will read `database/raw/leetcode_problems.json` (4,041 LeetCode problems) and populate the tables. Until then, skip this step — the schema is created and usable, just empty.

## Day-to-day: changing the schema

Always start by editing `database/prisma/contract.prisma`, then re-emit:

```bash
npm run contract:emit
```

Then pick **one** of the two paths below.

### Working locally on your own branch

```bash
npx prisma db update
```

Diffs your contract against your local database and applies the difference directly. Fast, and it writes no migration files. It will ask for confirmation before anything destructive.

Use this **only** on your own local database. It leaves no reviewable record, so it is not appropriate for changes other people need to replay.

### Changes that other people will pull

```bash
npx prisma migration plan --name add_submissions
npx prisma db migrate
```

`migration plan` writes a reviewable, content-hashed migration package under `database/migrations/app/<timestamp>_<name>/`, and `db migrate` applies it. Commit the generated directory along with your contract change — that is how everyone else gets the same schema.

Two things worth knowing:

- The first `migration plan` you run after a stretch of `db update` iteration may write **two** directories rather than one (a baseline plus your delta). That is expected.
- Files inside a migration package are generated. If you need to edit `migration.ts` — for example to backfill data — re-run it with `node` afterwards to regenerate the rest of the package.

### Checking where you stand

```bash
npx prisma db verify        # does the live schema still match the contract?
npx prisma migration status # what is applied, what is pending
npx prisma db schema        # inspect the live schema
```

## Where things live

```text
database/
├── prisma/
│   ├── contract.prisma     # the schema — the only file you edit
│   ├── contract.json       # generated, do not edit
│   ├── contract.d.ts       # generated, do not edit
│   └── db.ts               # the client the app imports
├── migrations/             # generated migration packages (commit these)
└── raw/
    └── leetcode_problems.json
```

`prisma.config.ts` at the repo root ties these together — it points at the contract, sets the migrations directory, and reads `DATABASE_URL`.

## Troubleshooting

### An error message that explains nothing

The default output is terse and hides the useful part:

```
✘ [CONTRACT.SOURCE_LOAD_FAILED] Failed to resolve contract source
  why: PSL to SQL contract interpretation failed
```

Re-run with `--json` to get the actual diagnostics — file, line, column, and usually the exact fix:

```bash
npx prisma contract emit --json
```

Do this **first** whenever a Prisma command fails. It is almost always the difference between guessing and knowing.

### `PN-RUN-3001` — database not signed

Your database has no marker yet, usually because step 4 was skipped:

```bash
npx prisma db init
```

### "Prisma agent skills are out of date"

```
Prisma agent skills are out of date (installed @prisma/orm-postgres 8.0.0-rc.8, synced none).
```

Harmless. It refers to the AI-assistant skill files, not your schema, and prints even on successful runs. Check the line above it — if that says `ok`, the command worked.

### Connection refused

Docker is not running, or the container is not up. Check with `docker compose ps`, then `docker compose up -d`.

### Starting over

```bash
docker compose down -v   # -v also deletes the volume, wiping all data
docker compose up -d
npx prisma db init
```

## Why port 5433, not the default 5432?

Some of you may already have a native PostgreSQL install on your machine (e.g. from earlier coursework), which occupies the default port 5432. To avoid conflicts, our Docker container is mapped to **5433** on the host side instead. You don't need to change anything about any existing local Postgres install — this just avoids the collision entirely.
