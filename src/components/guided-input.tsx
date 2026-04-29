'use client'

import { useState } from 'react'
import { useQuery } from '@/hooks/use-query'
import { CATEGORIES } from '@/lib/constants'

type Step = 'category' | 'budget' | 'use_case' | 'done'

export function GuidedInput() {
  const [step, setStep] = useState<Step>('category')
  const [category, setCategory] = useState('')
  const [budget, setBudget] = useState('')
  const [useCase, setUseCase] = useState('')
  const { submitQuery } = useQuery()

  const handleFinish = () => {
    const query = `Best ${category} ${budget ? `under ₹${budget}` : ''} for ${useCase}`.trim()
    submitQuery(query, 'discover')
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-4 text-sm font-medium text-slate-700">Let me help you find the right product step by step:</p>

      {step === 'category' && (
        <div>
          <p className="mb-3 text-xs text-slate-500">What type of product?</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => { setCategory(c.label); setStep('budget') }}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm transition-colors hover:border-indigo-300 hover:text-indigo-700"
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'budget' && (
        <div>
          <p className="mb-1 text-xs text-slate-500">What&apos;s your budget? (₹, leave empty if open)</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 20000"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
            <button
              onClick={() => setStep('use_case')}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 'use_case' && (
        <div>
          <p className="mb-1 text-xs text-slate-500">What will you primarily use it for?</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              placeholder="e.g. Netflix, gaming, work from home"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
            <button
              onClick={handleFinish}
              disabled={!useCase}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Find
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
