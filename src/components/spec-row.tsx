import { CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface SpecRowProps {
  label: string
  value: string
  unit?: string
  flag?: 'verified' | 'claimed' | 'inflated'
  isBest?: boolean
  estimatedValue?: string
}

export function SpecRow({ label, value, unit, flag, isBest, estimatedValue }: SpecRowProps) {
  return (
    <div className={cn('flex items-center justify-between py-2', isBest && 'font-medium')}>
      <span className="text-sm text-slate-600">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={cn('text-sm text-slate-900', isBest && 'text-emerald-700')}>
          {value}
          {unit && <span className="ml-0.5 text-xs text-slate-400">{unit}</span>}
        </span>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                {flag === 'verified' && (
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                )}
                {flag === 'claimed' && (
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                )}
                {flag === 'inflated' && (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {flag === 'verified' && 'Verified by independent testing'}
              {flag === 'claimed' && 'Manufacturer claimed — not independently verified'}
              {flag === 'inflated' && (
                <>
                  ⚠️ Likely inflated claim.
                  {estimatedValue && ` Estimated real value: ~${estimatedValue}`}
                </>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
