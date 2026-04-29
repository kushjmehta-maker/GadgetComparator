import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { query_id, rating, feedback_type, comment } = body

    const supabase = await createServiceClient()
    const { error } = await supabase.from('feedback').insert({
      query_id: query_id ?? null,
      rating: rating ?? null,
      feedback_type: feedback_type ?? null,
      comment: comment ?? null,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data: { ok: true } })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
