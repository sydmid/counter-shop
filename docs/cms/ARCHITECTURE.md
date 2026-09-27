# Architecture Documentation: CMS and Database Separation

This document outlines the architectural separation of concerns between our core marketplace data and our editorial content, specifically focusing on database schemas and data retrieval in Next.js.

## Database Separation: Prisma vs. Payload

To maintain a secure, robust, and clean architecture, we strictly separate transactional marketplace data from editorial content within our PostgreSQL database.

*   **Transactional State (Prisma + PostgreSQL):** Core marketplace operations such as Users, InventoryItems, MarketListings, and Trades are fully managed by Prisma. Prisma maps its models to the default `public` schema in the PostgreSQL database. This data represents the critical business logic of the application.
*   **Editorial State (Payload + PostgreSQL):** All editorial and content management operations, including Articles, Categories, and CMS Users, are managed by Payload CMS. To prevent Prisma's automated commands (like `db push` or migrations) from accidentally altering or destroying CMS data, Payload utilizes the `@payloadcms/db-postgres` adapter configured to use a dedicated, isolated schema named `cms`.

### Configuration details:
*   The connection for Prisma is typically defined via `DATABASE_URL` mapping to the `public` schema.
*   The connection for Payload is defined explicitly via `CMS_DATABASE_URL`, which appends `?schema=cms` to the connection string, ensuring Payload only interacts with its designated schema.

## Next.js Integration: Using `getPayload`

We leverage Next.js 15 App Router natively with Payload (v3.0). To ensure secure and efficient access to editorial content without unnecessarily exposing APIs or impacting the core marketplace logic, Next.js routes use the Local API provided by Payload.

Instead of making HTTP requests to external endpoints, server-side routes directly instantiate the Payload instance using `getPayload({ config: configPromise })`.

### Examples in Codebase:

*   **Blog Listing (`app/blog/page.tsx`):** Retrieves the published articles list locally.
*   **Single Article (`app/blog/[slug]/page.tsx`):** Fetches the specific article data dynamically based on the slug.
*   **AI Draft API (`app/api/cms/ai-draft/route.ts`):** Creates AI-generated drafts by interacting directly with the Payload local API, ensuring rapid processing while maintaining the security of the internal database connection.

By using `getPayload` locally, we avoid the overhead of network requests within the server and ensure our Next.js frontend is tightly integrated with the CMS backend securely.