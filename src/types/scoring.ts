import type { Product } from './product'

export type NormalizationType =
  | 'linear'
  | 'log'
  | 'log_inverted'
  | 'tier'
  | 'binary'
  | 'inverted'

export interface NormalizationRule {
  type: NormalizationType
  min?: number
  max?: number
  mapping?: Record<string, number>
  higher_is_better?: boolean
  display_name: string
  description: string
  unit?: string
}

export type NormalizationConfig = Record<string, NormalizationRule>

export interface GeneratedWeights {
  weights: Record<string, number>
  constraints: string[]
  reasoning: string
}

export interface ProductScore {
  product_id: string
  product: Product
  total_score: number
  value_score: number
  feature_scores: Record<string, number>
  passes_constraints: boolean
  constraint_failures: string[]
  highlights: string[]
  warnings: string[]
}

export interface RankedProduct extends ProductScore {
  rank: number
  highlights: string[]
  warnings: string[]
}

export interface ComparisonRow {
  feature: string
  display_name: string
  unit?: string
  values: Record<
    string,
    {
      raw: string
      normalized: number
      is_best: boolean
      flag?: 'verified' | 'claimed' | 'inflated'
    }
  >
}
