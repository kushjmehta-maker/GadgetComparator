'use client'

import Link from 'next/link'
import { CATEGORIES } from '@/lib/constants'

export function CategoryPills() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md hover:text-indigo-700"
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </Link>
      ))}
    </div>
  )
}
