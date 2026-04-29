import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-[var(--max-width)] px-4">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{APP_NAME}</p>
            <p className="mt-1 text-xs text-slate-500">AI-powered product decisions</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {['Projectors', 'Smartphones', 'Laptops', 'Earbuds', 'Smartwatches'].map((c) => (
                <li key={c}>
                  <Link href={`/category/${c.toLowerCase()}`} className="hover:text-indigo-600">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Legal</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li><Link href="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600">Terms of Use</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-indigo-600">Affiliate Disclosure</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">About</p>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              We earn commissions from qualifying purchases via affiliate links. Recommendations are based on AI analysis, not affiliate rates.
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
