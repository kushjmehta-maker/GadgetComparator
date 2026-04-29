import { createServiceClient } from '@/lib/supabase/server'
import { parseIntent } from '@/lib/ai/intent-parser'
import { generateWeights } from '@/lib/ai/weight-generator'
import { generateExplanation } from '@/lib/ai/explanation-generator'
import { getCategoryConfig } from '@/config/index'
import { scoreProduct, buildComparisonTable } from '@/lib/engine/scorer'
import { rankProducts } from '@/lib/engine/ranker'
import { generateQuerySlug, hashIntent } from '@/lib/utils'
import { cacheGet, cacheSet, buildCacheKey } from '@/lib/cache'
import { CACHE_TTL } from '@/lib/constants'
import type { ProductWithSpecs } from '@/types/product'
import type { ParsedIntent } from '@/types/query'

export async function POST(req: Request) {
  const { input, mode } = await req.json()
  const startTime = Date.now()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type, data })}\n\n`),
        )
      }

      try {
        // Step 1: Parse intent
        send('status', { step: 'parsing', message: 'Understanding your needs…' })
        const intent = await parseIntent(input)
        send('intent_parsed', { intent })

        // Check cache
        const cacheKey = buildCacheKey('query', hashIntent(intent))
        const cached = await cacheGet(cacheKey)
        if (cached) {
          send('done', { ...(cached as object), metadata: { ...(cached as { metadata: object }).metadata, cache_hit: true } })
          controller.close()
          return
        }

        // Step 2: Find products
        send('status', { step: 'searching', message: `Finding ${intent.category}s…` })
        const supabase = await createServiceClient()
        let products: ProductWithSpecs[] = []

        if (mode === 'compare' && intent.products_to_compare?.length) {
          const { data } = await supabase
            .from('products')
            .select('*, specs:product_specs(*), category:categories(*)')
            .in('name', intent.products_to_compare)
            .eq('is_active', true)
          products = (data ?? []) as unknown as ProductWithSpecs[]
        } else {
          products = await searchProducts(supabase, intent)
        }

        send('products_found', { count: products.length })

        if (!products.length) {
          send('done', {
            query_id: null,
            slug: null,
            rankings: [],
            explanation: 'No products found for your query. Try different terms.',
            comparison_table: [],
            metadata: { total_products_analyzed: 0, time_ms: Date.now() - startTime, cache_hit: false },
          })
          controller.close()
          return
        }

        // Step 3: Generate weights
        send('status', { step: 'analyzing', message: 'Analyzing for your needs…' })
        const normConfig = getCategoryConfig(intent.category)
        const weights = await generateWeights(intent, normConfig)

        // Step 4: Score and rank
        send('status', { step: 'scoring', message: 'Scoring products…' })
        const scores = products.map((p) => scoreProduct(p, weights, normConfig))
        const ranked = rankProducts(scores)
        send('ranking_complete', { rankings: ranked.slice(0, 10) })

        // Step 5: Generate explanation
        send('status', { step: 'explaining', message: 'Writing recommendation…' })
        const explanation = await generateExplanation(input, intent, ranked)
        send('explanation_ready', { explanation })

        // Step 6: Build comparison table
        const table = buildComparisonTable(ranked.slice(0, 5), normConfig)

        // Step 7: Save to database
        const slug = generateQuerySlug(input)
        const { data: queryRecord } = await supabase
          .from('queries')
          .insert({
            raw_input: input,
            query_mode: mode,
            parsed_intent: intent as unknown as Record<string, unknown>,
            generated_weights: weights as unknown as Record<string, unknown>,
            ranking_results: ranked.slice(0, 10) as unknown as Record<string, unknown>[],
            explanation,
            result_count: ranked.length,
            time_to_result_ms: Date.now() - startTime,
            slug,
          })
          .select()
          .single()

        const result = {
          query_id: queryRecord?.id ?? null,
          slug,
          rankings: ranked.slice(0, 5),
          explanation,
          comparison_table: table,
          metadata: {
            total_products_analyzed: products.length,
            time_ms: Date.now() - startTime,
            cache_hit: false,
          },
        }

        await cacheSet(cacheKey, result, CACHE_TTL.QUERY)
        send('done', result)
      } catch (err) {
        console.error('Stream error:', err)
        send('error', { message: 'Something went wrong. Please try again.' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

async function searchProducts(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  intent: ParsedIntent,
): Promise<ProductWithSpecs[]> {
  const { data: categories } = await supabase
    .from('categories')
    .select('id')
    .eq('name', intent.category)
    .single()

  if (!categories?.id) return []

  let query = supabase
    .from('products')
    .select('*, specs:product_specs(*), category:categories(*)')
    .eq('category_id', categories.id)
    .eq('is_active', true)

  if (intent.budget.flexibility !== 'open' && intent.budget.max > 0) {
    const maxBudget = intent.budget.flexibility === 'flexible'
      ? intent.budget.max * 1.2
      : intent.budget.max
    query = query.lte('price_current', maxBudget)
  }

  const { data } = await query.order('data_quality_score', { ascending: false }).limit(30)
  return (data ?? []) as unknown as ProductWithSpecs[]
}
