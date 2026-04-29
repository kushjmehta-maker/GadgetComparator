'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AffiliateButton } from './affiliate-button'
import { ScoreBar } from './score-bar'
import type { RankedProduct } from '@/types/scoring'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: RankedProduct
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const p = product.product

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row"
    >
      {/* Rank badge */}
      <div className="flex flex-row items-start gap-3 sm:flex-col sm:items-center">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
          #{product.rank}
        </span>
        {/* Thumbnail */}
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-50 text-2xl">
          {p.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image_url} alt={p.name} className="h-full w-full rounded-lg object-contain p-1" />
          ) : (
            '📦'
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs text-slate-500">{p.brand}</p>
            <h3 className="font-semibold text-slate-900">{p.name}</h3>
          </div>
          <p className="text-lg font-bold text-slate-900">
            {formatPrice(p.price_current, p.currency)}
          </p>
        </div>

        <ScoreBar score={product.total_score} />

        <div className="flex flex-wrap gap-1.5">
          {product.highlights.slice(0, 2).map((h) => (
            <Badge key={h} variant="secondary" className="gap-1 bg-emerald-50 text-xs text-emerald-700">
              <CheckCircle className="h-3 w-3" />
              {h}
            </Badge>
          ))}
          {product.warnings.slice(0, 1).map((w) => (
            <Badge key={w} variant="secondary" className="gap-1 bg-amber-50 text-xs text-amber-700">
              <AlertTriangle className="h-3 w-3" />
              {w}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {p.amazon_url && (
            <AffiliateButton
              productId={p.id}
              productName={p.name}
              store="amazon"
              url={p.affiliate_amazon_url ?? p.amazon_url}
              size="sm"
            />
          )}
          {p.flipkart_url && (
            <AffiliateButton
              productId={p.id}
              productName={p.name}
              store="flipkart"
              url={p.affiliate_flipkart_url ?? p.flipkart_url}
              size="sm"
            />
          )}
          <a
            href={`/product/${p.slug}`}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
          >
            Full specs <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
