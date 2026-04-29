import { NextResponse } from 'next/server'
import { APP_NAME } from '@/lib/constants'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? APP_NAME
  const description = searchParams.get('desc') ?? ''

  // Return a simple SVG-based OG image
  const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="60" y="60" width="1080" height="510" rx="24" fill="white" fill-opacity="0.08"/>
  <text x="100" y="200" font-family="system-ui, sans-serif" font-size="72" font-weight="800" fill="white" dominant-baseline="middle">${escapeXml(title.slice(0, 40))}</text>
  ${title.length > 40 ? `<text x="100" y="290" font-family="system-ui, sans-serif" font-size="72" font-weight="800" fill="white" dominant-baseline="middle">${escapeXml(title.slice(40, 80))}</text>` : ''}
  <text x="100" y="400" font-family="system-ui, sans-serif" font-size="36" fill="white" fill-opacity="0.8">${escapeXml(description.slice(0, 80))}</text>
  <text x="100" y="530" font-family="system-ui, sans-serif" font-size="28" fill="white" fill-opacity="0.6">${APP_NAME} — AI-powered product recommendations</text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
