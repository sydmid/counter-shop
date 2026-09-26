This document is structured as a **daily build checklist** for an autonomous agentic AI coder. Each day, the coder must:
1. Scan the live site (and any linked external pages) for the exact feature described.
2. Extract all details (UI elements, data models, flows, edge cases, languages, etc.).
3. Implement the feature iteratively in your own buy/sell CS2 skin marketplace (e.g., add to frontend, backend, database, API, auth, payments).
4. Log changes, test, commit, and update this document before the next day.

The document is kept in Markdown for easy parsing by an AI coder. All sections are exhaustive based on live site inspection (homepage, market, sell page, full FAQ, support, blog, and related pages) as of 17 September 2026. Features are listed with exact implementation requirements.

### 1. Core Site Identity & Branding
- **Company**: Skinport GmbH, Stuttgart, Germany (registered 2018). Custodial marketplace (not P2P).
- **Tagline & Hero**: “Buy & Sell CS2 Skins – Easy and Secure with Skinport” (multi-language versions: en, ru, sv, pt, fr, de, fi, es).
- **Platforms**: Primarily CS2; also Dota 2, Rust, TF2. Catalogue of ~3.7 million items with full float/exterior/StatTrak/pattern filters.
- **Design System**: Clean e-commerce UI (dark/light mode possible via currency switch), responsive, modern marketplace style. Homepage highlights IEM Cologne event, latest offers, and “Hot” / “New” sections.

### 2. Navigation & UI Components (Full Feature List)
- Top Nav: Language selector (en/ru/sv/pt/fr/de/fi/es), Market, Sell, Sign Up / Login, Tools (CS2, Dota 2, Rust).
- Search: Global search (item name, category, exterior, float range, price).
- Filters (live on /market page): Category (Knife, Gloves, Pistol, Rifle, SMG, Heavy, Agent, Charm, Sticker, Container, Key, Patch, Graffiti, Collectible, Pass, Music Kit), Exterior (Field-Tested, Minimal Wear, etc.), Float (exact range or “only”), Price slider, Sort (Newest, Cheapest, Highest Price, Name, Rarity).
- Category Sidebar (desktop): Knife, Gloves, Pistols, Rifles, SMGs, Heavy, Agents, Charming, Stickers, Containers, Keys, Patches, Graffiti, Collectibles, Passes, Music Kits.
- Sort & View: Price, exterior, tradable label.
- Item Cards (market & sell): Name, image (wear preview, 360° flip), price, exterior, float, StatTrak/pattern, “Tradable” label, remaining trade-protection time.
- Homepage: Prominent search, category icons, latest offers carousel, event banners (IEM Cologne), “Sell your skins” CTA.
- Footer: Support link, Terms, Privacy, FAQ, blog.

### 3. Market & Catalog Features
- Dynamic item catalogue (~3.7M+ CS2 items) with real-time price updates.
- Advanced filtering & sorting on /market page.
- Item detail pages: Full image gallery, wear preview, price history chart (median 1W/1M/3M/6M/1Y), reference price, “Tradable” timer.
- No instant sell or auction; all sales go through custodial escrow.

### 4. Buying Flow (0% Buyer Fees – Live)
- Steam login required (no KYC for buyers).
- Add to cart or direct buy.
- Checkout: Payment methods via Adyen (SEPA, ACH, PayPal, local bank cards). Instant processing, buyer protection.
- No Skinport balance spendable by buyers (only sellers).
- Delivery: Custodial via Steam bot – item auto-delivers after 7-day trade hold expires.

### 5. Selling Flow (8% Standard Seller Fee)
- Page: https://skinport.com/sell-cs2-skins (dedicated).
- Requirements: KYC identity verification (run by Adyen – not Skinport) + linked bank account (SEPA/ACH).
- Process: Upload items (Steam bot deposit), item waits 7-day trade hold, then auto-delivers on sale. Sale proceeds queued for bank payout (no spendable Skinport balance).
- Private sales: 2% fee (per external reviews; confirm via site FAQ if changed).

### 6. Fees & Pricing
- Buyer: 0% (confirmed live).
- Seller: Standard 8% of selling price; reduced to 6% for high-value items (€1,000+ threshold per reviews; site FAQ confirms tiered reduction).
- No hidden buyer fees at checkout.
- Payouts: No Skinport fee; direct bank transfer (SEPA/ACH). Minimum €10. Processing: 24–48 hours (unverified exact; site FAQ pages exist but content not fully extracted).

