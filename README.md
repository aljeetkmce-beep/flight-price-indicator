# Flight Price Indicator

A private personal dashboard that tracks daily flight prices from Indian cities to Thailand.

## Tracked Routes

| Origin | Destinations |
|---|---|
| TRV (Trivandrum) | BKK, DMK, HKT, KBV, CNX |
| COK (Kochi) | BKK, DMK, HKT, KBV, CNX |
| BLR (Bangalore) | BKK, DMK, HKT, KBV, CNX |

---

## Architecture

```
Next.js 14 (App Router)   — Frontend + API routes in one project
TypeScript                — Type safety across the full stack
SQLite + Prisma           — Local database, no separate server needed
Tailwind CSS              — Dashboard UI styling
Amadeus API               — Flight price data source
```

**Why this stack?**
- Single project runs everything — no separate frontend/backend servers
- SQLite is a local file — easy to backup, no cloud database cost
- Prisma generates TypeScript types from the schema automatically
- Amadeus has a free tier suitable for personal use

---

## Project Structure

```
flight-price-indicator/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── prices/         # GET /api/prices — fetch stored prices
│   │   └── routes/         # GET /api/routes — list all routes
│   ├── page.tsx            # Dashboard homepage (Phase 4)
│   └── layout.tsx          # Root layout with dark mode
├── components/             # Reusable React components (Phase 4)
├── lib/
│   ├── db.ts               # Prisma client singleton
│   └── amadeus.ts          # Amadeus API client (Phase 3)
├── prisma/
│   └── schema.prisma       # Database schema (3 tables)
├── scripts/
│   └── seed.ts             # Seeds the 15 fixed routes
├── types/
│   └── index.ts            # Shared TypeScript types
├── .env.example            # Environment variable template
└── package.json
```

---

## Setup

### Prerequisites
- Node.js 18+ — download at https://nodejs.org

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Amadeus API credentials.
Get free credentials at: https://developers.amadeus.com

### 3. Initialize database

```bash
npm run db:push      # Creates the SQLite database file
npm run db:generate  # Generates Prisma TypeScript client
npm run db:seed      # Seeds the 15 flight routes
```

### 4. Start development server

```bash
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | SQLite file path | `file:./dev.db` |
| `AMADEUS_API_KEY` | Amadeus API key | `abc123...` |
| `AMADEUS_API_SECRET` | Amadeus API secret | `xyz789...` |
| `AMADEUS_ENV` | API environment | `test` or `production` |
| `DEFAULT_CURRENCY` | Display currency | `USD` |
| `PRICE_FETCH_DAYS_AHEAD` | Days ahead to check | `30` |

---

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:push` | Create/update database from schema |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:seed` | Seed the 15 flight routes |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

---

## Development Phases

- [x] Phase 1 — Architecture, project setup, database schema
- [ ] Phase 2 — Project initialization (Node.js install, npm install)
- [ ] Phase 3 — Core implementation (Amadeus API, fetch script, API routes)
- [ ] Phase 4 — Dashboard UI (dark mode, price cards, charts)
- [ ] Phase 5 — Automation (scheduled daily price fetching)
- [ ] Phase 6 — Testing and optimization

---

## Privacy

This is a private personal tool. Do not deploy publicly or expose API keys.
