import type { ProductWithSpecs } from '@/types/product'
import type {
  GeneratedWeights,
  NormalizationConfig,
  RankedProduct,
  ComparisonRow,
} from '@/types/scoring'
import { scoreProduct, rankProducts, buildComparisonTable } from './scorer'

export { rankProducts }

export function runRanking(
  products: ProductWithSpecs[],
  weights: GeneratedWeights,
  normConfig: NormalizationConfig,
): {
  ranked: RankedProduct[]
  excluded: { product: ProductWithSpecs; reasons: string[] }[]
  comparison_table: ComparisonRow[]
} {
  const scores = products.map((p) => scoreProduct(p, weights, normConfig))
  const ranked = rankProducts(scores)

  const excluded = scores
    .filter((s) => !s.passes_constraints)
    .map((s) => ({
      product: s.product as ProductWithSpecs,
      reasons: s.constraint_failures,
    }))

  const comparison_table = buildComparisonTable(
    ranked.slice(0, 5),
    normConfig,
  )

  return { ranked, excluded, comparison_table }
}
