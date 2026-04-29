import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  const store = searchParams.get('store')
  const productId = searchParams.get('product')

  if (!url) {
    return NextResponse.json({ error: 'url required' }, { status: 400 })
  }

  // Log the click (fire and forget)
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    fetch(`${baseUrl}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'affiliate_clicked',
        event_data: { product_id: productId, store },
      }),
    }).catch(() => {})
  } catch {
    // Don't block the redirect
  }

  return NextResponse.redirect(decodeURIComponent(url))
}
