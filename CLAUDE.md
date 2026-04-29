# AI GADGET ADVISOR — CLAUDE.md (Master Development Prompt)

## PROJECT OVERVIEW

Build "AI Gadget Advisor" — a personalized tech product recommendation engine. Users describe what they need (or paste product names), and the platform returns AI-scored, explained rankings tailored to their use case.

**This is NOT a comparison website. It's a decision engine.**

## TECH STACK

- **Frontend:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Backend:** Next.js API Routes (Route Handlers)
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Cache:** Vercel KV (Redis) for query/price caching
- **LLM:** Claude API (Anthropic) via `@anthropic-ai/sdk`
- **Scraping:** Playwright (for product data extraction)
- **Deployment:** Vercel
- **Analytics:** PostHog (free tier)
- **State Management:** Zustand
- **Charts:** Recharts
- **Animations:** Framer Motion

## PROJECT STRUCTURE

```
ai-gadget-advisor/
├── CLAUDE.md                          # This file
├── docs/
│   ├── 01-BUSINESS-PLAN.md
│   ├── 02-TECHNICAL-ARCHITECTURE.md
│   └── 03-UX-DESIGN-SPEC.md
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout with fonts, metadata
│   │   ├── page.tsx                   # Landing page
│   │   ├── globals.css                # Tailwind + custom CSS variables
│   │   ├── compare/
│   │   │   └── [slug]/page.tsx        # Comparison results page
│   │   ├── discover/
│   │   │   └── [slug]/page.tsx        # Discovery results page
│   │   ├── product/
│   │   │   └── [slug]/page.tsx        # Product detail page
│   │   ├── category/
│   │   │   └── [slug]/page.tsx        # Category browse page
│   │   └── api/
│   │       ├── query/
│   │       │   ├── route.ts           # POST: submit query
│   │       │   └── stream/route.ts    # POST: SSE streaming results
│   │       ├── compare/route.ts       # POST: compare specific products
│   │       ├── products/
│   │       │   ├── route.ts           # GET: search products
│   │       │   └── [id]/route.ts      # GET: product detail
│   │       ├── categories/route.ts    # GET: list categories
│   │       ├── feedback/route.ts      # POST: user feedback
│   │       └── og/route.tsx           # GET: dynamic OG image generation
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   ├── chat-input.tsx             # Main query input with suggestions
│   │   ├── guided-input.tsx           # Step-by-step requirement builder
│   │   ├── category-pills.tsx         # Quick category selection
│   │   ├── streaming-loader.tsx       # Progressive loading state with SSE
│   │   ├── hero-recommendation.tsx    # Top pick spotlight card
│   │   ├── product-card.tsx           # Product in ranking list
│   │   ├── comparison-table.tsx       # Side-by-side spec table
│   │   ├── score-bar.tsx              # Horizontal score visualization
│   │   ├── spec-row.tsx               # Spec with verification badge
│   │   ├── explanation-panel.tsx      # AI reasoning block
│   │   ├── price-chart.tsx            # Price history (Recharts)
│   │   ├── affiliate-button.tsx       # Buy button with tracking
│   │   ├── share-card.tsx             # Shareable comparison preview
│   │   ├── feedback-widget.tsx        # "Was this helpful?" rating
│   │   ├── navbar.tsx                 # Top navigation
│   │   └── footer.tsx                 # Footer with links
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Browser Supabase client
│   │   │   ├── server.ts              # Server Supabase client
│   │   │   └── types.ts              # Generated database types
│   │   ├── ai/
│   │   │   ├── claude.ts              # Claude API client wrapper
│   │   │   ├── intent-parser.ts       # Parse natural language → structured intent
│   │   │   ├── weight-generator.ts    # Generate feature weights from intent
│   │   │   └── explanation-generator.ts # Generate ranking explanations
│   │   ├── engine/
│   │   │   ├── normalizer.ts          # Spec normalization (linear, log, tier, binary)
│   │   │   ├── scorer.ts              # Product scoring algorithm
│   │   │   ├── ranker.ts              # Ranking with constraint filtering
│   │   │   └── validator.ts           # Spec verification & inflated claim detection
│   │   ├── scraper/
│   │   │   ├── amazon.ts              # Amazon product data extraction
│   │   │   ├── flipkart.ts            # Flipkart product data extraction
│   │   │   └── parser.ts              # Generic spec parser
│   │   ├── cache.ts                   # Vercel KV caching layer
│   │   ├── utils.ts                   # Shared utilities
│   │   └── constants.ts               # App-wide constants
│   ├── config/
│   │   ├── categories/
│   │   │   ├── projectors.ts          # Projector normalization rules + specs
│   │   │   ├── smartphones.ts         # Smartphone normalization rules + specs
│   │   │   ├── smartwatches.ts        # Smartwatch normalization rules + specs
│   │   │   ├── laptops.ts             # Laptop normalization rules + specs
│   │   │   └── earbuds.ts             # Earbuds normalization rules + specs
│   │   └── index.ts                   # Category registry
│   ├── types/
│   │   ├── product.ts                 # Product, Spec, PriceHistory types
│   │   ├── query.ts                   # ParsedIntent, QueryResult types
│   │   ├── scoring.ts                 # Weights, Scores, Rankings types
│   │   └── events.ts                  # Analytics event types
│   ├── hooks/
│   │   ├── use-query.ts               # Query submission + streaming hook
│   │   ├── use-products.ts            # Product data fetching
│   │   └── use-analytics.ts           # Event tracking hook
│   └── store/
│       └── query-store.ts             # Zustand store for query state
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql     # Full database schema
├── data/
│   └── seed/
│       ├── projectors.json            # Seed data: 15+ projectors with full specs
│       ├── smartphones.json           # Seed data: 20+ smartphones
│       └── seed.ts                    # Seed script
├── public/
│   ├── logo.svg
│   └── og-default.png
├── .env.local.example                 # Environment variable template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── vercel.json
```

