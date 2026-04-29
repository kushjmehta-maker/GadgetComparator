import { ChatInput } from '@/components/chat-input'
import { CategoryPills } from '@/components/category-pills'
import { StreamingLoader } from '@/components/streaming-loader'
import { APP_NAME } from '@/lib/constants'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[var(--max-width)] px-4 py-12">
      {/* Hero */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find the{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            right gadget
          </span>{' '}
          for <em>you</em>
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Describe what you need. Get AI-ranked recommendations with honest explanations
          — not paid rankings.
        </p>
      </div>

      {/* Search */}
      <div className="mx-auto mt-10 max-w-2xl">
        <ChatInput />
        <StreamingLoader />
      </div>

      {/* Categories */}
      <div className="mt-12">
        <p className="mb-4 text-center text-sm font-medium text-slate-500">
          Or browse by category
        </p>
        <CategoryPills />
      </div>

      {/* How it works */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-2xl font-bold text-slate-900">
          How {APP_NAME} works
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Describe your needs',
              desc: 'Tell us what you need in plain English — budget, use case, must-haves.',
            },
            {
              step: '02',
              title: 'AI scores products',
              desc: 'We weight every spec against your specific requirements, not generic benchmarks.',
            },
            {
              step: '03',
              title: 'Get honest ranking',
              desc: 'See ranked results with explanations, spec flags, and verified data badges.',
            },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-slate-200 bg-white p-5">
              <span className="text-xs font-bold text-indigo-400">{item.step}</span>
              <h3 className="mt-1 font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
