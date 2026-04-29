'use client'

import { ExternalLink, ShoppingCart } from 'lucide-react'

interface AffiliateButtonProps {
  productId: string
  productName: string
  store: 'amazon' | 'flipkart'
  url: string
  size?: 'sm' | 'md'
}

const STORE_CONFIG = {
  amazon: {
    label: 'Amazon',
    bg: 'bg-[#FF9900] hover:bg-[#e68900]',
    text: 'text-black',
  },
  flipkart: {
    label: 'Flipkart',
    bg: 'bg-[#2874F0] hover:bg-[#1a5fcc]',
    text: 'text-white',
  },
}

export function AffiliateButton({
  productId,
  productName,
  store,
  url,
  size = 'md',
}: AffiliateButtonProps) {
  const config = STORE_CONFIG[store]

  const redirectUrl = `/api/redirect?product=${encodeURIComponent(productId)}&store=${store}&url=${encodeURIComponent(url)}`

  return (
    <a
      href={redirectUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-product={productName}
      className={`
        inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors
        ${config.bg} ${config.text}
        ${size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}
      `}
    >
      <ShoppingCart className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      Buy on {config.label}
      <ExternalLink className={size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} />
    </a>
  )
}
