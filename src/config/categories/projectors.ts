import type { NormalizationConfig } from '@/types/scoring'

export const PROJECTOR_CONFIG: NormalizationConfig = {
  brightness_ansi: {
    type: 'log',
    min: 100,
    max: 3000,
    higher_is_better: true,
    display_name: 'Brightness',
    description: 'Measured in ANSI lumens (not marketing lumens)',
    unit: 'ANSI lm',
  },
  resolution: {
    type: 'tier',
    mapping: { '480p': 0.1, '720p': 0.4, '1080p': 0.7, '1440p': 0.85, '4K': 1.0 },
    display_name: 'Native Resolution',
    description: 'Native resolution of the display chip',
  },
  price: {
    type: 'log_inverted',
    min: 5000,
    max: 200000,
    display_name: 'Price',
    description: 'Current market price',
    unit: '₹',
  },
  netflix_certified: {
    type: 'binary',
    display_name: 'Netflix Certified',
    description: 'WideVine L1 DRM for HD streaming on Netflix, Prime Video, etc.',
  },
  auto_focus: {
    type: 'tier',
    mapping: { none: 0, manual: 0.3, auto: 0.7, full_auto: 1.0 },
    display_name: 'Auto Focus',
    description: 'Automatic focus adjustment capability',
  },
  auto_keystone: {
    type: 'binary',
    display_name: 'Auto Keystone',
    description: 'Automatic keystone correction for angled placement',
  },
  speaker_watts: {
    type: 'log',
    min: 1,
    max: 30,
    higher_is_better: true,
    display_name: 'Built-in Speakers',
    description: 'Speaker power output',
    unit: 'W',
  },
  obstacle_avoidance: {
    type: 'binary',
    display_name: 'Obstacle Avoidance',
    description: 'Auto-adjusts projection to avoid objects on the wall',
  },
  dust_proof: {
    type: 'binary',
    display_name: 'Dust Proof',
    description: 'Sealed optical engine to prevent dust spots',
  },
  hdmi_arc: {
    type: 'binary',
    display_name: 'HDMI ARC',
    description: 'Audio Return Channel for soundbar connectivity',
  },
  wifi_version: {
    type: 'tier',
    mapping: { none: 0, wifi4: 0.3, wifi5: 0.6, wifi6: 1.0 },
    display_name: 'WiFi',
    description: 'Wireless connectivity standard',
  },
  throw_ratio: {
    type: 'inverted',
    min: 0.5,
    max: 2.0,
    display_name: 'Throw Ratio',
    description: 'Lower = larger image from shorter distance',
  },
  weight_kg: {
    type: 'inverted',
    min: 0.3,
    max: 5.0,
    display_name: 'Weight',
    description: 'Device weight for portability',
    unit: 'kg',
  },
}
