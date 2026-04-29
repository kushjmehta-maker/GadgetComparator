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