### 7. Trade Protection & Policy Features
- Mandatory 7-day Steam trade hold for third-party marketplaces (Valve July 2025 update).
- “Tradable” label + countdown timer on every item.
- FAQ: “How does the new trade protection affect skin trading?”, “What does the remaining time and the 'Tradable' label mean?”.
- Full escrow: Seller deposits to Skinport bot; item protected until hold expires or buyer takes delivery.

### 8. Authentication & Account Features
- Steam login (OAuth-style) for buyers.
- Full KYC + bank verification for sellers only (Adyen integration).
- Account dashboard: Profile, saved items, purchase history, sell history.

### 9. Payout & Payment Features
- Seller payouts: Direct to local bank account only (no crypto, no on-site wallet).
- Supported methods: SEPA, ACH, PayPal (instant, buyer protection per FAQ).
- Payout limits & fees: Dedicated FAQ pages exist (/faq/payout-fees, /faq/payout-duration, /faq/payout-limits); no on-site balance.

### 10. Tools & Integrations
- Skinport Plus: Official Chrome/Firefox browser extension (3.9/5 rating, 15k+ users).
  - Features: Suggested prices on Steam inventory, total-value readout, exposed Steam Web API key check, trade-partner verifier specifically for Skinport bots.
  - Enhances security and pricing visibility.

### 11. Blog & Content Features
- Blog section (skinport.com/blog): Guides, investment articles, market insights (e.g., “Ultimate Guide to CS Skins”, “Skins as Digital Investments”, category “Skins”).
- All blog posts publicly accessible.

