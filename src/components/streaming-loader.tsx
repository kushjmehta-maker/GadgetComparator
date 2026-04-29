'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Brain, Search, BarChart3, Sparkles } from 'lucide-react'
import { useQueryStore } from '@/store/query-store'

const STEP_ICONS = {
  parsing: Brain,
  searching: Search,
  analyzing: BarChart3,
  scoring: BarChart3,
  explaining: Sparkles,
}

const STEP_PROGRESS = {
  parsing: 15,
  searching: 35,
  analyzing: 55,
  scoring: 75,
  explaining: 90,
}

export function StreamingLoader() {
  const { isLoading, currentStep, statusMessage } = useQueryStore()

  if (!isLoading && !currentStep) return null

  const Icon = currentStep ? STEP_ICONS[currentStep] : Loader2
  const progress = currentStep ? STEP_PROGRESS[currentStep] : 5

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mx-auto mt-8 w-full max-w-lg"
      >
        <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Icon className="h-5 w-5 animate-spin text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                {statusMessage || 'Processing your request…'}
              </p>
              <p className="text-xs text-slate-500">This takes 5–10 seconds</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-indigo-500"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Dots */}
          <div className="mt-3 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="loading-dot h-1.5 w-1.5 rounded-full bg-indigo-400"
                style={{ animationDelay: `${i * -0.16}s` }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
