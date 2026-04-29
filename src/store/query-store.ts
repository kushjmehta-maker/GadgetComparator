import { create } from 'zustand'
import type { QueryResult, StreamEvent, StatusEvent } from '@/types/query'

interface QueryState {
  // Input state
  input: string
  mode: 'compare' | 'discover'

  // Loading state
  isLoading: boolean
  currentStep: StatusEvent['step'] | null
  statusMessage: string

  // Results
  result: QueryResult | null
  error: string | null

  // Actions
  setInput: (input: string) => void
  setMode: (mode: 'compare' | 'discover') => void
  setLoading: (loading: boolean) => void
  setStatus: (step: StatusEvent['step'], message: string) => void
  setResult: (result: QueryResult) => void
  setError: (error: string) => void
  reset: () => void
  handleStreamEvent: (event: StreamEvent) => void
}

export const useQueryStore = create<QueryState>((set) => ({
  input: '',
  mode: 'discover',
  isLoading: false,
  currentStep: null,
  statusMessage: '',
  result: null,
  error: null,

  setInput: (input) => set({ input }),
  setMode: (mode) => set({ mode }),
  setLoading: (isLoading) => set({ isLoading }),
  setStatus: (currentStep, statusMessage) => set({ currentStep, statusMessage }),
  setResult: (result) => set({ result, isLoading: false, error: null }),
  setError: (error) => set({ error, isLoading: false }),

  reset: () =>
    set({
      isLoading: false,
      currentStep: null,
      statusMessage: '',
      result: null,
      error: null,
    }),

  handleStreamEvent: (event: StreamEvent) => {
    switch (event.type) {
      case 'status': {
        const data = event.data as unknown as StatusEvent
        set({ currentStep: data.step, statusMessage: data.message })
        break
      }
      case 'done': {
        set({
          result: event.data as unknown as QueryResult,
          isLoading: false,
          currentStep: null,
          statusMessage: '',
        })
        break
      }
      case 'error': {
        const errData = event.data as { message: string }
        set({
          error: errData.message ?? 'Something went wrong.',
          isLoading: false,
          currentStep: null,
        })
        break
      }
    }
  },
}))
