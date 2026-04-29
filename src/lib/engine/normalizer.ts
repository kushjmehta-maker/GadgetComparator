import type { NormalizationRule, NormalizationType } from '@/types/scoring'

function clamp(v: number): number {
  return Math.max(0, Math.min(1, v))
}

export function normalize(value: number, rule: NormalizationRule): number {
  const { type, min = 0, max = 1, mapping } = rule

  switch (type as NormalizationType) {
    case 'linear':
      if (max === min) return 0
      return clamp((value - min) / (max - min))
    case 'log':
      if (value <= 0 || min <= 0 || max <= 0) return 0
      return clamp(Math.log(value / min) / Math.log(max / min))
    case 'log_inverted':
      if (value <= 0 || min <= 0 || max <= 0) return 0
      return 1 - clamp(Math.log(value / min) / Math.log(max / min))
    case 'inverted':
      if (max === min) return 0
      return 1 - clamp((value - min) / (max - min))
    case 'tier':
      return mapping?.[String(value)] ?? 0
    case 'binary':
      return value ? 1 : 0
    default:
      return 0
  }
}

export function normalizeString(value: string, rule: NormalizationRule): number {
  switch (rule.type) {
    case 'tier':
      return rule.mapping?.[value] ?? 0
    case 'binary': {
      const lower = value.toLowerCase()
      return lower === 'true' || lower === '1' || lower === 'yes' ? 1 : 0
    }
    default:
      return 0
  }
}
