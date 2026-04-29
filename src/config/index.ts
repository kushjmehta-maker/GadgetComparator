import type { NormalizationConfig } from '@/types/scoring'
import { PROJECTOR_CONFIG } from './categories/projectors'
import { SMARTPHONE_CONFIG } from './categories/smartphones'
import { SMARTWATCH_CONFIG } from './categories/smartwatches'
import { LAPTOP_CONFIG } from './categories/laptops'
import { EARBUDS_CONFIG } from './categories/earbuds'

export const CATEGORY_CONFIGS: Record<string, NormalizationConfig> = {
  projector: PROJECTOR_CONFIG,
  smartphone: SMARTPHONE_CONFIG,
  smartwatch: SMARTWATCH_CONFIG,
  laptop: LAPTOP_CONFIG,
  earbuds: EARBUDS_CONFIG,
}

export function getCategoryConfig(category: string): NormalizationConfig {
  return CATEGORY_CONFIGS[category] ?? PROJECTOR_CONFIG
}

export {
  PROJECTOR_CONFIG,
  SMARTPHONE_CONFIG,
  SMARTWATCH_CONFIG,
  LAPTOP_CONFIG,
  EARBUDS_CONFIG,
}
