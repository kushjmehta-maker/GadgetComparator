# AI GADGET ADVISOR — TECHNICAL ARCHITECTURE & SYSTEM DESIGN

## 1. TECHNOLOGY STACK

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand (lightweight, TypeScript-friendly)
- **Animations:** Framer Motion
- **Charts:** Recharts (for visual comparisons)

### Backend
- **Runtime:** Next.js API Routes + Edge Functions
- **Database:** Supabase (PostgreSQL)
- **Cache:** Supabase Edge Functions + Vercel KV (Redis)
- **Authentication:** Supabase Auth (Google, email)
- **File Storage:** Supabase Storage (for product images cache)

### AI/ML
- **Primary LLM:** Claude API (claude-sonnet-4-6)
- **Structured Output:** Claude with tool_use for JSON responses
- **Embeddings:** Voyage AI or OpenAI text-embedding-3-small (for product search)

### Infrastructure
- **Hosting:** Vercel (frontend + API routes)
- **Database:** Supabase (managed Postgres)
- **Scraping:** Playwright on Supabase Edge Functions or a lightweight cron worker
- **Monitoring:** Vercel Analytics + PostHog (free tier)
- **CI/CD:** GitHub Actions → Vercel auto-deploy

### External APIs
- Amazon Product Advertising API (PA-API 5.0)
- Flipkart Affiliate API
- Google Shopping API (for price comparison)
- Claude API (Anthropic)

---

## 2. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Chat UI  │  │ Results  │  │ Compare  │  │ Product │ │
│  │          │  │ Page     │  │ Table    │  │ Detail  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │              │              │              │      │
└───────┼──────────────┼──────────────┼──────────────┼──────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌─────────────────────────────────────────────────────────┐
│                   API GATEWAY (Next.js API Routes)       │
│  /api/query    /api/compare    /api/products   /api/rank │
└────────┬────────────┬────────────┬────────────┬─────────┘
         │            │            │            │
         ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                         │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Intent       │  │ Product      │  │ Normalization  │  │
│  │ Parser       │  │ Retrieval    │  │ Engine         │  │
│  │ (Claude API) │  │ Service      │  │                │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                 │                   │          │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌───────┴───────┐  │
│  │ Weight       │  │ Scoring      │  │ Explanation   │  │
│  │ Generator    │  │ Engine       │  │ Generator     │  │
│  │ (Claude API) │  │              │  │ (Claude API)  │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
│                                                          │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                            │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Supabase     │  │ Vercel KV    │  │ Supabase      │  │
│  │ PostgreSQL   │  │ (Redis)      │  │ Storage       │  │
│  │              │  │ Cache        │  │ (Images)      │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  EXTERNAL DATA SOURCES                    │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Amazon   │  │ Flipkart │  │ Google   │  │ Manual  │ │
│  │ PA-API   │  │ API      │  │ Shopping │  │ Seed DB │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 3. DATABASE SCHEMA (Supabase/PostgreSQL)

### Core Tables

