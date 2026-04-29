'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ArrowRight, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@/hooks/use-query'
import { EXAMPLE_QUERIES } from '@/lib/constants'

export function ChatInput() {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { submitQuery, isLoading } = useQuery()

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  const handleSubmit = async () => {
    if (!value.trim() || isLoading) return
    const mode = value.toLowerCase().includes(' vs ') ? 'compare' : 'discover'
    await submitQuery(value.trim(), mode)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="w-full">
      <motion.div
        animate={{ boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.15)' : '0 0 0 0px transparent' }}
        className="relative rounded-2xl border border-slate-200 bg-white transition-colors hover:border-indigo-300"
      >
        <div className="flex items-start gap-3 p-4">
          <Search className="mt-1 h-5 w-5 flex-shrink-0 text-slate-400" />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you need — e.g. &quot;Best projector under ₹20,000 for Netflix in bedroom&quot;"
            className="flex-1 resize-none bg-transparent text-slate-900 placeholder-slate-400 outline-none text-base leading-relaxed"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || isLoading}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Example queries */}
      <AnimatePresence>
        {!value && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {EXAMPLE_QUERIES.slice(0, 4).map((q) => (
              <button
                key={q}
                onClick={() => setValue(q)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600"
              >
                {q}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
