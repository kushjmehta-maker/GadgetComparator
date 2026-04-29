import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChatInput } from '@/components/chat-input'
import { StreamingLoader } from '@/components/streaming-loader'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

const SLUG_TO_NAME: Record<string, string> = {
  projectors: 'projector',
  smartphones: 'smartphone',
  laptops: 'laptop',
  earbuds: 'earbuds',
  smartwatches: 'smartwatch',
  tablets: 'tablet',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: `Browse ${slug.charAt(0).toUpperCase() + slug.slice(1)}` }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const categoryName = SLUG_TO_NAME[slug] ?? slug

  const supabase = await createClient()
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('name', categoryName)
    .single()

  if (!category) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, brand, slug, price_current, currency, image_url, thumbnail_url, data_quality_score')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('data_quality_score', { ascending: false })
    .limit(24)

  return (
    <div className="mx-auto max-w-[var(--max-width)] px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{category.display_name}</h1>
        {category.description && (
          <p className="mt-2 text-slate-500">{category.description}</p>
        )}
      </div>

      {/* AI Search */}
      <div className="mb-10 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
        <p className="mb-3 text-sm font-medium text-indigo-800">
          Get AI recommendations for {category.display_name}
        </p>
        <ChatInput />
        <StreamingLoader />
      </div>

      {/* Product grid */}
      {products?.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-slate-50 text-3xl">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-full w-full rounded-lg object-contain p-2"
                  />
                ) : (
                  '📦'
                )}
              </div>
              <p className="text-xs text-slate-400">{p.brand}</p>
              <p className="text-sm font-medium text-slate-900 line-clamp-2">{p.name}</p>
              <p className="mt-1 text-sm font-bold text-indigo-700">
                {formatPrice(p.price_current, p.currency)}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">No products available yet. Check back soon.</p>
      )}
    </div>
  )
}