## ENVIRONMENT VARIABLES

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Vercel KV (Redis)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Affiliate
AMAZON_AFFILIATE_TAG=
FLIPKART_AFFILIATE_ID=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=

# App
NEXT_PUBLIC_APP_URL=https://aigadgetadvisor.com
```

## DATABASE SCHEMA

Create the file `supabase/migrations/001_initial_schema.sql` with these tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  normalization_config JSONB NOT NULL DEFAULT '{}',
  weight_prompt_template TEXT,
  is_active BOOLEAN DEFAULT true,
  product_count INTEGER DEFAULT 0,
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
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  thumbnail_url TEXT,
  description TEXT,
  price_current NUMERIC(10,2),
  price_original NUMERIC(10,2),
  currency TEXT DEFAULT 'INR',
  amazon_asin TEXT,
  flipkart_pid TEXT,
  amazon_url TEXT,
  flipkart_url TEXT,
  affiliate_amazon_url TEXT,
  affiliate_flipkart_url TEXT,
  launch_date DATE,
  is_active BOOLEAN DEFAULT true,
  data_quality_score NUMERIC(3,2) DEFAULT 0.5,
  last_scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price_current);
CREATE INDEX idx_products_slug ON products(slug);

-- Product Specifications (EAV model)
CREATE TABLE product_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  spec_key TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  spec_value_numeric NUMERIC,
  spec_value_normalized NUMERIC(5,4),
  confidence NUMERIC(3,2) DEFAULT 1.0,
  source TEXT DEFAULT 'manual',
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
  source TEXT NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Queries
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  raw_input TEXT NOT NULL,
  query_mode TEXT NOT NULL CHECK (query_mode IN ('compare', 'discover')),
  parsed_intent JSONB NOT NULL DEFAULT '{}',
  generated_weights JSONB,
  ranking_results JSONB,
  explanation TEXT,
  result_count INTEGER,
  time_to_result_ms INTEGER,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rankings
CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES queries(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  rank_position INTEGER NOT NULL,
  total_score NUMERIC(5,4) NOT NULL,
  value_score NUMERIC(5,4),
  feature_scores JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Events
CREATE TABLE user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  query_id UUID REFERENCES queries(id),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_type ON user_events(event_type);

-- Feedback
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES queries(id),
  user_id UUID,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback_type TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are public" ON products FOR SELECT USING (true);

ALTER TABLE product_specs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Specs are public" ON product_specs FOR SELECT USING (true);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);

ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Price history is public" ON price_history FOR SELECT USING (true);

ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public query access" ON queries FOR SELECT USING (true);
CREATE POLICY "Insert queries" ON queries FOR INSERT WITH CHECK (true);

ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rankings are public" ON rankings FOR SELECT USING (true);
CREATE POLICY "Insert rankings" ON rankings FOR INSERT WITH CHECK (true);

ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert events" ON user_events FOR INSERT WITH CHECK (true);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert feedback" ON feedback FOR INSERT WITH CHECK (true);
```

