# Vendure Nx Starter

An Nx integrated monorepo for building and deploying a [Vendure](https://www.vendure.io) e-commerce application.

## Repo Guide

This repo follows [Nx Integrated Repo](https://nx.dev/getting-started/integrated-repo-tutorial) conventions:

- **apps**
  - **admin-dashboard**: React-based admin dashboard built with Vite and [`@vendure/dashboard`](https://www.vendure.io/docs/guides/dashboard/). Served as a standalone SPA.
  - **server**: The Vendure HTTP server (admin-api + shop-api)
  - **worker**: The Vendure job queue worker (BullMQ)
  - **storefront**: Here's where you'd add your storefront app
- **libs**
  - **util-config**: The VendureConfig shared by the server & worker
  - **util-testing**: Utils used for the e2e tests
  - **plugin-\***: Vendure plugins — create them as Nx libs and import them into the VendureConfig in `util-config`
- **static**: Static assets needed by the server or worker, e.g. email template files
- **tools**: Custom Nx executors & generators

## Development

This repo uses Postgres as the DB, Redis to power the job queue, and optionally MinIO to serve assets. If MinIO is not used, assets will be stored on the local file system.

1. Clone this repo
2. `npm install`
3. Copy `.env.example` to `.env`, and set the connection details for Postgres, Redis and (optionally) MinIO
4. Run `docker-compose up -d` to start all required services
5. Populate the database with test data (`npm run db:populate`)
6. Run `npm run dev` to start the server and worker in watch mode
7. Run the dashboard (`npm run dev:dashboard`)

Optional:
- Run `npm run dev:server` to only start the server or `npm run dev:worker` for the worker
- Run `npm run dev:dashboard` to start the dashboard in dev mode (hot reload)

## Migrations

When you make [changes that require a DB migration](https://www.vendure.io/docs/developer-guide/migrations/), run:

```bash
npx nx run server:migration <migration-name>
```

This generates a new migration file in [./apps/server/migrations](./apps/server/migrations). The migration runs automatically the next time you start the server. Review the migration file before running the server to ensure correctness.

Commit migration files to source control so they run in production on deploy.

> Hint: If you update the migration file, make sure to delete the compiled file from cache before running the server again

## Deployment

This repo is designed to be deployed as Docker images:

- [Server Dockerfile](./apps/server/Dockerfile)
- [Worker Dockerfile](./apps/worker/Dockerfile)
- [Dashboard Dockerfile](./apps/admin-dashboard/Dockerfile) — nginx-based SPA

Configure your hosting platform to clone the repo and build the provided Dockerfiles to create ready-to-run images.

### Build internals

The `build` command uses a custom Nx executor named "package" (see [/tools/executors/package](./tools/executors/package)). This executor creates a `package.json` for the server/worker containing _only_ their run-time dependencies, rather than the entire root `package.json`.

## Additional tools

### Generating a new Vendure plugin

```bash
nx g vendure-nx:vendure-plugin-generator --name=Example --uiExtension=true
```

Plugins are generated in the `libs` directory. Each plugin includes a `dashboard/` directory for React-based dashboard extensions (using `@vendure/dashboard`).

Read more: [tools/vendure-nx/README.md](tools/vendure-nx/README.md)

### GraphQL TypeScript code generation

[graphql-code-generator](https://graphql-code-generator.com/) generates TypeScript types from the Vendure server's GraphQL APIs. This ensures resolvers and tests stay in sync with schema changes and CustomFields.

1. Run the server with `npm run dev:server`
2. Execute the `codegen` target for the library you are working on:

```bash
npx nx run <lib-name>:codegen
```
