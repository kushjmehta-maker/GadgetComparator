import { cn } from '@/lib/utils'

interface ScoreBarProps {
  score: number
  label?: string
  showPercent?: boolean
  className?: string
}

export function ScoreBar({ score, label, showPercent = true, className }: ScoreBarProps) {
  const percent = Math.round(score * 100)
  const color =
    percent >= 80
      ? 'bg-emerald-500'
      : percent >= 60
        ? 'bg-indigo-500'
        : percent >= 40
          ? 'bg-amber-500'
          : 'bg-red-400'

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="mb-1 flex items-center justify-between">
          {label && <span className="text-xs text-slate-500">{label}</span>}
          {showPercent && (
            <span className="text-xs font-semibold text-slate-700">{percent}/100</span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
