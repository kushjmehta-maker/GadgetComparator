'use client'

import { useState, useEffect } from 'react'
import type { ProductWithSpecs } from '@/types/product'

export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<ProductWithSpecs[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!categorySlug) return

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    fetch(`/api/products?category=${categorySlug}`, { signal: controller.signal })
      .then((r) => r.json())
      .then(({ data, error: err }) => {
        if (err) throw new Error(err)
        setProducts(data ?? [])
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [categorySlug])

  return { products, isLoading, error }
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<ProductWithSpecs | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    setIsLoading(true)
    setError(null)

    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then(({ data, error: err }) => {
        if (err) throw new Error(err)
        setProduct(data ?? null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [slug])

  return { product, isLoading, error }
}