## CORE TYPE DEFINITIONS

```typescript
// src/types/product.ts
export interface Product {
  id: string;
  category_id: string;
  name: string;
  brand: string;
  model_number?: string;
  slug: string;
  image_url?: string;
  thumbnail_url?: string;
  description?: string;
  price_current: number;
  price_original?: number;
  currency: string;
  amazon_url?: string;
  flipkart_url?: string;
  affiliate_amazon_url?: string;
  affiliate_flipkart_url?: string;
  data_quality_score: number;
  is_active: boolean;
}

export interface ProductSpec {
  id: string;
  product_id: string;
  spec_key: string;
  spec_value: string;
  spec_value_numeric?: number;
  spec_value_normalized?: number;
  confidence: number;
  source: string;
  verified: boolean;
}

export interface ProductWithSpecs extends Product {
  specs: ProductSpec[];
  category: Category;
}

export interface Category {
  id: string;
  name: string;
  display_name: string;
  icon?: string;
  description?: string;
  normalization_config: NormalizationConfig;
  product_count: number;
}

// src/types/query.ts
export interface ParsedIntent {
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
    flexibility: 'strict' | 'flexible' | 'open';
  };
  use_cases: string[];
  preferences: string[];
  constraints: string[];
  products_to_compare?: string[];
  priority_order: string[];
}

export interface QueryResult {
  query_id: string;
  mode: 'compare' | 'discover';
  parsed_intent: ParsedIntent;
  rankings: RankedProduct[];
  explanation: string;
  comparison_table: ComparisonRow[];
  metadata: {
    total_products_analyzed: number;
    time_ms: number;
    cache_hit: boolean;
  };
}

// src/types/scoring.ts
export type NormalizationType = 'linear' | 'log' | 'log_inverted' | 'tier' | 'binary' | 'inverted';

export interface NormalizationRule {
  type: NormalizationType;
  min?: number;
  max?: number;
  mapping?: Record<string, number>;
  higher_is_better?: boolean;
  display_name: string;
  description: string;
  unit?: string;
}

export type NormalizationConfig = Record<string, NormalizationRule>;

export interface GeneratedWeights {
  weights: Record<string, number>;
  constraints: string[];
  reasoning: string;
}

export interface ProductScore {
  product_id: string;
  product: Product;
  total_score: number;
  value_score: number;
  feature_scores: Record<string, number>;
  passes_constraints: boolean;
  constraint_failures: string[];
}

export interface RankedProduct extends ProductScore {
  rank: number;
  highlights: string[];
  warnings: string[];
}

export interface ComparisonRow {
  feature: string;
  display_name: string;
  values: Record<string, {
    raw: string;
    normalized: number;
    is_best: boolean;
    flag?: 'verified' | 'claimed' | 'inflated';
  }>;
}
```

## NORMALIZATION CONFIGS (Per Category)