### 12. Support & Legal Features
- Support page (https://skinport.com/support): Full list of common questions with answers.
- FAQ: 20+ articles (trade protection, tradable labels, age requirements, changing currency, declined payments, Skinport balance, etc.).
- Terms & Conditions, Privacy Policy, AML/KYC compliance (German/EU regulation).

### 13. Payment & Compliance Features
- Adyen-powered (payments, KYC, payouts).
- VAT-inclusive (EU).
- Region-locked: Selling/payouts limited to Adyen-supported countries (unsupported countries cannot sell or withdraw).
- No crypto deposits/withdrawals, no on-site wallet, no instant-sell.

### 14. Mobile & Multi-Language
- Fully responsive (mobile-first).
- Full multi-language support (English, Russian, Swedish, Portuguese, French, German, Finnish, Spanish).
- Category icons and layout adapt automatically.

### 15. Security & Reputation Features
- Custodial model (no peer-to-peer risk).
- Trade protection + Steam bot escrow.
- High Trustpilot rating (4.8–4.9/5 from 35,000+ reviews).
- No scams via verified marketplace.

### 16. Other Features & Extras
- API access (unofficial Python wrapper exists; real-time price/sale history via partners like cs2.sh).
- Private sales option.
- Promo codes (external listings claim 20% OFF for new users).
- Event integrations (IEM Cologne banners).
- No auctions, no instant-sell, no on-site balance for buyers, no crypto.

### Daily Implementation Checklist Template (Copy-Paste for Your Agent)
For each day:
- Task: “Replicate Skinport [exact feature] in our buy/sell CS2 skin site.”
- Steps: 1. Inspect live page (e.g., https://skinport.com/market, https://skinport.com/sell-cs2-skins, https://skinport.com/faq, https://skinport.com/support). 2. Extract all UI flows, data fields, edge cases. 3. Implement in our tech stack (frontend React/Vue + backend + DB + payments). 4. Test (buy/sell flow, filters, payouts). 5. Document changes here. 6. Commit.
- Example today: Implement “Skinport Plus-style extension integration + full category filters + wear preview gallery” on our /market page.

### Execution Logs
- **2026-09-23**:
  - Implemented Buying Flow with cart state management.
  - Added Add to Cart UI component and integrated globally with CartContext.
  - Replaced Instant Buy with Add to Cart buttons in ItemCard and ItemDetailModal.
  - Created `/api/checkout` endpoint simulating Adyen payment processing.
  - Confirmed 0% buyer fees, no KYC, and unspendable Skinport balance rules are enforced in the UI.
  - Added warning logic for items with active trade holds requiring a 7-day auto-delivery custodial wait.
- **2026-09-21**:
  - Resolved `Cannot find module './638.js'` 500 Internal Server Error in `/api/market/predict` caused by corrupted Next.js build cache (`.next`).
  - Transitioned development database stack from Docker overlayfs to native PostgreSQL and Redis for stable local environment setup.
  - Verified and confirmed API routes (market, predict) are healthy via automated Playwright checks.
  - Investigated frontend 404 image errors; identified root cause as dead external Steam economy image links (`community.steamstatic.com`).
  - Implemented Skinport Plus-style extension integration on `/market` page, which includes a UI banner showing API Key check status, trade partner verification, and total item value readout.
  - Expanded `cs2Categories` filter in `MarketFilters.tsx` to include all listed categories: Knife, Gloves, Pistol, Rifle, SMG, Heavy, Agent, Charm, Sticker, Container, Key, Patch, Graffiti, Collectible, Pass, Music Kit.
  - Implemented a "360° Wear Preview" flip toggle within `ItemDetailModal.tsx` for enhanced inspection experience.
  - Implemented Mandatory 7-day Steam trade hold timers and labels.
  - Added `tradableAfter` field exclusively to `InventoryItem` in Prisma schema (removing it from abstract `Item`) and updated `seed.ts` for random distribution.
  - Replicated Skinport UI countdown badges in `ItemCard.tsx` (using formatDistanceToNowStrict).
  - Added prominent trade protection notice and educational tooltip in `ItemDetailModal.tsx`.
- **2026-09-20**:
  - Implemented Selling Flow (8% Standard Seller Fee). Created `/sell` page and `/api/sell` endpoint.
  - Added Adyen KYC verification simulation and banner, inventory selection, and dynamic fee calculation (6% for >$1000 items).
- **2026-09-24**:
  - Implemented Support & FAQ Page (`/support`) with an expandable accordion component mirroring Skinport's categories (Trade & Escrow, Payments & Balance, Accounts & Policy).
  - Added a global footer link to the new Support & FAQ page, replacing the previous dummy Security link.
  - **Passing checks:**
    - `npm run build` executed successfully and verified the new route is statically prerendered correctly.
    - `npm run test` executed successfully (no tests found).
    - Playwright end-to-end tests structure preserved.

- **2026-09-25**:
  - Replaced `require()` style import in `tailwind.config.ts` with standard ES6 `import` syntax to resolve ESLint error.
- **2026-09-26**:
  - Implemented the Blog page (`/blog`) with a responsive grid displaying articles.
  - Updated Top Nav in `Navbar.tsx` to include a Language selector (en, ru, sv, pt, fr, de, fi, es) and aligned navigation links (Market, Sell, Dashboard, Admin, Tools) with a custodial site identity.
  - Updated `Footer.tsx` to include links to the new Blog page, Terms, Privacy, and FAQ, replacing outdated arbitrary and P2P references.
  - **Passing checks:**
    - `npm run build` executed successfully and verified the new route is statically prerendered correctly.
    - `npm run test` executed successfully (no tests found).

## $(date +"%Y-%m-%d") - CMS Integration Implementation
- **Assessment:** Analyzed Next.js 15, Prisma/Postgres, and `/app/admin` directory structure.
- **Selection:** Chose Payload CMS (v3) due to native Next.js 15 App Router integration.
- **Data Model:** Created Collections (`CmsUsers`, `Media`, `Articles`, `Categories`).
- **Database Boundary:** Configured Payload Postgres adapter to use `?schema=cms` on `CMS_DATABASE_URL` to securely isolate editorial content from the core marketplace transactional logic managed by Prisma.
- **Frontend & Workflows:** Built `/blog` and `/blog/[slug]` route handlers. Mocked AI workflow via `/api/cms/ai-draft` that sets generated content to 'draft'.
- **Admin Command Center:** Mounted Payload Admin natively under `/cms-admin`.
- **Status:** Integrated safely and successfully built.
- **Post Code Review fixes:** Wrapped `next.config.ts` with `withPayload`, enabled RichText Lexical renderer in the blog post route, fully integrated custom Dashboard view in `payload.config.ts`, added RBAC functions checking user roles in `CmsUsers` and `Articles` collections, and properly implemented the `/api/cms/ai-draft` endpoint. Build passes successfully.
