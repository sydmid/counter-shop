# SteamItemExchange (counter-shop)

High-performance marketplace and P2P trading engine for Counter-Strike 2 and Dota 2 items.

## Architecture

- **Frontend**: Next.js 15 (App Router, Server Components), TypeScript, Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Next.js Route Handlers, Socket.io (realtime ticker & P2P trade rooms)
- **Database & Cache**: PostgreSQL (Prisma ORM), Redis (sliding-window rate limiting & pricing cache)
- **Microservices**: Python FastAPI worker (`scripts/steam_service.py`) for Steam Community API scraping and trade dispatch
- **Security**: Steam OpenID 2.0 auth, HMAC-SHA256 provably fair audit verification, parameterized queries

## Quick Start

### 1. Prerequisites
- Node.js 18.18+ / 20+
- Docker & Docker Compose (or local PostgreSQL and Redis)

### 2. Environment Setup
```bash
cp .env.example .env
```
Key variables:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/counter_shop?schema=public"
REDIS_URL="redis://localhost:6379"
STEAM_API_KEY="your_steam_web_api_key"
JWT_SECRET="your_secure_jwt_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Local Run (Node)
```bash
# Install dependencies
npm install

# Database schema & seed data
npx prisma db push
npm run db:seed

# Development server
npm run dev
```

### 4. Docker One-Click Setup
Spins up PostgreSQL, Redis, Next.js web application, and the Python Steam worker:
```bash
docker-compose up --build -d
```

- Web UI: `http://localhost:3000`
- Steam Worker API: `http://localhost:8000/docs`

## API Endpoints (Core)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/market/items` | Query catalog with filters (wear, rarity, price) |
| GET | `/api/market/ticker` | 10s cached pricing ticker feed |
| GET | `/api/market/predict` | Time-series 7-day price forecasting |
| GET | `/api/arbitrage` | BUFF163 vs Steam Community margin scanner |
| POST | `/api/trade/create` | Create provably fair P2P trade offer |
| POST | `/api/trade/p2p` | Settle atomic trade exchange |

## License
MIT

## Content Management System (CMS) Integration
The repository integrates **Payload CMS (v3.0)** using native Next.js 15 App Router compatibility.

### Architecture Boundaries
- **Transactional State (Prisma + PostgreSQL):** Core marketplace operations (Trades, Inventory, Users) remain fully managed by Prisma.
- **Editorial State (Payload + PostgreSQL):** The CMS manages editorial operations (Articles, Categories, CMS Users). It utilizes the `@payloadcms/db-postgres` adapter and uses a dedicated schema (`cms`) within the same PostgreSQL instance to prevent Prisma's `db push` from accidentally destroying CMS data.

### Setup Instructions
1. Provide `PAYLOAD_SECRET` in your `.env`.
2. The DB url is strictly separated using the query string `?schema=cms` in the `CMS_DATABASE_URL` environment variable.
3. Access the admin dashboard at `/cms-admin`.
4. Role-based access control requires users to be authenticated via the `cms-users` collection.

### AI Draft Generation
Phase 1 integration features a custom action endpoint `/api/cms/ai-draft` that mocks AI generation and creates an article marked safely as a 'draft'. Future capabilities can connect to an LLM provider and safely deposit structured market reports for human review.