```typescript
// src/config/categories/projectors.ts
export const PROJECTOR_CONFIG: NormalizationConfig = {
  brightness_ansi: {
    type: 'log',
    min: 100,
    max: 3000,
    higher_is_better: true,
    display_name: 'Brightness',
    description: 'Measured in ANSI lumens (not marketing lumens)',
    unit: 'ANSI lm'
  },
  resolution: {
    type: 'tier',
    mapping: { '480p': 0.1, '720p': 0.4, '1080p': 0.7, '1440p': 0.85, '4K': 1.0 },
    display_name: 'Native Resolution',
    description: 'Native resolution of the display chip'
  },
  price: {
    type: 'log_inverted',
    min: 5000,
    max: 200000,
    display_name: 'Price',
    description: 'Current market price',
    unit: '₹'
  },
  netflix_certified: {
    type: 'binary',
    display_name: 'Netflix Certified',
    description: 'WideVine L1 DRM for HD streaming on Netflix, Prime Video, etc.'
  },
  auto_focus: {
    type: 'tier',
    mapping: { 'none': 0, 'manual': 0.3, 'auto': 0.7, 'full_auto': 1.0 },
    display_name: 'Auto Focus',
    description: 'Automatic focus adjustment capability'
  },
  auto_keystone: {
    type: 'binary',
    display_name: 'Auto Keystone',
    description: 'Automatic keystone correction for angled placement'
  },
  speaker_watts: {
    type: 'log',
    min: 1,
    max: 30,
    higher_is_better: true,
    display_name: 'Built-in Speakers',
    description: 'Speaker power output',
    unit: 'W'
  },
  obstacle_avoidance: {
    type: 'binary',
    display_name: 'Obstacle Avoidance',
    description: 'Auto-adjusts projection to avoid objects on the wall'
  },
  dust_proof: {
    type: 'binary',
    display_name: 'Dust Proof',
    description: 'Sealed optical engine to prevent dust spots'
  },
  hdmi_arc: {
    type: 'binary',
    display_name: 'HDMI ARC',
    description: 'Audio Return Channel for soundbar connectivity'
  },
  wifi_version: {
    type: 'tier',
    mapping: { 'none': 0, 'wifi4': 0.3, 'wifi5': 0.6, 'wifi6': 1.0 },
    display_name: 'WiFi',
    description: 'Wireless connectivity standard'
  },
  throw_ratio: {
    type: 'inverted',
    min: 0.5,
    max: 2.0,
    display_name: 'Throw Ratio',
    description: 'Lower = larger image from shorter distance'
  },
  weight_kg: {
    type: 'inverted',
    min: 0.3,
    max: 5.0,
    display_name: 'Weight',
    description: 'Device weight for portability',
    unit: 'kg'
  }
};
```

Create similar configs for `smartphones.ts`, `smartwatches.ts`, `laptops.ts`, `earbuds.ts` with category-appropriate specs and normalization rules.

## LLM PROMPTS

### Intent Parser Prompt
```
You are the AI Gadget Advisor intent parser. Convert user queries about tech products into structured JSON.

User query: "{user_input}"

Parse this into a JSON object with these fields:
- category: string — one of: "projector", "smartphone", "smartwatch", "laptop", "earbuds", "tablet", "smart_ring"
- budget: { min: number, max: number, currency: "INR", flexibility: "strict"|"flexible"|"open" }
  - If user says "under X", set max=X, min=0, flexibility="strict"
  - If user gives a range, use it
  - If no budget mentioned, set flexibility="open" with reasonable defaults for the category
- use_cases: string[] — what they'll use the product for (e.g., ["netflix", "gaming", "presentations"])
- preferences: string[] — nice-to-haves they mentioned (e.g., ["portable", "quiet", "good speakers"])
- constraints: string[] — hard requirements expressed as filter conditions (e.g., ["netflix_certified == true", "resolution >= 1080p"])
- products_to_compare: string[] | null — specific product names if the user mentioned any, otherwise null
- priority_order: string[] — inferred priority of what matters most, based on emphasis in the query

Rules:
1. If the user mentions specific products → this is "compare" mode
2. If the user describes requirements → this is "discover" mode
3. Budget in INR unless specified otherwise
4. Infer the category from context if not explicitly stated
5. Be generous in extracting constraints — if the user says "must have" or "need", it's a constraint

Return ONLY valid JSON. No markdown, no explanation.
```

