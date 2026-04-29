export type EventType =
  | 'query_submitted'
  | 'query_completed'
  | 'product_clicked'
  | 'affiliate_clicked'
  | 'comparison_viewed'
  | 'feedback_submitted'
  | 'share_clicked'
  | 'category_selected'
  | 'example_query_clicked'

export interface BaseEvent {
  event_type: EventType
  session_id?: string
  user_id?: string
  query_id?: string
  created_at?: string
}

export interface QuerySubmittedEvent extends BaseEvent {
  event_type: 'query_submitted'
  event_data: {
    raw_input: string
    mode: 'compare' | 'discover'
  }
}

export interface ProductClickedEvent extends BaseEvent {
  event_type: 'product_clicked'
  event_data: {
    product_id: string
    product_name: string
    rank: number
  }
}

export interface AffiliateClickedEvent extends BaseEvent {
  event_type: 'affiliate_clicked'
  event_data: {
    product_id: string
    product_name: string
    store: 'amazon' | 'flipkart'
  }
}

export interface FeedbackSubmittedEvent extends BaseEvent {
  event_type: 'feedback_submitted'
  event_data: {
    rating: number
    feedback_type?: string
    comment?: string
  }
}

export type AppEvent =
  | QuerySubmittedEvent
  | ProductClickedEvent
  | AffiliateClickedEvent
  | FeedbackSubmittedEvent
  | (BaseEvent & { event_data?: Record<string, unknown> })
