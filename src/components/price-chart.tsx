'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import type { PriceHistory } from '@/types/product'
import { formatPrice } from '@/lib/utils'

interface PriceChartProps {
  history: PriceHistory[]
  currency?: string
}

export function PriceChart({ history, currency = 'INR' }: PriceChartProps) {
  if (!history.length) return null

  const data = history.map((h) => ({
    date: new Date(h.recorded_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    price: h.price,
    source: h.source,
  }))

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-sm font-medium text-slate-700">Price History</p>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(v) => [formatPrice(Number(v), currency), 'Price']}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#priceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
