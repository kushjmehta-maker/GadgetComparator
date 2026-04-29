import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SpecRow } from '@/components/spec-row'
import { AffiliateButton } from '@/components/affiliate-button'
import { PriceChart } from '@/components/price-chart'
import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'
import type { ProductWithSpecs, PriceHistory } from '@/types/product'
import { formatPrice } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<{ product: ProductWithSpecs; priceHistory: PriceHistory[] } | null> {
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*, specs:product_specs(*), category:categories(*)')
    .eq('slug', slug)
    .single()

  if (!product) return null

  const { data: priceHistory } = await supabase
    .from('price_history')
    .select('*')
    .eq('product_id', product.id)
    .order('recorded_at', { ascending: true })
    .limit(30)

  return { product: product as unknown as ProductWithSpecs, priceHistory: priceHistory ?? [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getProduct(slug)
  if (!result) return {}
  const { product } = result
  return {
    title: product.name,
    description: product.description ?? `${product.name} — Full specs and price`,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const result = await getProduct(slug)
  if (!result) notFound()

  const { product, priceHistory } = result

  return (
    <div className="mx-auto max-w-[var(--max-width)] px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <p className="text-xs text-slate-500">{product.brand}</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">{product.name}</h1>
            {product.description && (
              <p className="mt-2 text-slate-600">{product.description}</p>
            )}
          </div>

          {/* Specs */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Full Specifications</h2>
            </div>
            <div className="divide-y divide-slate-50 px-4">
              {product.specs?.map((spec) => (
                <SpecRow
                  key={spec.spec_key}
                  label={spec.spec_key.replace(/_/g, ' ')}
                  value={spec.spec_value}
                  flag={spec.verified ? 'verified' : spec.confidence < 0.6 ? 'inflated' : 'claimed'}
                />
              ))}
            </div>
          </div>

          {/* Price History */}
          {priceHistory.length > 1 && (
            <div className="mt-6">
              <PriceChart history={priceHistory} currency={product.currency} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4">
              <p className="text-3xl font-bold text-slate-900">
                {formatPrice(product.price_current, product.currency)}
              </p>
              {product.price_original && product.price_original > product.price_current && (
                <p className="text-sm text-slate-400 line-through">
                  {formatPrice(product.price_original, product.currency)}
                </p>
              )}
            </div>
            <Separator className="mb-4" />
            <div className="flex flex-col gap-2">
              {product.amazon_url && (
                <AffiliateButton
                  productId={product.id}
                  productName={product.name}
                  store="amazon"
                  url={product.affiliate_amazon_url ?? product.amazon_url}
                />
              )}
              {product.flipkart_url && (
                <AffiliateButton
                  productId={product.id}
                  productName={product.name}
                  store="flipkart"
                  url={product.affiliate_flipkart_url ?? product.flipkart_url}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
