'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryStore } from '@/store/query-store'
import type { StreamEvent } from '@/types/query'

export function useQuery() {
  const router = useRouter()
  const store = useQueryStore()

  const submitQuery = useCallback(
    async (input: string, mode: 'compare' | 'discover') => {
      store.setInput(input)
      store.setMode(mode)
      store.setLoading(true)
      store.reset()
      store.setLoading(true)

      try {
        const response = await fetch('/api/query/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input, mode }),
        })

        if (!response.ok) {
          store.setError('Failed to connect to the server.')
          return
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          store.setError('No response stream.')
          return
        }

        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event = JSON.parse(line.slice(6)) as StreamEvent
                store.handleStreamEvent(event)

                if (event.type === 'done') {
                  const data = event.data as { slug?: string; query_id?: string }
                  if (data.slug) {
                    router.push(`/${mode === 'compare' ? 'compare' : 'discover'}/${data.slug}`)
                  }
                }
              } catch {
                // Ignore parse errors for partial lines
              }
            }
          }
        }
      } catch (err) {
        store.setError(
          err instanceof Error ? err.message : 'An unexpected error occurred.',
        )
      }
    },
    [store, router],
  )

  return {
    ...store,
    submitQuery,
  }
}
