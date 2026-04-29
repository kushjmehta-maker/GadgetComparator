const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN

async function kvFetch(path: string, options?: RequestInit) {
  if (!KV_URL || !KV_TOKEN) return null
  try {
    const res = await fetch(`${KV_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const result = await kvFetch(`/get/${encodeURIComponent(key)}`)
  if (!result?.result) return null
  try {
    return JSON.parse(result.result) as T
  } catch {
    return null
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number,
): Promise<void> {
  await kvFetch(`/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    body: JSON.stringify({
      value: JSON.stringify(value),
      ex: ttlSeconds,
    }),
  })
}

export async function cacheDel(key: string): Promise<void> {
  await kvFetch(`/del/${encodeURIComponent(key)}`, { method: 'POST' })
}

export function buildCacheKey(...parts: string[]): string {
  return parts.join(':')
}
