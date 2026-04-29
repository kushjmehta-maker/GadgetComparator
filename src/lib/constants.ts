export const APP_NAME = 'AI Gadget Advisor'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
export const APP_DESCRIPTION =
  'Personalized tech product recommendations powered by AI. Describe what you need, get ranked results explained for your exact use case.'

export const CATEGORIES = [
  { id: 'projector', label: 'Projectors', icon: '📽️', slug: 'projectors' },
  { id: 'smartphone', label: 'Smartphones', icon: '📱', slug: 'smartphones' },
  { id: 'laptop', label: 'Laptops', icon: '💻', slug: 'laptops' },
  { id: 'earbuds', label: 'Earbuds', icon: '🎧', slug: 'earbuds' },
  { id: 'smartwatch', label: 'Smartwatches', icon: '⌚', slug: 'smartwatches' },
  { id: 'tablet', label: 'Tablets', icon: '📲', slug: 'tablets' },
] as const

export const EXAMPLE_QUERIES = [
  'Best projector under ₹20,000 for Netflix in bedroom',
  'Compare Samsung Galaxy S25 vs iPhone 16 for photography',
  'Laptop for college student under ₹60,000 with good battery',
  'Wireless earbuds for gym with ANC under ₹5,000',
  'Smartwatch for fitness tracking under ₹15,000',
]

export const CACHE_TTL = {
  QUERY: 60 * 60 * 24,     // 24 hours
  PRODUCT: 60 * 60 * 6,    // 6 hours
  PRICE: 60 * 60 * 6,      // 6 hours
  CATEGORIES: 60 * 60 * 24, // 24 hours
}

export const MAX_RESULTS = 10
export const DISPLAY_RESULTS = 5
export const MIN_CONFIDENCE_THRESHOLD = 0.5
