# Database Setup (PostgreSQL via Docker)

AntCode uses PostgreSQL, running in a Docker container, for local development. Everyone runs their **own** container locally.

## Prerequisites

- **Docker Desktop** installed and running.
  Download: https://www.docker.com/products/docker-desktop/
  - Windows users: this requires WSL2, which the installer will prompt you to set up.
  - After installing, make sure Docker Desktop is actually **running** (check for the whale icon in your system tray / menu bar) before running any `docker` commands.

## First-time setup

From the **repo root** (`antcode/`):

```bash
docker compose up -d
```

Confirm it is running

```bash
docker compose ps
```
## Why port 5433, not the default 5432?

Some of you may already have a native PostgreSQL install on your machine (e.g. from earlier coursework), which occupies the default port 5432. To avoid conflicts, our Docker container is mapped to **5433** on the host side instead. You don't need to change anything about any existing local Postgres install — this just avoids the collision entirely.

