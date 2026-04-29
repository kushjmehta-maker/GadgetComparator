import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { HeroRecommendation } from '@/components/hero-recommendation'
import { ProductCard } from '@/components/product-card'
import { ComparisonTable } from '@/components/comparison-table'
import { ExplanationPanel } from '@/components/explanation-panel'
import { ShareCard } from '@/components/share-card'
import { FeedbackWidget } from '@/components/feedback-widget'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

async function getQueryData(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('queries')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getQueryData(slug)
  if (!data) return {}
  return {
    title: `Compare: ${data.raw_input}`,
    description: data.explanation ?? undefined,
  }
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params
  const data = await getQueryData(slug)
  if (!data) notFound()

  const results = data.ranking_results as unknown as {
    rankings: Parameters<typeof HeroRecommendation>[0]['product'][]
    comparison_table: Parameters<typeof ComparisonTable>[0]['rows']
    explanation: string
  }

  const rankings = (data.ranking_results as { rankings?: unknown[] })?.rankings ?? (data.ranking_results as unknown[]) ?? []
  const compTable = (data.ranking_results as { comparison_table?: unknown[] })?.comparison_table ?? []

  return (
    <div className="mx-auto max-w-[var(--max-width)] px-4 py-8">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Compare</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{data.raw_input}</h1>
      </div>

      {data.explanation && (
        <div className="mb-6">
          <ExplanationPanel explanation={data.explanation} />
        </div>
      )}

      {rankings.length > 0 && (
        <>
          <div className="mb-6">
            <HeroRecommendation product={rankings[0] as Parameters<typeof HeroRecommendation>[0]['product']} />
          </div>

          {rankings.length > 1 && (
            <div className="mb-6 space-y-3">
              <h2 className="text-sm font-semibold text-slate-700">Other Options</h2>
              {(rankings.slice(1) as Parameters<typeof ProductCard>[0]['product'][]).map((p, i) => (
                <ProductCard key={p.product_id} product={p} index={i} />
              ))}
            </div>
          )}

          {compTable.length > 0 && (
            <div className="mb-6">
              <ComparisonTable
                rows={compTable as Parameters<typeof ComparisonTable>[0]['rows']}
                products={rankings as Parameters<typeof ComparisonTable>[0]['products']}
              />
            </div>
          )}
        </>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
        <FeedbackWidget queryId={data.id} />
        <ShareCard />
      </div>
    </div>
  )
}
