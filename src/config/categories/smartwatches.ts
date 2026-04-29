import type { NormalizationConfig } from '@/types/scoring'

export const SMARTWATCH_CONFIG: NormalizationConfig = {
  price: {
    type: 'log_inverted',
    min: 1500,
    max: 80000,
    display_name: 'Price',
    description: 'Current market price',
    unit: '₹',
  },
  battery_days: {
    type: 'log',
    min: 1,
    max: 30,
    higher_is_better: true,
    display_name: 'Battery Life',
    description: 'Estimated battery life',
    unit: 'days',
  },
  display_type: {
    type: 'tier',
    mapping: { LCD: 0.4, AMOLED: 0.8, SUPER_AMOLED: 1.0, OLED: 0.9 },
    display_name: 'Display Type',
    description: 'Screen panel technology',
  },
  gps: {
    type: 'binary',
    display_name: 'Built-in GPS',
    description: 'Onboard GPS without phone',
  },
  heart_rate: {
    type: 'binary',
    display_name: 'Heart Rate Monitor',
    description: 'Continuous heart rate tracking',
  },
  spo2: {
    type: 'binary',
    display_name: 'SpO2 / Blood Oxygen',
    description: 'Blood oxygen saturation sensor',
  },
  ecg: {
    type: 'binary',
    display_name: 'ECG',
    description: 'Electrocardiogram functionality',
  },
  calling: {
    type: 'binary',
    display_name: 'Calling',
    description: 'Make and receive calls via Bluetooth',
  },
  nfc_payments: {
    type: 'binary',
    display_name: 'NFC Payments',
    description: 'Contactless payment support',
  },
  water_resistance_atm: {
    type: 'linear',
    min: 0,
    max: 10,
    higher_is_better: true,
    display_name: 'Water Resistance',
    description: 'Water resistance depth rating',
    unit: 'ATM',
  },
  strap_size_mm: {
    type: 'tier',
    mapping: { '20': 0.6, '22': 1.0, '44': 0.9, '46': 0.8, '49': 0.7 },
    display_name: 'Strap Size',
    description: 'Standard strap width',
    unit: 'mm',
  },
}