```sql
-- Product Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,          -- 'projector', 'smartphone', 'smartwatch'
  display_name TEXT NOT NULL,          -- 'Projectors', 'Smartphones'
  icon TEXT,                           -- emoji or icon name
  normalization_config JSONB NOT NULL, -- category-specific normalization rules
  weight_prompt_template TEXT,         -- LLM prompt template for this category
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  brand TEXT,
  model_number TEXT,
  slug TEXT UNIQUE NOT NULL,           -- URL-friendly identifier
  image_url TEXT,
  thumbnail_url TEXT,
  description TEXT,
  
  -- Pricing
  price_current NUMERIC(10,2),
  price_original NUMERIC(10,2),
  currency TEXT DEFAULT 'INR',
  
  -- Source tracking
  amazon_asin TEXT,
  flipkart_pid TEXT,
  amazon_url TEXT,
  flipkart_url TEXT,
  
  -- Metadata
  launch_date DATE,
  is_active BOOLEAN DEFAULT true,
  data_quality_score NUMERIC(3,2),    -- 0-1, how complete/verified the data is
  last_scraped_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price_current);
CREATE INDEX idx_products_slug ON products(slug);

-- Product Specifications (EAV model for flexibility)
CREATE TABLE product_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  spec_key TEXT NOT NULL,              -- 'brightness', 'resolution', 'battery_mah'
  spec_value TEXT NOT NULL,            -- raw value: '500 ANSI lumens', '1080p'
  spec_value_numeric NUMERIC,          -- parsed numeric: 500
  spec_value_normalized NUMERIC(5,4),  -- 0-1 normalized value
  confidence NUMERIC(3,2) DEFAULT 1.0, -- how confident we are in this value
  source TEXT,                         -- 'amazon', 'flipkart', 'manual', 'scraped'
  verified BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, spec_key)
);

CREATE INDEX idx_specs_product ON product_specs(product_id);
CREATE INDEX idx_specs_key ON product_specs(spec_key);

-- Price History
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  price NUMERIC(10,2) NOT NULL,
  source TEXT NOT NULL,                -- 'amazon', 'flipkart'
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_history_product ON price_history(product_id);
CREATE INDEX idx_price_history_date ON price_history(recorded_at);

-- User Queries
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,                     -- for anonymous users
  
  -- Input
  raw_input TEXT NOT NULL,
  query_mode TEXT NOT NULL,            -- 'compare' or 'discover'
  
  -- Parsed intent
  parsed_intent JSONB NOT NULL,
  /*
    {
      "category": "projector",
      "budget": { "min": 10000, "max": 20000 },
      "use_cases": ["netflix", "gaming"],
      "preferences": ["portable", "auto-focus"],
      "constraints": ["must have netflix certification"],
      "products_to_compare": ["uuid1", "uuid2"]  -- for Mode A
    }
  */
  
  -- Results
  generated_weights JSONB,
  ranking_results JSONB,
  explanation TEXT,
  
  -- Analytics
  result_count INTEGER,
  time_to_result_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_queries_user ON queries(user_id);
CREATE INDEX idx_queries_mode ON queries(query_mode);

-- Rankings (individual product scores per query)
CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES queries(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  
  rank_position INTEGER NOT NULL,
  total_score NUMERIC(5,4) NOT NULL,   -- 0-1 final score
  value_score NUMERIC(5,4),            -- score/price ratio
  feature_scores JSONB NOT NULL,       -- { "brightness": 0.85, "price": 0.7, ... }
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rankings_query ON rankings(query_id);

-- User Events (analytics)
CREATE TABLE user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  query_id UUID REFERENCES queries(id),
  
  event_type TEXT NOT NULL,
  /*
    'query_submitted', 'results_viewed', 'product_clicked',
    'affiliate_clicked', 'comparison_shared', 'feedback_given'
  */
  event_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_user ON user_events(user_id);
CREATE INDEX idx_events_type ON user_events(event_type);
CREATE INDEX idx_events_query ON user_events(query_id);

-- Feedback
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES queries(id),
  user_id UUID REFERENCES auth.users(id),
  
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback_type TEXT,                  -- 'helpful', 'wrong_recommendation', 'missing_product'
  comment TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Users can only see their own queries
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own queries" ON queries
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Products are publicly readable
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are public" ON products
  FOR SELECT USING (true);

-- Same for specs
ALTER TABLE product_specs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Specs are public" ON product_specs
  FOR SELECT USING (true);
```

---

## 4. CORE ENGINE DESIGN

### 4.1 Intent Parser

Converts natural language to structured query using Claude API.

```typescript
// types/intent.ts
interface ParsedIntent {
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
    flexibility: 'strict' | 'flexible' | 'open';
  };
  use_cases: string[];              // ['netflix', 'gaming', 'presentations']
  preferences: string[];            // ['portable', 'quiet', 'bright']
  constraints: string[];            // ['must have HDMI ARC', 'no Chinese brands']
  products_to_compare?: string[];   // product names/URLs for Mode A
  priority_order: string[];         // ['picture_quality', 'price', 'portability']
}
```