### Weight Generator Prompt
```
You are the AI Gadget Advisor weight generator. Given a user's requirements for a {category}, generate feature weights for scoring products.

User intent:
{parsed_intent_json}

Available features for {category}:
{feature_list_with_descriptions}

Generate weights as a JSON object:
{
  "weights": {
    "feature_name": 0.XX,
    ...
  },
  "constraints": ["feature == value", "feature >= value", ...],
  "reasoning": "Brief explanation of weight choices"
}

Rules:
1. Weights MUST sum to exactly 1.0
2. Features the user explicitly mentioned get 0.15–0.25 weight
3. Features implied by the use case get 0.10–0.15
4. Remaining features get 0.02–0.08
5. Price weight: 0.10 if budget is "open", 0.15 if "flexible", 0.20 if "strict"
6. Convert user constraints to filter expressions
7. The reasoning should explain WHY these weights fit this user's needs

Example for "Netflix projector under ₹20K for bedroom":
{
  "weights": {
    "resolution": 0.18,
    "brightness_ansi": 0.12,
    "netflix_certified": 0.22,
    "auto_focus": 0.10,
    "speaker_watts": 0.10,
    "price": 0.15,
    "throw_ratio": 0.05,
    "auto_keystone": 0.03,
    "obstacle_avoidance": 0.03,
    "wifi_version": 0.02
  },
  "constraints": ["netflix_certified == true", "price <= 20000"],
  "reasoning": "Netflix certification is the primary requirement. Resolution directly affects streaming quality. Budget is strict at ₹20K. Bedroom use means throw ratio matters (short distance). Speakers important since user likely won't have external audio."
}
```

### Explanation Generator Prompt
```
You are the AI Gadget Advisor. Generate a clear, helpful explanation of the product ranking.

User's original query: "{original_query}"
Category: {category}

Ranking results:
{ranked_products_with_scores}

Feature score comparison:
{feature_scores_table}

Write a 4-6 sentence explanation that:
1. Names the winner and the ONE most important reason it won
2. Acknowledges what the #2 product does better (there's always something)
3. Mentions any important tradeoff the user should consider
4. If any product was excluded for failing constraints, mention why briefly
5. Relates everything back to the user's specific use case and needs

Tone: Like a knowledgeable friend who just did hours of research for you. Confident but not salesy. Mention specific numbers when they matter.

Do NOT:
- Use marketing language or superlatives
- Say "in conclusion" or "overall"
- Recommend purchasing from specific stores
- Mention the scoring algorithm or weights
```

## SCORING ENGINE IMPLEMENTATION

