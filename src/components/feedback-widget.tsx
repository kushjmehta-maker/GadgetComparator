'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeedbackWidgetProps {
  queryId?: string
}

export function FeedbackWidget({ queryId }: FeedbackWidgetProps) {
  const [submitted, setSubmitted] = useState(false)
  const [selected, setSelected] = useState<'up' | 'down' | null>(null)

  const handleFeedback = async (rating: 'up' | 'down') => {
    setSelected(rating)
    setSubmitted(true)

    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query_id: queryId,
        rating: rating === 'up' ? 5 : 1,
        feedback_type: rating === 'up' ? 'helpful' : 'not_helpful',
      }),
    }).catch(() => {})
  }

  if (submitted) {
    return (
      <p className="text-sm text-slate-500">
        {selected === 'up' ? '👍 Thanks for the feedback!' : '👎 We\'ll try to do better.'}
      </p>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-500">Was this helpful?</span>
      <div className="flex gap-2">
        <button
          onClick={() => handleFeedback('up')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors',
            'border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700',
          )}
        >
          <ThumbsUp className="h-4 w-4" />
          Yes
        </button>
        <button
          onClick={() => handleFeedback('down')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors',
            'border-slate-200 text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700',
          )}
        >
          <ThumbsDown className="h-4 w-4" />
          No
        </button>
      </div>
    </div>
  )
}
