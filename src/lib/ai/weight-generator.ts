import { claudeJSON } from './claude'
import type { ParsedIntent } from '@/types/query'
import type { GeneratedWeights, NormalizationConfig } from '@/types/scoring'

const SYSTEM_PROMPT = `You are the AI Gadget Advisor weight generator. Generate feature weights for scoring products. Return ONLY valid JSON. No markdown, no explanation.`

export async function generateWeights(
  intent: ParsedIntent,
  normConfig: NormalizationConfig,
): Promise<GeneratedWeights> {
  const featureList = Object.entries(normConfig)
    .map(([key, rule]) => `- ${key}: ${rule.display_name} — ${rule.description}`)
    .join('\n')

  const prompt = `Generate feature weights for a ${intent.category} recommendation.

User intent:
${JSON.stringify(intent, null, 2)}

Available features for ${intent.category}:
${featureList}

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
6. Convert user constraints from the intent to filter expressions
7. The reasoning should explain WHY these weights fit this user's needs
8. Only include features that exist in the available features list`

  try {
    const result = await claudeJSON<GeneratedWeights>(prompt, SYSTEM_PROMPT)

    // Normalize weights to ensure they sum to 1.0
    const totalWeight = Object.values(result.weights).reduce((a, b) => a + b, 0)
    if (Math.abs(totalWeight - 1.0) > 0.01) {
      const factor = 1.0 / totalWeight
      for (const key of Object.keys(result.weights)) {
        result.weights[key] = Math.round(result.weights[key] * factor * 100) / 100
      }
    }

    return result
  } catch {
    // Fallback: equal weights for all features
    const features = Object.keys(normConfig)
    const equalWeight = Math.round((1.0 / features.length) * 100) / 100
    const weights: Record<string, number> = {}
    features.forEach((f) => { weights[f] = equalWeight })

    return {
      weights,
      constraints: intent.constraints,
      reasoning: 'Equal weights applied as fallback.',
    }
  }
}