```typescript
// src/lib/engine/normalizer.ts
export function normalize(value: number, rule: NormalizationRule): number {
  const { type, min = 0, max = 1, mapping } = rule;
  
  switch (type) {
    case 'linear':
      return clamp((value - min) / (max - min));
    case 'log':
      if (value <= 0 || min <= 0) return 0;
      return clamp(Math.log(value / min) / Math.log(max / min));
    case 'log_inverted':
      if (value <= 0 || min <= 0) return 0;
      return 1 - clamp(Math.log(value / min) / Math.log(max / min));
    case 'inverted':
      return 1 - clamp((value - min) / (max - min));
    case 'tier':
      return mapping?.[String(value)] ?? 0;
    case 'binary':
      return value ? 1 : 0;
    default:
      return 0;
  }
}

function clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}

// src/lib/engine/scorer.ts
export function scoreProduct(
  product: ProductWithSpecs,
  weights: GeneratedWeights,
  normConfig: NormalizationConfig
): ProductScore {
  const featureScores: Record<string, number> = {};
  let totalScore = 0;
  const highlights: string[] = [];
  const warnings: string[] = [];

  // Check constraints
  const constraintFailures = checkConstraints(product, weights.constraints);

  // Score each weighted feature
  for (const [feature, weight] of Object.entries(weights.weights)) {
    const spec = product.specs.find(s => s.spec_key === feature);
    const rule = normConfig[feature];
    
    if (!spec || !rule) {
      featureScores[feature] = 0;
      warnings.push(`Missing data: ${rule?.display_name ?? feature}`);
      continue;
    }

    let normalizedValue: number;
    if (rule.type === 'tier') {
      normalizedValue = rule.mapping?.[spec.spec_value] ?? 0;
    } else if (rule.type === 'binary') {
      normalizedValue = spec.spec_value.toLowerCase() === 'true' || spec.spec_value === '1' ? 1 : 0;
    } else {
      normalizedValue = normalize(spec.spec_value_numeric ?? 0, rule);
    }

    const confidence = spec.confidence;
    const weightedScore = weight * normalizedValue * confidence;
    featureScores[feature] = normalizedValue;
    totalScore += weightedScore;

    // Track highlights and warnings
    if (normalizedValue >= 0.9 && weight >= 0.1) {
      highlights.push(`Excellent ${rule.display_name}`);
    }
    if (normalizedValue <= 0.3 && weight >= 0.1) {
      warnings.push(`Weak ${rule.display_name}`);
    }
    if (confidence < 0.7) {
      warnings.push(`Unverified: ${rule.display_name}`);
    }
  }

  // Value score
  const price = product.price_current;
  const valueScore = price > 0 ? totalScore / Math.log10(price) : totalScore;

  return {
    product_id: product.id,
    product,
    total_score: Math.round(totalScore * 100) / 100,
    value_score: Math.round(valueScore * 1000) / 1000,
    feature_scores: featureScores,
    passes_constraints: constraintFailures.length === 0,
    constraint_failures: constraintFailures,
    rank: 0,
    highlights,
    warnings,
  };
}

function checkConstraints(product: ProductWithSpecs, constraints: string[]): string[] {
  const failures: string[] = [];
  for (const constraint of constraints) {
    const match = constraint.match(/^(\w+)\s*(==|!=|<=|>=|<|>)\s*(.+)$/);
    if (!match) continue;
    
    const [, feature, operator, targetStr] = match;
    const spec = product.specs.find(s => s.spec_key === feature);
    
    let actualValue: number | string;
    if (feature === 'price') {
      actualValue = product.price_current;
    } else if (!spec) {
      failures.push(`Missing: ${feature}`);
      continue;
    } else {
      actualValue = spec.spec_value_numeric ?? spec.spec_value;
    }
    
    const target = isNaN(Number(targetStr)) ? targetStr : Number(targetStr);
    const actual = typeof actualValue === 'string' ? actualValue : Number(actualValue);
    
    let passes = false;
    switch (operator) {
      case '==': passes = String(actual) === String(target); break;
      case '!=': passes = String(actual) !== String(target); break;
      case '<=': passes = Number(actual) <= Number(target); break;
      case '>=': passes = Number(actual) >= Number(target); break;
      case '<':  passes = Number(actual) < Number(target); break;
      case '>':  passes = Number(actual) > Number(target); break;
    }
    
    if (!passes) {
      failures.push(constraint);
    }
  }
  return failures;
}
```

## API ROUTE: STREAMING QUERY