**Claude Prompt for Intent Parsing:**
```
You are a tech product advisor. Parse the user's query into structured JSON.

User query: "{user_input}"

Extract:
1. category: the product category (projector, smartphone, smartwatch, laptop, earbuds)
2. budget: min/max in INR, flexibility (strict if they say "under X", flexible if approximate)
3. use_cases: what they'll use it for
4. preferences: nice-to-haves they mentioned
5. constraints: hard requirements / dealbreakers
6. products_to_compare: specific product names if mentioned
7. priority_order: inferred priority of features based on what they emphasized

Return valid JSON matching the ParsedIntent schema.
```

### 4.2 Normalization Engine

Converts raw specs to 0–1 scale for comparison.

```typescript
// lib/normalization.ts

type NormalizationType = 'linear' | 'log' | 'log_inverted' | 'tier' | 'binary' | 'inverted';

interface NormalizationRule {
  type: NormalizationType;
  min?: number;
  max?: number;
  mapping?: Record<string, number>;  // for tier-based
  higher_is_better?: boolean;
}

// Category-specific normalization configs
const PROJECTOR_NORMS: Record<string, NormalizationRule> = {
  brightness_ansi: {
    type: 'log',
    min: 100,        // cheapest projectors
    max: 3000,       // high-end home theater
    higher_is_better: true
  },
  resolution: {
    type: 'tier',
    mapping: {
      '480p': 0.1,
      '720p': 0.4,
      '1080p': 0.7,
      '1440p': 0.85,
      '4K': 1.0
    }
  },
  price: {
    type: 'log_inverted',
    min: 5000,
    max: 200000
  },
  netflix_certified: {
    type: 'binary'    // 0 or 1
  },
  auto_focus: {
    type: 'tier',
    mapping: {
      'none': 0,
      'manual': 0.3,
      'auto': 0.7,
      'full_auto': 1.0
    }
  },
  speaker_watts: {
    type: 'log',
    min: 1,
    max: 30,
    higher_is_better: true
  },
  weight_kg: {
    type: 'inverted',
    min: 0.3,
    max: 5.0         // lighter is better for portability
  },
  throw_ratio: {
    type: 'inverted',
    min: 0.5,
    max: 2.0         // lower = shorter throw = better for small rooms
  }
};

function normalize(value: number, rule: NormalizationRule): number {
  switch (rule.type) {
    case 'linear':
      return clamp((value - rule.min!) / (rule.max! - rule.min!));
    case 'log':
      return clamp(Math.log(value / rule.min!) / Math.log(rule.max! / rule.min!));
    case 'log_inverted':
      return 1 - clamp(Math.log(value / rule.min!) / Math.log(rule.max! / rule.min!));
    case 'inverted':
      return 1 - clamp((value - rule.min!) / (rule.max! - rule.min!));
    case 'tier':
      return rule.mapping![value.toString()] ?? 0;
    case 'binary':
      return value ? 1 : 0;
    default:
      return 0;
  }
}

function clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}
```

### 4.3 Weight Generator

LLM generates feature weights based on user intent.

```typescript
interface GeneratedWeights {
  weights: Record<string, number>;   // must sum to 1.0
  constraints: string[];              // hard filters
  reasoning: string;                  // why these weights
}
```

**Claude Prompt for Weight Generation:**
```
You are scoring tech products for a user. Given their requirements, generate feature weights.

Category: {category}
User intent: {parsed_intent_json}

Available features for this category: {feature_list}

Rules:
1. Weights MUST sum to exactly 1.0
2. Features the user explicitly cares about get higher weights
3. Use case determines which features matter most
4. Budget sensitivity should be reflected in price weight
5. Include constraints as hard filters (products failing these are excluded)

Return JSON: { "weights": {...}, "constraints": [...], "reasoning": "..." }

Example for "Netflix projector under ₹20K for bedroom":
{
  "weights": {
    "resolution": 0.20,
    "brightness_ansi": 0.15,
    "netflix_certified": 0.20,
    "auto_focus": 0.10,
    "speaker_watts": 0.10,
    "price": 0.15,
    "throw_ratio": 0.05,
    "noise_db": 0.05
  },
  "constraints": ["netflix_certified == true", "price <= 20000"],
  "reasoning": "Netflix certification is critical (non-negotiable for the use case). Resolution and brightness matter for movie quality. Short throw preferred for bedroom. Price weighted moderately since budget is specified."
}
```

