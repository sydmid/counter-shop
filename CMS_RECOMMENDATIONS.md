# Open-Source CMS Evaluation & Integration Strategy
**Target Platform:** SteamItemExchange (counter-shop)
**Technology Stack:** Next.js 15 (App Router), TypeScript, PostgreSQL (Prisma), Redis, Python FastAPI

---

## Executive Summary

To fulfill the business requirements across both **Phase 1 (AI-Assisted Content Generator)** and **Phase 2 (Tailored Admin Dashboard)**, we evaluated the leading open-source CMS solutions based on feature richness, architecture fit, database compatibility, ease of integration, and extensibility.

### Key Recommendation
- **Top Choice (#1 Fittest): Payload CMS 3.0**
  - *Why:* Payload 3.0 runs **natively inside Next.js 15 App Router**. It operates in the same Node.js runtime, shares the existing PostgreSQL database, provides full TypeScript end-to-end typing, and supports embedding custom React/Tailwind admin components.
- **Runner-Up (Best Standalone Engine): Directus**
  - *Why:* Directus connects directly onto existing PostgreSQL schema without imposing proprietary table transformations. It features a built-in visual workflow engine (**Directus Flows**) ideal for AI content automation and highly customizable dashboard widgets.

---

## Detailed Evaluation Matrix

| Feature / Criteria | **Payload CMS 3.0** | **Directus** | **Strapi v5** | **KeystoneJS 6** |
| :--- | :--- | :--- | :--- | :--- |
| **Architecture** | Native Next.js 15 App Router | Standalone Node.js service | Standalone Node.js service | Express + Next.js Admin |
| **Database Support** | PostgreSQL / Drizzle / Mongo | PostgreSQL (Direct reflection) | PostgreSQL / MySQL / SQLite | PostgreSQL / MySQL / SQLite |
| **Phase 1: Content Generation & AI** | Native Lexical Editor, server hooks for OpenAI/Claude/Worker triggers | Directus Flows (Visual automation, webhooks, LLM triggers) | Rich Media Manager, AI generator plugins | Custom GraphQL hooks |
| **Phase 2: Admin Dashboard Customization** | Custom React components, native RBAC, custom dashboard pages | Configurable admin layouts, metric widgets, row/field RBAC | Custom admin plugins, built-in role management | React Admin customization via TS config |
| **TypeScript Integration** | 100% Native End-to-End | Generated SDK types | Generated SDK types | 100% Native End-to-End |
| **License** | Open Source (MIT) | Open Source (BSL 1.1 / GPLv3 core) | Open Source (Community Edition) | Open Source (MIT) |

---

## In-Depth Analysis of Top Fittest Solutions

### 1. Payload CMS 3.0 (Recommended)
Payload CMS 3.0 is designed ground-up for Next.js App Router applications.

#### Key Strengths for Our Stack:
1. **Unified Infrastructure & Zero Overhead**:
   - Runs directly under `/app/(payload)/admin` in Next.js 15.
   - Eliminates the need to host, deploy, and maintain a separate CMS server or docker container.
2. **Phase 1 - AI Content Generation Workflow**:
   - **Lexical Editor**: Extensible block-based rich text editor for blogs, market guides, and announcement pages.
   - **Lifecycle Hooks**: `beforeChange` and `afterChange` hooks can trigger AI pipelines (e.g., calling OpenAI or the Python FastAPI worker in `scripts/steam_service.py` to auto-generate item pricing analyses, SEO descriptions, and translations).
3. **Phase 2 - Custom Business Admin Dashboard**:
   - Allows importing existing React components (`components/ui/*`, Radix UI, Recharts) directly into the admin panel.
   - Custom dashboard widgets for monitoring trade escrow, real-time market ticker, user verification statuses, and trade volume analytics.
4. **Shared Database & Models**:
   - Interoperable with existing PostgreSQL tables or synced via Prisma models.

---

### 2. Directus
Directus is a database-first data platform that turns any SQL database into a REST and GraphQL API with a rich admin UI.

#### Key Strengths for Our Stack:
1. **Direct Database Reflection**:
   - Can attach directly to the existing PostgreSQL database (`DATABASE_URL`).
   - Does not dictate or alter existing Prisma schema layouts.
2. **Phase 1 - Directus Flows (Visual AI Generator Engine)**:
   - Built-in drag-and-drop automation builder.
   - Easily configured to call OpenAI APIs, format JSON responses, and publish content automatically upon drafting.
3. **Phase 2 - Out-of-the-Box Analytics Dashboard**:
   - Rich dashboard canvas supporting charts, metrics, lists, and real-time SQL aggregation out of the box.
   - Granular Role-Based Access Control (RBAC) down to row and field-level permissions.

---

### 3. Strapi v5
Strapi is the most widely adopted open-source headless CMS.

#### Strengths & Considerations:
- **Pros**: Large ecosystem of community plugins, including ready-to-use AI content generation modules (e.g., ChatGPT content generation plugins).
- **Cons**: Requires running as a separate Node service; customizing the admin UI beyond standard CRUD views requires building dedicated Strapi plugins.

---

### 4. KeystoneJS 6
KeystoneJS is a GraphQL-focused TypeScript headless CMS built on top of Prisma.

#### Strengths & Considerations:
- **Pros**: Uses Prisma ORM under the hood, matching our existing data layer cleanly.
- **Cons**: Requires more custom code setup for Phase 1 AI automation compared to Payload or Directus.

---

## Phased Implementation Roadmap

```
+-----------------------------------------------------------------------------------+
|                              PHASE 1: CONTENT GENERATOR                            |
+-----------------------------------------------------------------------------------+
| 1. Mount Payload CMS 3.0 under Next.js 15 App Router (/admin route).              |
| 2. Define Content Collections: Articles, Market Analyses, SEO Landing Pages.      |
| 3. Integrate AI Hooks: Connect `afterChange` / `beforeChange` hooks to AI models    |
|    or Python worker for automated skin pricing analysis & description drafting.  |
| 4. Serve generated content on Next.js frontend via Server Components / ISR.        |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                          PHASE 2: BUSINESS ADMIN DASHBOARD                         |
+-----------------------------------------------------------------------------------+
| 1. Configure Role-Based Access Control (RBAC): Admin, Moderator, Content Author. |
| 2. Integrate Custom React Dashboard Widgets:                                      |
|    - Trade Escrow & Bot Status Monitor                                            |
|    - Realtime Market Pricing & Arbitrage Ticker (using socket.io / Redis)          |
|    - User KYC & Trade Dispute Settlement Panel                                    |
| 3. Connect Prisma / Direct DB Access for Administrative CRUD Operations.          |
+-----------------------------------------------------------------------------------+
```

---

## Recommended Action Plan

1. **Adopt Payload CMS 3.0** as the primary CMS engine due to its native Next.js 15 alignment, zero extra deployment footprint, and React component extensibility.
2. If strict separation of administrative backend services is preferred by ops teams, **Directus** serves as the best alternative standalone platform.
