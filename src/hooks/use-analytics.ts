'use client'

import { useCallback } from 'react'
import type { AppEvent } from '@/types/events'

export function useAnalytics() {
  const track = useCallback((event: AppEvent) => {
    // Send to PostHog if available
    if (typeof window !== 'undefined' && (window as { posthog?: { capture: (name: string, props: object) => void } }).posthog) {
      const { event_type, ...rest } = event
      ;(window as unknown as { posthog: { capture: (name: string, props: object) => void } }).posthog.capture(event_type, rest)
    }

    // Also persist to our own DB via the API
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch(() => {
      // Fire-and-forget — don't block UI on analytics failures
    })
  }, [])

  return { track }
}