```typescript
// src/app/api/query/stream/route.ts
// Implements Server-Sent Events for progressive results

export async function POST(req: Request) {
  const { input, mode } = await req.json();
  const startTime = Date.now();
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: string, data: any) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type, data })}\n\n`)
        );
      };
      
      try {
        // Step 1: Parse intent
        send('status', { step: 'parsing', message: 'Understanding your needs...' });
        const intent = await parseIntent(input);
        send('intent_parsed', { intent });
        
        // Step 2: Find products
        send('status', { step: 'searching', message: `Finding ${intent.category}s...` });
        const products = mode === 'compare'
          ? await findProductsByNames(intent.products_to_compare!)
          : await searchProducts(intent);
        send('products_found', { count: products.length });
        
        // Step 3: Generate weights
        send('status', { step: 'analyzing', message: 'Analyzing for your needs...' });
        const weights = await generateWeights(intent);
        
        // Step 4: Score and rank
        send('status', { step: 'scoring', message: 'Scoring products...' });
        const normConfig = getCategoryConfig(intent.category);
        const scores = products.map(p => scoreProduct(p, weights, normConfig));
        const ranked = scores
          .filter(s => s.passes_constraints)
          .sort((a, b) => b.total_score - a.total_score)
          .map((s, i) => ({ ...s, rank: i + 1 }));
        send('ranking_complete', { rankings: ranked.slice(0, 10) });
        
        // Step 5: Generate explanation
        send('status', { step: 'explaining', message: 'Writing recommendation...' });
        const explanation = await generateExplanation(input, intent, ranked);
        send('explanation_ready', { explanation });
        
        // Step 6: Build comparison table
        const table = buildComparisonTable(ranked.slice(0, 5), normConfig);
        
        // Step 7: Save to database
        const query = await saveQuery(input, mode, intent, weights, ranked, explanation);
        
        send('done', {
          query_id: query.id,
          slug: query.slug,
          rankings: ranked.slice(0, 5),
          explanation,
          comparison_table: table,
          metadata: {
            total_products_analyzed: products.length,
            time_ms: Date.now() - startTime,
            cache_hit: false
          }
        });
      } catch (error) {
        send('error', { message: 'Something went wrong. Please try again.' });
      } finally {
        controller.close();
      }
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

## SEED DATA FORMAT

```json
// data/seed/projectors.json
// Create seed data for at least 15 projectors with FULL specs
// Include these 4 from the user's example plus 11+ more popular Indian market projectors:
// 1. EGate Duster 5X Pro — ₹25,000-30,000
// 2. Wzatco Yuva GO — ₹8,000-12,000
// 3. Crossbeats Lumex Flix — ₹13,799-16,000
// 4. Wzatco Yuva Vibe — ₹13,790
// 5+ Epson EF-11, BenQ TH685i, XGIMI MoGo 2, Portronics Beem 460, etc.

// Each product entry format:
{
  "name": "Crossbeats Lumex Flix",
  "brand": "Crossbeats",
  "model_number": "LUMEX-FLIX",
  "slug": "crossbeats-lumex-flix",
  "price_current": 13799,
  "price_original": 16999,
  "amazon_url": "https://www.amazon.in/dp/XXXXXXXXXX",
  "image_url": "",
  "description": "1080p portable projector with Netflix certification...",
  "specs": {
    "brightness_ansi": { "value": "16000 lm (claimed)", "numeric": 400, "confidence": 0.5, "verified": false },
    "resolution": { "value": "1080p", "numeric": null, "confidence": 1.0, "verified": true },
    "netflix_certified": { "value": "true", "numeric": 1, "confidence": 1.0, "verified": true },
    "auto_focus": { "value": "auto", "numeric": null, "confidence": 0.9, "verified": true },
    "auto_keystone": { "value": "true", "numeric": 1, "confidence": 0.9, "verified": true },
    "obstacle_avoidance": { "value": "true", "numeric": 1, "confidence": 0.8, "verified": false },
    "speaker_watts": { "value": "10W", "numeric": 10, "confidence": 1.0, "verified": true },
    "hdmi_arc": { "value": "true", "numeric": 1, "confidence": 0.9, "verified": true },
    "wifi_version": { "value": "wifi6", "numeric": null, "confidence": 0.9, "verified": true },
    "dust_proof": { "value": "false", "numeric": 0, "confidence": 0.8, "verified": false },
    "weight_kg": { "value": "1.8", "numeric": 1.8, "confidence": 0.9, "verified": true },
    "throw_ratio": { "value": "1.2", "numeric": 1.2, "confidence": 0.7, "verified": false }
  }
}
```

## KEY IMPLEMENTATION NOTES

### 1. Streaming UX is Critical
The query → results flow MUST use SSE (Server-Sent Events) to progressively show:
- "Understanding your needs..." → shows parsed intent
- "Finding products..." → shows count
- "Scoring..." → progressive bar
- "Here's my recommendation" → full results
This keeps users engaged during the 3-8 second processing time.

### 2. Spec Verification Matters
Many budget projectors (and other gadgets) inflate specs egregiously. The platform's credibility depends on flagging this. When a claimed brightness of "16,000 lumens" appears at ₹12,000, flag it with ⚠️ and show estimated true value.

