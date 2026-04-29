import type { RankedProduct, ComparisonRow } from './scoring'

export interface ParsedIntent {
  category: string
  budget: {
    min: number
    max: number
    currency: string
    flexibility: 'strict' | 'flexible' | 'open'
  }
  use_cases: string[]
  preferences: string[]
  constraints: string[]
  products_to_compare?: string[]
  priority_order: string[]
}

export interface QueryResult {
  query_id: string
  mode: 'compare' | 'discover'
  parsed_intent: ParsedIntent
  rankings: RankedProduct[]
  explanation: string
  comparison_table: ComparisonRow[]
  metadata: {
    total_products_analyzed: number
    time_ms: number
    cache_hit: boolean
  }
}

export interface QueryRecord {
  id: string
  user_id?: string
  session_id?: string
  raw_input: string
  query_mode: 'compare' | 'discover'
  parsed_intent: ParsedIntent
  generated_weights?: object
  ranking_results?: object
  explanation?: string
  result_count?: number
  time_to_result_ms?: number
  slug?: string
  created_at: string
}

export type StreamEventType =
  | 'status'
  | 'intent_parsed'
  | 'products_found'
  | 'ranking_complete'
  | 'explanation_ready'
  | 'done'
  | 'error'

export interface StreamEvent {
  type: StreamEventType
  data: Record<string, unknown>
}

export interface StatusEvent {
  step: 'parsing' | 'searching' | 'analyzing' | 'scoring' | 'explaining'
  message: string
}
