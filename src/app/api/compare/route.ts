import { createClient } from '@/lib/supabase/server'
import { parseIntent } from '@/lib/ai/intent-parser'
import { generateWeights } from '@/lib/ai/weight-generator'
import { getCategoryConfig } from '@/config/index'
import { scoreProduct, buildComparisonTable } from '@/lib/engine/scorer'
import { rankProducts } from '@/lib/engine/ranker'
import { generateQuerySlug } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { ProductWithSpecs } from '@/types/product'

export async function POST(req: Request) {
  try {
    const { products: productNames } = await req.json()

    if (!productNames?.length) {
      return NextResponse.json({ error: 'products required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: products, error } = await supabase
      .from('products')
      .select('*, specs:product_specs(*), category:categories(*)')
      .in('name', productNames)
      .eq('is_active', true)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!products?.length) return NextResponse.json({ error: 'No products found' }, { status: 404 })

    const typedProducts = products as unknown as ProductWithSpecs[]
    const categoryName = typedProducts[0].category?.name ?? 'projector'
    const normConfig = getCategoryConfig(categoryName)

    const input = `Compare ${productNames.join(' vs ')}`
    const intent = await parseIntent(input)
    const weights = await generateWeights(intent, normConfig)

    const scores = typedProducts.map((p) => scoreProduct(p, weights, normConfig))
    const ranked = rankProducts(scores)
    const table = buildComparisonTable(ranked, normConfig)

    const slug = generateQuerySlug(input)
    await supabase.from('queries').insert({
      raw_input: input,
      query_mode: 'compare',
      parsed_intent: intent as unknown as Record<string, unknown>,
      generated_weights: weights as unknown as Record<string, unknown>,
      ranking_results: ranked as unknown as Record<string, unknown>[],
      result_count: ranked.length,
      slug,
    })

    return NextResponse.json({ data: { ranked, comparison_table: table, slug } })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
