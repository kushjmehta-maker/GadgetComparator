'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface ExplanationPanelProps {
  explanation: string
}

export function ExplanationPanel({ explanation }: ExplanationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-indigo-100 bg-indigo-50 p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-indigo-600" />
        <span className="text-sm font-semibold text-indigo-800">AI Analysis</span>
      </div>
      <p className="text-sm leading-relaxed text-slate-700">{explanation}</p>
    </motion.div>
  )
}
