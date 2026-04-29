export interface Product {
  id: string
  category_id: string
  name: string
  brand: string
  model_number?: string
  slug: string
  image_url?: string
  thumbnail_url?: string
  description?: string
  price_current: number
  price_original?: number
  currency: string
  amazon_url?: string
  flipkart_url?: string
  affiliate_amazon_url?: string
  affiliate_flipkart_url?: string
  launch_date?: string
  data_quality_score: number
  is_active: boolean
  last_scraped_at?: string
  created_at?: string
  updated_at?: string
}

export interface ProductSpec {
  id: string
  product_id: string
  spec_key: string
  spec_value: string
  spec_value_numeric?: number
  spec_value_normalized?: number
  confidence: number
  source: string
  verified: boolean
  created_at?: string
}

export interface ProductWithSpecs extends Product {
  specs: ProductSpec[]
  category: Category
}

export interface Category {
  id: string
  name: string
  display_name: string
  icon?: string
  description?: string
  normalization_config: NormalizationConfig
  weight_prompt_template?: string
  is_active: boolean
  product_count: number
  created_at?: string
  updated_at?: string
}

export interface PriceHistory {
  id: string
  product_id: string
  price: number
  source: string
  recorded_at: string
}

// Import NormalizationConfig from scoring
import type { NormalizationConfig } from './scoring'
