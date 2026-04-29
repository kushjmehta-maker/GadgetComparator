import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('queries')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}
