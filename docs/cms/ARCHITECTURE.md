# CMS Architecture

## Prisma vs Payload Data Separation
This application utilizes Prisma for core transactional marketplace operations (Trades, Inventory, Users) and Payload CMS for editorial content (Articles, Categories, CMS Users). These two systems are kept completely isolated.

## DB Schemas (public vs cms)
Both systems share the same PostgreSQL instance but utilize different schemas to ensure safety:
- **Prisma** uses the default `public` schema.
- **Payload CMS** uses a dedicated `cms` schema. This is configured via the `CMS_DATABASE_URL` environment variable (e.g., `postgresql://user:pass@host:5432/db?schema=cms`), ensuring that Prisma's `db push` or migrations do not accidentally destroy CMS data.

## How `getPayload` is Used in Next Routes
Payload CMS v3.0 is integrated natively with the Next.js 15 App Router (`@payloadcms/next`). We retrieve the initialized Payload instance inside Next.js server components and route handlers using `getPayload({ config: configPromise })`. This provides a local API that can be used to query and mutate CMS content securely, avoiding network overhead.
