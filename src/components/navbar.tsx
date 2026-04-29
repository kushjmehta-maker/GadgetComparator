import Link from 'next/link'
import { Zap } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[var(--max-width)] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Zap className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">{APP_NAME}</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm text-slate-600">
          <Link
            href="/category/projectors"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Projectors
          </Link>
          <Link
            href="/category/smartphones"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Phones
          </Link>
          <Link
            href="/category/laptops"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Laptops
          </Link>
        </nav>
      </div>
    </header>
  )
}
