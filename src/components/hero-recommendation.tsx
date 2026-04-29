'use client'

import { motion } from 'framer-motion'
import { Crown, AlertTriangle, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AffiliateButton } from './affiliate-button'
import { ScoreBar } from './score-bar'
import type { RankedProduct } from '@/types/scoring'
import { formatPrice } from '@/lib/utils'

interface HeroRecommendationProps {
  product: RankedProduct
}

export function HeroRecommendation({ product }: HeroRecommendationProps) {
  const p = product.product

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-lg"
    >
      {/* Winner badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">
          <Crown className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold text-indigo-700">Best Match for You</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Product image placeholder */}
        <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-4xl">
          {p.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image_url} alt={p.name} className="h-full w-full rounded-xl object-contain p-2" />
          ) : (
            '📦'
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{p.brand}</p>
              <h2 className="text-xl font-bold text-slate-900">{p.name}</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">
                {formatPrice(p.price_current, p.currency)}
              </p>
              {p.price_original && p.price_original > p.price_current && (
                <p className="text-sm text-slate-400 line-through">
                  {formatPrice(p.price_original, p.currency)}
                </p>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="mt-3">
            <ScoreBar score={product.total_score} label="Match Score" />
          </div>

          {/* Highlights & Warnings */}
          <div className="mt-3 flex flex-wrap gap-2">
            {product.highlights.slice(0, 3).map((h) => (
              <Badge key={h} variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700">
                <CheckCircle className="h-3 w-3" />
                {h}
              </Badge>
            ))}
            {product.warnings.slice(0, 2).map((w) => (
              <Badge key={w} variant="secondary" className="gap-1 bg-amber-50 text-amber-700">
                <AlertTriangle className="h-3 w-3" />
                {w}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Buy buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {p.amazon_url && (
          <AffiliateButton
            productId={p.id}
            productName={p.name}
            store="amazon"
            url={p.affiliate_amazon_url ?? p.amazon_url}
          />
        )}
        {p.flipkart_url && (
          <AffiliateButton
            productId={p.id}
            productName={p.name}
            store="flipkart"
            url={p.affiliate_flipkart_url ?? p.flipkart_url}
          />
        )}
      </div>
    </motion.div>
  )
}