### 3. Mobile-First Design
70%+ of Indian users will be on mobile. The comparison table MUST scroll horizontally with a sticky first column. Product cards must stack vertically. Affiliate buttons should be prominent and thumb-reachable.

### 4. SEO from Day 1
Every comparison and discovery result generates a unique URL with a human-readable slug. These pages must be statically generated (ISR) with proper meta tags, OG images, and structured data (JSON-LD Product schema).

### 5. Caching Strategy
- Same intent → same results for 24 hours (hash the parsed intent, not the raw query)
- Product data refreshed every 6 hours
- Price data refreshed every 6 hours
- LLM responses cached aggressively

### 6. Affiliate Links
All "Buy" buttons should include affiliate tracking tags. Use redirect URLs (`/api/redirect?product=X&store=amazon`) to track clicks before redirecting to the store.

### 7. Error Handling
- If Claude API is down: show cached results or fallback to basic spec comparison
- If product not found: suggest alternatives
- If scraping fails: use last known data with "last updated X ago" label
- Rate limit exceeded: queue the request, show ETA

## DEVELOPMENT ORDER

Build in this exact sequence:

### Phase 1: Foundation (Week 1-2)
1. `npx create-next-app@latest ai-gadget-advisor --typescript --tailwind --app`
2. Install deps: `@anthropic-ai/sdk`, `@supabase/supabase-js`, `@supabase/ssr`, `zustand`, `framer-motion`, `recharts`
3. Set up shadcn/ui: `npx shadcn@latest init`
4. Create Supabase project and run migration
5. Build the database schema
6. Create seed data (projectors.json, smartphones.json)
7. Build seed script and populate database
8. Build type definitions
9. Build landing page with chat input
10. Build category pills and example queries

### Phase 2: Core Engine (Week 3-4)
11. Implement normalization engine (`normalizer.ts`)
12. Implement scoring engine (`scorer.ts`)
13. Implement constraint checker
14. Build Claude API client wrapper
15. Build intent parser with Claude
16. Build weight generator with Claude
17. Build explanation generator with Claude
18. Create the SSE streaming API route
19. Build streaming loader component
20. Build results page layout

### Phase 3: UI Components (Week 5)
21. Build hero recommendation card
22. Build ranked product list
23. Build comparison table (responsive, scrollable)
24. Build score bar visualization
25. Build explanation panel
26. Build product detail page
27. Build price chart component
28. Build affiliate button with tracking
29. Build share functionality
30. Build feedback widget

### Phase 4: Polish & Launch (Week 6)
31. Add SEO: meta tags, OG images, JSON-LD
32. Add analytics event tracking
33. Mobile responsive polish
34. Error handling and edge cases
35. Loading states and skeleton screens
36. Accessibility audit
37. Performance optimization (ISR, caching)
38. Deploy to Vercel
39. Connect custom domain
40. Test all flows end-to-end

## DESIGN TOKENS

```css
/* src/app/globals.css — append to Tailwind base */
:root {
  --color-primary: 99 102 241;        /* indigo-500 */
  --color-primary-dark: 67 56 202;    /* indigo-700 */
  --color-secondary: 16 185 129;      /* emerald-500 */
  --color-warning: 245 158 11;        /* amber-500 */
  --color-danger: 239 68 68;          /* red-500 */
  --color-bg: 248 250 252;            /* slate-50 */
  --color-surface: 255 255 255;
  --color-text: 15 23 42;             /* slate-900 */
  --color-text-secondary: 100 116 139; /* slate-500 */
  --radius: 12px;
  --max-width: 1200px;
}
```

## IMPORTANT CONVENTIONS

- Use `async/await` everywhere, no callbacks
- All API routes return `{ data, error }` shape
- All database queries go through Supabase client (never raw SQL in app code)
- All LLM calls wrapped in try/catch with fallback behavior
- Environment variables validated at startup
- TypeScript strict mode enabled
- ESLint + Prettier configured
- Commit messages: `feat:`, `fix:`, `chore:`, `docs:` prefixes
