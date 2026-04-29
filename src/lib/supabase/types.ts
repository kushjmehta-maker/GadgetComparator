export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          display_name: string
          icon: string | null
          description: string | null
          normalization_config: Json
          weight_prompt_template: string | null
          is_active: boolean
          product_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          brand: string | null
          model_number: string | null
          slug: string
          image_url: string | null
          thumbnail_url: string | null
          description: string | null
          price_current: number | null
          price_original: number | null
          currency: string
          amazon_asin: string | null
          flipkart_pid: string | null
          amazon_url: string | null
          flipkart_url: string | null
          affiliate_amazon_url: string | null
          affiliate_flipkart_url: string | null
          launch_date: string | null
          is_active: boolean
          data_quality_score: number
          last_scraped_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      product_specs: {
        Row: {
          id: string
          product_id: string
          spec_key: string
          spec_value: string
          spec_value_numeric: number | null
          spec_value_normalized: number | null
          confidence: number
          source: string
          verified: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['product_specs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['product_specs']['Insert']>
      }
      queries: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          raw_input: string
          query_mode: 'compare' | 'discover'
          parsed_intent: Json
          generated_weights: Json | null
          ranking_results: Json | null
          explanation: string | null
          result_count: number | null
          time_to_result_ms: number | null
          slug: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['queries']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['queries']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
