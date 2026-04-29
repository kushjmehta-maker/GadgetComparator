import type { ProductWithSpecs } from '@/types/product'
import type {
  GeneratedWeights,
  NormalizationConfig,
  ProductScore,
  RankedProduct,
  ComparisonRow,
} from '@/types/scoring'
import { normalize, normalizeString } from './normalizer'

export function scoreProduct(
  product: ProductWithSpecs,
  weights: GeneratedWeights,
  normConfig: NormalizationConfig,
): ProductScore {
  const featureScores: Record<string, number> = {}
  let totalScore = 0
  const highlights: string[] = []
  const warnings: string[] = []

  const constraintFailures = checkConstraints(product, weights.constraints)

  for (const [feature, weight] of Object.entries(weights.weights)) {
    const spec = product.specs.find((s) => s.spec_key === feature)
    const rule = normConfig[feature]

    if (!rule) continue

    if (!spec) {
      featureScores[feature] = 0
      if (weight >= 0.1) {
        warnings.push(`Missing data: ${rule.display_name}`)
      }
      continue
    }

    let normalizedValue: number
    if (rule.type === 'tier' || rule.type === 'binary') {
      normalizedValue = normalizeString(spec.spec_value, rule)
    } else {
      normalizedValue = normalize(spec.spec_value_numeric ?? 0, rule)
    }

    const confidence = spec.confidence
    const weightedScore = weight * normalizedValue * confidence
    featureScores[feature] = normalizedValue
    totalScore += weightedScore

    if (normalizedValue >= 0.9 && weight >= 0.1) {
      highlights.push(`Excellent ${rule.display_name}`)
    }
    if (normalizedValue <= 0.3 && weight >= 0.1) {
      warnings.push(`Weak ${rule.display_name}`)
    }
    if (confidence < 0.7) {
      warnings.push(`Unverified: ${rule.display_name}`)
    }
  }

  const price = product.price_current
  const valueScore = price > 0 ? totalScore / Math.log10(price) : totalScore

  return {
    product_id: product.id,
    product,
    total_score: Math.round(totalScore * 100) / 100,
    value_score: Math.round(valueScore * 1000) / 1000,
    feature_scores: featureScores,
    passes_constraints: constraintFailures.length === 0,
    constraint_failures: constraintFailures,
    highlights,
    warnings,
  }
}

export function checkConstraints(
  product: ProductWithSpecs,
  constraints: string[],
): string[] {
  const failures: string[] = []
  for (const constraint of constraints) {
    const match = constraint.match(/^(\w+)\s*(==|!=|<=|>=|<|>)\s*(.+)$/)
    if (!match) continue

    const [, feature, operator, targetStr] = match
    const spec = product.specs.find((s) => s.spec_key === feature)

    let actualValue: number | string
    if (feature === 'price') {
      actualValue = product.price_current
    } else if (!spec) {
      failures.push(`Missing: ${feature}`)
      continue
    } else {
      actualValue = spec.spec_value_numeric ?? spec.spec_value
    }

    const target = isNaN(Number(targetStr)) ? targetStr : Number(targetStr)
    const actual =
      typeof actualValue === 'string' ? actualValue : Number(actualValue)

    let passes = false
    switch (operator) {
      case '==':
        passes = String(actual) === String(target)
        break
      case '!=':
        passes = String(actual) !== String(target)
        break
      case '<=':
        passes = Number(actual) <= Number(target)
        break
      case '>=':
        passes = Number(actual) >= Number(target)
        break
      case '<':
        passes = Number(actual) < Number(target)
        break
      case '>':
        passes = Number(actual) > Number(target)
        break
    }

    if (!passes) {
      failures.push(constraint)
    }
  }
  return failures
}

export function rankProducts(scores: ProductScore[]): RankedProduct[] {
  return scores
    .filter((s) => s.passes_constraints)
    .sort((a, b) => b.total_score - a.total_score)
    .map((s, i) => ({ ...s, rank: i + 1 } as RankedProduct))
}

export function buildComparisonTable(
  ranked: RankedProduct[],
  normConfig: NormalizationConfig,
): ComparisonRow[] {
  const rows: ComparisonRow[] = []
  const allFeatures = new Set<string>()

  ranked.forEach((r) => {
    const product = r.product as ProductWithSpecs
    product.specs?.forEach((s) => allFeatures.add(s.spec_key))
  })

  for (const feature of Array.from(allFeatures)) {
    const rule = normConfig[feature]
    if (!rule) continue

    const values: ComparisonRow['values'] = {}
    let bestNormalized = -1

    for (const r of ranked) {
      const product = r.product as ProductWithSpecs
      const spec = product.specs?.find((s) => s.spec_key === feature)
      if (!spec) continue

      const normalized = r.feature_scores[feature] ?? 0
      if (normalized > bestNormalized) bestNormalized = normalized

      let flag: 'verified' | 'claimed' | 'inflated' | undefined
      if (spec.verified) {
        flag = 'verified'
      } else if (spec.confidence < 0.6) {
        flag = 'inflated'
      } else {
        flag = 'claimed'
      }

      values[r.product_id] = {
        raw: spec.spec_value,
        normalized,
        is_best: false,
        flag,
      }
    }

    for (const id of Object.keys(values)) {
      if (values[id].normalized === bestNormalized) {
        values[id].is_best = true
      }
    }

    rows.push({ feature, display_name: rule.display_name, unit: rule.unit, values })
  }

  return rows
}
