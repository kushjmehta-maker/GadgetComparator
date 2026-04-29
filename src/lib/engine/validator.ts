import type { ProductWithSpecs } from '@/types/product'

export interface ValidationResult {
  product_id: string
  product_name: string
  flags: ValidationFlag[]
  data_quality_score: number
}

export interface ValidationFlag {
  spec_key: string
  display_name: string
  claimed_value: string
  estimated_value?: string
  reason: string
  severity: 'warning' | 'critical'
}

// Known inflated spec patterns for budget projectors
const INFLATED_SPEC_RULES: Array<{
  category: string
  spec_key: string
  // price below which high values are suspicious
  max_price_for_high_claim: number
  // value above which it's likely inflated
  high_claim_threshold: number
  // realistic max for the price bracket
  realistic_max: (price: number) => number
  unit: string
}> = [
  {
    category: 'projector',
    spec_key: 'brightness_ansi',
    max_price_for_high_claim: 20000,
    high_claim_threshold: 2000,
    realistic_max: (price) => Math.min(800, price / 20),
    unit: 'ANSI lm',
  },
]

export function validateProduct(product: ProductWithSpecs): ValidationResult {
  const flags: ValidationFlag[] = []

  for (const rule of INFLATED_SPEC_RULES) {
    if (product.category?.name !== rule.category) continue

    const spec = product.specs.find((s) => s.spec_key === rule.spec_key)
    if (!spec?.spec_value_numeric) continue

    const claimedValue = spec.spec_value_numeric
    const price = product.price_current

    if (
      price <= rule.max_price_for_high_claim &&
      claimedValue >= rule.high_claim_threshold &&
      !spec.verified
    ) {
      const realisticMax = rule.realistic_max(price)
      flags.push({
        spec_key: rule.spec_key,
        display_name: spec.spec_key,
        claimed_value: `${claimedValue} ${rule.unit}`,
        estimated_value: `~${Math.round(realisticMax)} ${rule.unit}`,
        reason: `Budget products at this price point rarely exceed ${Math.round(realisticMax)} ${rule.unit}`,
        severity: claimedValue > rule.high_claim_threshold * 5 ? 'critical' : 'warning',
      })
    }
  }

  const dataQualityScore = calculateDataQuality(product, flags)

  return {
    product_id: product.id,
    product_name: product.name,
    flags,
    data_quality_score: dataQualityScore,
  }
}

function calculateDataQuality(
  product: ProductWithSpecs,
  flags: ValidationFlag[],
): number {
  const totalSpecs = product.specs.length
  if (totalSpecs === 0) return 0

  const verifiedCount = product.specs.filter((s) => s.verified).length
  const avgConfidence =
    product.specs.reduce((sum, s) => sum + s.confidence, 0) / totalSpecs

  const verifiedRatio = verifiedCount / totalSpecs
  const penaltyForFlags = flags.length * 0.1
  const criticalPenalty =
    flags.filter((f) => f.severity === 'critical').length * 0.2

  return Math.max(
    0,
    Math.min(1, (verifiedRatio * 0.4 + avgConfidence * 0.6) - penaltyForFlags - criticalPenalty),
  )
}