### 4.4 Scoring Engine

```typescript
interface ProductScore {
  product_id: string;
  total_score: number;
  value_score: number;
  feature_scores: Record<string, number>;
  passes_constraints: boolean;
  constraint_failures: string[];
}

function scoreProduct(
  product: Product,
  specs: ProductSpec[],
  weights: GeneratedWeights,
  normConfig: Record<string, NormalizationRule>
): ProductScore {
  const featureScores: Record<string, number> = {};
  let totalScore = 0;

  // Check constraints first
  const constraintFailures = checkConstraints(product, specs, weights.constraints);
  
  // Score each feature
  for (const [feature, weight] of Object.entries(weights.weights)) {
    const spec = specs.find(s => s.spec_key === feature);
    if (!spec) {
      featureScores[feature] = 0;
      continue;
    }
    
    const rule = normConfig[feature];
    const normalizedValue = rule.type === 'tier'
      ? (rule.mapping![spec.spec_value] ?? 0)
      : normalize(spec.spec_value_numeric!, rule);
    
    const confidence = spec.confidence;
    const weightedScore = weight * normalizedValue * confidence;
    
    featureScores[feature] = normalizedValue;
    totalScore += weightedScore;
  }

  // Value score = feature score / log(price)
  const price = product.price_current;
  const valueScore = price > 0
    ? totalScore / Math.log10(price)
    : totalScore;

  return {
    product_id: product.id,
    total_score: totalScore,
    value_score: valueScore,
    feature_scores: featureScores,
    passes_constraints: constraintFailures.length === 0,
    constraint_failures: constraintFailures
  };
}

function rankProducts(scores: ProductScore[]): ProductScore[] {
  return scores
    .filter(s => s.passes_constraints)
    .sort((a, b) => b.total_score - a.total_score);
}
```

### 4.5 Explanation Generator

```
Given the ranking results, generate a clear, conversational explanation.

User query: {original_query}
Top ranked product: {product_name} (score: {score})
Runner-up: {runner_up_name} (score: {score})

Feature comparison:
{feature_scores_table}

Write a 3-4 sentence explanation that:
1. States the winner and why
2. Mentions the key differentiating feature
3. Acknowledges what the runner-up does better
4. Relates back to the user's specific use case

Tone: Confident, helpful, like a knowledgeable friend. Not salesy.
```

---

## 5. API DESIGN

### Endpoints

```
POST /api/query
  Body: { input: string, mode: 'compare' | 'discover' }
  Response: { query_id, parsed_intent, status: 'processing' }

GET /api/query/:id/results
  Response: { rankings, explanation, comparison_table, metadata }

POST /api/compare
  Body: { product_ids: string[] }
  Response: { comparison_table, rankings }

GET /api/products/search
  Query: ?q=string&category=string&min_price=number&max_price=number
  Response: { products: Product[] }

GET /api/products/:slug
  Response: { product, specs, price_history }

GET /api/categories
  Response: { categories: Category[] }

POST /api/feedback
  Body: { query_id, rating, feedback_type, comment }
  Response: { success: true }
```

### Streaming Response

For the main query flow, use Server-Sent Events (SSE) for progressive updates:

```
POST /api/query/stream
  Body: { input: string, mode: 'compare' | 'discover' }
  
  SSE Events:
  → { type: 'intent_parsed', data: { parsed_intent } }
  → { type: 'products_found', data: { count, products_preview } }
  → { type: 'scoring_progress', data: { scored: 3, total: 8 } }
  → { type: 'ranking_complete', data: { rankings } }
  → { type: 'explanation_ready', data: { explanation } }
  → { type: 'done', data: { query_id, full_results } }
```

---

## 6. PRODUCT DATA PIPELINE

### 6.1 Data Sources (Priority Order)

1. **Manual Seed Data** (MVP) — Curated JSON files for initial 50+ products
2. **Amazon PA-API 5.0** — Official API, rate-limited but reliable
3. **Flipkart Affiliate API** — Product search + details
4. **Web Scraping** (Playwright) — Fallback for specs not in APIs
5. **Community Contributions** — User-submitted corrections

