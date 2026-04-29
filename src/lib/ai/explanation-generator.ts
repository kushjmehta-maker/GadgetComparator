import { claudeText } from './claude'
import type { ParsedIntent } from '@/types/query'
import type { RankedProduct } from '@/types/scoring'
import { formatPrice } from '@/lib/utils'

const SYSTEM_PROMPT = `You are the AI Gadget Advisor. Generate clear, helpful explanations of product rankings.

Tone: Like a knowledgeable friend who just did hours of research for you. Confident but not salesy. Mention specific numbers when they matter.

Do NOT:
- Use marketing language or superlatives
- Say "in conclusion" or "overall"
- Recommend purchasing from specific stores
- Mention the scoring algorithm or weights`

export async function generateExplanation(
  originalQuery: string,
  intent: ParsedIntent,
  ranked: RankedProduct[],
): Promise<string> {
  if (ranked.length === 0) {
    return 'No products matched your requirements. Try adjusting your budget or relaxing some constraints.'
  }

  const rankingSummary = ranked
    .slice(0, 5)
    .map((r) => {
      const p = r.product
      return `#${r.rank}: ${p.name} — Score: ${(r.total_score * 100).toFixed(0)}/100, Price: ${formatPrice(p.price_current, p.currency)}`
    })
    .join('\n')

  const featureTable = ranked
    .slice(0, 3)
    .map((r) => {
      const topFeatures = Object.entries(r.feature_scores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([k, v]) => `${k}: ${(v * 100).toFixed(0)}%`)
        .join(', ')
      return `${r.product.name}: ${topFeatures}`
    })
    .join('\n')

  const prompt = `User's original query: "${originalQuery}"
Category: ${intent.category}

Ranking results:
${rankingSummary}

Feature score highlights:
${featureTable}

Write a 4-6 sentence explanation that:
1. Names the winner and the ONE most important reason it won
2. Acknowledges what the #2 product does better (there's always something)
3. Mentions any important tradeoff the user should consider
4. Relates everything back to the user's specific use case and needs`

  try {
    return await claudeText(prompt, SYSTEM_PROMPT)
  } catch {
    const winner = ranked[0].product
    const runnerUp = ranked[1]?.product
    return `The ${winner.name} scores highest for your needs at ${formatPrice(winner.price_current, winner.currency)}.${runnerUp ? ` The ${runnerUp.name} is a close alternative worth considering.` : ''} Check the feature scores below to see how each product performs on what matters to you.`
  }
}
