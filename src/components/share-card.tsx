'use client'

import { useState } from 'react'
import { Share2, Check, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareCardProps {
  url?: string
  title?: string
}

export function ShareCard({ url, title }: ShareCardProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: title ?? 'AI Gadget Advisor', url: shareUrl })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 text-xs">
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            Copied!
          </>
        ) : (
          <>
            <Link className="h-3.5 w-3.5" />
            Copy Link
          </>
        )}
      </Button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <Button variant="outline" size="sm" onClick={handleNativeShare} className="gap-2 text-xs">
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      )}
    </div>
  )
}