### 6.2 Scraping Pipeline

```typescript
// Runs as a Supabase Edge Function on a cron schedule
// or triggered manually for specific products

interface ScrapedProduct {
  source: 'amazon' | 'flipkart' | 'manual';
  name: string;
  brand: string;
  price: number;
  specs: Record<string, string>;
  image_url: string;
  product_url: string;
  scraped_at: Date;
}

// Pipeline stages:
// 1. Fetch product page
// 2. Extract specs from structured data (JSON-LD, meta tags)
// 3. Parse spec table HTML
// 4. Use Claude to extract/verify specs from unstructured description
// 5. Cross-reference multiple sources
// 6. Normalize and store
```

### 6.3 Spec Verification

```typescript
// When a spec seems inflated or inconsistent:
interface SpecVerification {
  claimed_value: string;       // "16,000 lumens"
  verified_value: string;      // "400 ANSI lumens"
  confidence: number;          // 0.3 (low confidence in claimed)
  verification_source: string; // "cross-referenced with ProjectorCentral"
  flag: 'inflated' | 'verified' | 'unverifiable';
}

// Use Claude to flag suspicious specs:
// "This projector claims 16,000 lumens at ₹12,000. 
//  Typical ANSI lumens for this price range is 200-500.
//  Flag: inflated. Estimated true value: ~400 ANSI lumens."
```

---

## 7. CACHING STRATEGY

### Cache Layers

1. **Vercel Edge Cache** — Static pages, product pages (ISR 1 hour)
2. **Vercel KV (Redis)** — Query results (TTL 24 hours), price data (TTL 6 hours)
3. **Supabase** — Persistent storage for all product data

### Cache Keys

```
product:{id}:specs        → TTL 24h
product:{id}:price        → TTL 6h
query:{hash}:results      → TTL 24h (same query = same results for a day)
category:{id}:products    → TTL 1h
```

### LLM Response Caching

```typescript
// Hash the intent (not raw query) to cache LLM responses
// "best projector under 20K for Netflix" and 
// "Netflix projector budget 20000" should hit the same cache

function intentHash(intent: ParsedIntent): string {
  const normalized = {
    category: intent.category,
    budget: intent.budget,
    use_cases: intent.use_cases.sort(),
    constraints: intent.constraints.sort()
  };
  return sha256(JSON.stringify(normalized));
}
```

---

## 8. SECURITY CONSIDERATIONS

- **Rate Limiting:** 10 queries/min per IP (anonymous), 30/min per user
- **Input Sanitization:** Validate all user inputs, escape HTML
- **API Keys:** All external API keys in Vercel environment variables
- **RLS:** Supabase Row Level Security on all user-specific tables
- **CORS:** Restrict to production domain only
- **Affiliate Links:** Track via redirect to prevent link manipulation
- **Content Security Policy:** Strict CSP headers

---

## 9. MONITORING & OBSERVABILITY

### Key Metrics to Track
- API response times (p50, p95, p99)
- LLM API latency and token usage
- Cache hit rates
- Scraping success rates
- Error rates by endpoint
- Database query performance

### Tools
- **Vercel Analytics** — Web vitals, page performance
- **PostHog** — User behavior, funnels, feature flags
- **Supabase Dashboard** — Database metrics, API usage
- **Sentry** (free tier) — Error tracking

---

## 10. SCALABILITY PATH

### Phase 1 (0–10K MAU): Current Architecture
- Vercel free/hobby tier
- Supabase free tier (500MB database)
- ~$50/month in Claude API costs

### Phase 2 (10K–100K MAU):
- Vercel Pro ($20/month)
- Supabase Pro ($25/month)
- Redis caching reduces LLM calls by 60%
- ~$200/month in Claude API costs
- Add CDN for product images

### Phase 3 (100K–1M MAU):
- Vercel Enterprise
- Supabase Team plan
- Dedicated scraping infrastructure
- Consider self-hosted embedding model
- ~$1000/month total infrastructure

---

*Document Version: 1.0*
*Created: April 2026*
