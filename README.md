# AI Gadget Advisor

> A personalized tech product recommendation engine powered by Claude AI. Describe what you need — or paste product names to compare — and get ranked, explained recommendations tailored to your use case.

**This is not a comparison website. It's a decision engine.**

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)
![Azure OpenAI](https://img.shields.io/badge/Azure_OpenAI-gpt--5.4--pro-0078d4?logo=microsoftazure)

---

## How It Works

1. **Describe your needs** — e.g. *"Best projector under ₹20,000 for Netflix in a dark bedroom"*
2. **Claude parses your intent** — extracts budget, use cases, constraints, and priorities
3. **Weights are generated** — feature importance is dynamically assigned per query
4. **Products are scored** — each product is scored using a normalized weighted algorithm
5. **You get a ranked explanation** — winner, trade-offs, and reasons, written like a knowledgeable friend

Two modes:
- **Discover** — describe requirements, get ranked recommendations
- **Compare** — name specific products (e.g. *"Crossbeats Lumex Flix vs XGIMI MoGo 2"*), get a head-to-head breakdown

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion |
| AI | Azure OpenAI (`gpt-5.4-pro`) via `openai` SDK |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Cache | Vercel KV (Redis) |
| State | Zustand |
| Charts | Recharts |
| Analytics | PostHog |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages + API routes
│   ├── page.tsx            # Landing page with chat input
│   ├── compare/[slug]/     # Side-by-side comparison results
│   ├── discover/[slug]/    # Discovery ranking results
│   ├── product/[slug]/     # Product detail page
│   ├── category/[slug]/    # Category browse page
│   └── api/                # Route handlers (query, stream, products, feedback, og, redirect)
├── components/             # UI components (ChatInput, HeroRecommendation, ComparisonTable, etc.)
├── lib/
│   ├── ai/                 # Claude wrappers: intent parser, weight generator, explanation generator
│   ├── engine/             # Scoring engine: normalizer, scorer, ranker, validator
│   └── supabase/           # Server + browser Supabase clients
├── config/categories/      # Per-category normalization configs (projectors, smartphones, etc.)
├── store/                  # Zustand query store
├── hooks/                  # useQuery, useProducts, useAnalytics
└── types/                  # TypeScript interfaces (product, query, scoring, events)

data/seed/                  # Seed data: 15 projectors, 10 smartphones
supabase/migrations/        # Full PostgreSQL schema with RLS policies
```

---

## Scoring Engine

Products are scored using a **weighted normalization algorithm**:

- Each spec is normalized to `[0, 1]` using one of: `linear`, `log`, `log_inverted`, `inverted`, `tier`, or `binary`
- Claude generates per-query feature weights (summing to 1.0) based on the user's intent
- Weights × normalized scores × confidence = total score
- Hard constraints are checked first; failing products are excluded with reasons
- A **value score** (total score / log₁₀(price)) rewards efficiency

Spec inflation is flagged automatically — e.g. a ₹12,000 projector claiming 16,000 ANSI lumens gets a ⚠️ badge with an estimated true value.

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key
- (Optional) Vercel KV for caching, PostHog for analytics

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/ai-gadget-advisor.git
cd ai-gadget-advisor
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
AZURE_OPENAI_ENDPOINT=https://YOUR-RESOURCE.openai.azure.com
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_DEPLOYMENT=gpt-5.4-pro
AZURE_OPENAI_API_VERSION=2025-01-01-preview
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up the database

In your Supabase project, open the **SQL Editor** and run:

```
supabase/migrations/001_initial_schema.sql
```

### 4. Seed the database

```bash
npm run seed
```

This loads 15 projectors and 10 smartphones with full spec data.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Categories Supported

| Category | Specs Tracked |
|----------|--------------|
| Projectors | Brightness (ANSI lm), Resolution, Netflix certification, Auto-focus, Keystone, Speakers, WiFi, Throw ratio, Weight |
| Smartphones | Processor, RAM, Camera, Battery, Display, 5G, Charging speed |
| Smartwatches | Health sensors, Battery life, GPS, Display type, Water resistance |
| Laptops | CPU, RAM, Storage, Display, GPU, Battery, Weight |
| Earbuds | ANC, Driver size, Battery, Codec support, Water resistance, Fit type |

---

## Streaming UX

Queries use **Server-Sent Events (SSE)** for progressive results:

```
Understanding your needs...   →  intent parsed
Finding projectors...         →  N products found
Analyzing for your needs...   →  weights generated
Scoring products...           →  ranked list
Writing recommendation...     →  AI explanation ready
```

The full pipeline typically runs in 3–8 seconds.

---

## Deployment

Deploy to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set all environment variables in the Vercel dashboard, then deploy. The project includes a `vercel.json` for optimal configuration.

---

## Affiliate Disclosure

Buy buttons use affiliate tracking links (Amazon, Flipkart). All clicks route through `/api/redirect` for analytics before forwarding to the retailer.

---

## License

MIT
