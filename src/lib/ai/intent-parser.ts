import { claudeJSON } from './claude'
import type { ParsedIntent } from '@/types/query'

const SYSTEM_PROMPT = `You are the AI Gadget Advisor intent parser. Convert user queries about tech products into structured JSON. Return ONLY valid JSON. No markdown, no explanation.`

export async function parseIntent(userInput: string): Promise<ParsedIntent> {
  const prompt = `User query: "${userInput}"

Parse this into a JSON object with these fields:
- category: string — one of: "projector", "smartphone", "smartwatch", "laptop", "earbuds", "tablet", "smart_ring"
- budget: { min: number, max: number, currency: "INR", flexibility: "strict"|"flexible"|"open" }
  - If user says "under X", set max=X, min=0, flexibility="strict"
  - If user gives a range, use it
  - If no budget mentioned, set flexibility="open" with reasonable defaults for the category
- use_cases: string[] — what they'll use the product for (e.g., ["netflix", "gaming", "presentations"])
- preferences: string[] — nice-to-haves they mentioned (e.g., ["portable", "quiet", "good speakers"])
- constraints: string[] — hard requirements as filter conditions (e.g., ["netflix_certified == true", "resolution >= 1080p"])
- products_to_compare: string[] | null — specific product names if mentioned, otherwise null
- priority_order: string[] — inferred priority of what matters most

Rules:
1. If the user mentions specific products → products_to_compare is populated
2. If the user describes requirements → products_to_compare is null
3. Budget in INR unless specified otherwise
4. Infer the category from context if not explicitly stated
5. Be generous in extracting constraints — if the user says "must have" or "need", it's a constraint`

  try {
    return await claudeJSON<ParsedIntent>(prompt, SYSTEM_PROMPT)
  } catch {
    // Fallback intent
    return {
      category: 'projector',
      budget: { min: 0, max: 50000, currency: 'INR', flexibility: 'open' },
      use_cases: [],
      preferences: [],
      constraints: [],
      products_to_compare: undefined,
      priority_order: ['price', 'performance'],
    }
  }
}
