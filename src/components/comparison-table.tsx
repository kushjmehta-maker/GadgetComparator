'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ComparisonRow } from '@/types/scoring'
import type { RankedProduct } from '@/types/scoring'

interface ComparisonTableProps {
  rows: ComparisonRow[]
  products: RankedProduct[]
}

export function ComparisonTable({ rows, products }: ComparisonTableProps) {
  if (!rows.length || !products.length) return null

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">Spec Comparison</h3>
      </div>

      <ScrollArea className="w-full">
        <div className="min-w-[600px]">
          {/* Header row */}
          <div
            className="grid border-b border-slate-100 bg-slate-50"
            style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}
          >
            <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Feature
            </div>
            {products.map((p) => (
              <div key={p.product_id} className="px-3 py-3">
                <p className="text-xs font-semibold text-slate-700 truncate">{p.product.name}</p>
                <p className="text-xs text-slate-400">#{p.rank}</p>
              </div>
            ))}
          </div>

          {/* Data rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={cn(
                'grid border-b border-slate-50',
                i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
              )}
              style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}
            >
              {/* Feature name — sticky */}
              <div className="sticky left-0 flex items-center bg-inherit px-4 py-2.5">
                <span className="text-xs font-medium text-slate-600">{row.display_name}</span>
                {row.unit && (
                  <span className="ml-1 text-xs text-slate-400">({row.unit})</span>
                )}
              </div>

              {/* Product values */}
              {products.map((p) => {
                const cell = row.values[p.product_id]
                if (!cell) {
                  return (
                    <div key={p.product_id} className="px-3 py-2.5">
                      <span className="text-xs text-slate-300">—</span>
                    </div>
                  )
                }
                return (
                  <div
                    key={p.product_id}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2.5',
                      cell.is_best && 'text-emerald-700',
                    )}
                  >
                    <span className={cn('text-xs', cell.is_best ? 'font-semibold' : 'text-slate-700')}>
                      {cell.raw}
                    </span>
                    {cell.flag === 'verified' && (
                      <CheckCircle className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                    )}
                    {cell.flag === 'claimed' && (
                      <HelpCircle className="h-3 w-3 text-slate-400 flex-shrink-0" />
                    )}
                    {cell.flag === 'inflated' && (
                      <AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-400">
        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-emerald-500" /> Verified</span>
        <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3 text-slate-400" /> Claimed</span>
        <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-amber-500" /> Likely inflated</span>
      </div>
    </div>
  )
}
