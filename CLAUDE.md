# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vendure Nx Starter — an Nx integrated monorepo for a [Vendure](https://www.vendure.io) e-commerce application. Vendure v3.5.4, Nx 20.8.2, Node 22. Uses **npm** (not yarn/pnpm).

## Commands

```bash
# Development
npm run dev              # Start server + worker together
npm run dev:server       # Server only
npm run dev:worker       # Worker only
npm run dev:dashboard    # Dashboard dev mode (Vite HMR)

# Build
npm run build            # Build server, dashboard, and worker
npm run build:dashboard  # Build dashboard only
npx nx build server      # Build individual target
npm run build:dashboard  # Build dashboard only

# Test
npm test                 # All tests (parallel=1)
npx nx test server       # Jest (server/worker)
npx nx test plugin-example  # Vitest (plugins)

# Lint
npx nx lint server
npx nx run-many --target=lint --all

# Migrations
npx nx run server:migration <migration-name>

# GraphQL codegen (server must be running on localhost:3000)
npx nx run plugin-example:codegen

# Generate a new plugin
nx g vendure-nx:vendure-plugin-generator --name=MyPlugin --uiExtension=true
```

## Architecture

```
apps/
  server/          # Vendure HTTP server (admin-api + shop-api), runs migrations on start
  worker/          # Vendure job queue worker (BullMQ), health check on port 3123
  admin-dashboard/ # React-based admin dashboard (Vite + @vendure/dashboard)
libs/
  util-config/     # Shared VendureConfig imported by both server and worker
  util-testing/    # E2E test utilities, fixtures, test config
  plugin-example/  # Reference plugin implementation
tools/
  executors/       # Custom Nx executors: package, codegen, plugin
  vendure-nx/      # Custom Nx generator for scaffolding plugins
```

**Path aliases** (tsconfig.base.json):
- `@vendure-nx/plugin-example` → `libs/plugin-example/src/index.ts`
- `@vendure-nx/util-config` → `libs/util-config/src/index.ts`
- `@vendure-nx/util-testing` → `libs/util-testing/src/index.ts`

### Server vs Worker

The shared `VendureConfig` in `libs/util-config` is used by both server and worker. The `DashboardPlugin` is added only in `apps/server/src/main.ts` via `mergeConfig` — it must NOT be in the shared config. Setting `RUN_JOB_QUEUE=1` starts the job queue inside the server process (for dev); in production the separate worker handles jobs.

### Plugin Structure

Plugins live in `libs/plugin-<name>`. Each plugin has:
- `lib/` — plugin class (`@VendurePlugin`), entities, resolvers, GraphQL schema extensions
- `dashboard/` — React-based dashboard extensions (TSX components using `@vendure/dashboard`)
- `e2e/` — E2E tests using `@vendure/testing` with Vitest

Register plugins in `libs/util-config/src/lib/vendure-config.ts` (plugins array). Dashboard extensions are auto-discovered from plugin `dashboard/` directories.

### Generated Files — Do Not Edit

- `libs/*/src/lib/generated-admin-types.ts`
- `libs/*/src/lib/generated-shop-types.ts`
- `libs/*/src/e2e/graphql/gql-admin/` and `gql-shop/`

Regenerate with `npx nx run <plugin>:codegen`.

## Infrastructure

`docker-compose up -d` starts: PostgreSQL 16 (port 5432), MinIO (ports 9000/9001), Redis 6.2 (port 6379).

Environment: copy `.env.example` to `.env`. `dotenv` is loaded in `libs/util-config/src/lib/vendure-config.ts`.

## Testing

- **Server/Worker**: Jest 29 with ts-jest
- **Plugins**: Vitest with SWC transformer (needed for TypeScript decorators)
- **E2E DB**: `sqljs` (SQLite in-memory) by default; set `DB=postgres` for Postgres
- SQLite test caches stored in `libs/**/e2e/__data__/*.sqlite` (gitignored)

## Code Style

- Prettier: single quotes, trailing commas, no parens on single arrow params
- Indent: 2 spaces
- TypeScript: `experimentalDecorators` + `emitDecoratorMetadata` enabled
- ESLint: `@nx/enforce-module-boundaries` enforced

## Commit Linting

Rules for commit message format (see [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary))

Pattern: `<type>([optional scope]): <description>`\
The description shall contain the ticket number if possible.

Example message: `feat(product): My message with info about the commit (FS-0)`
