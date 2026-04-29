import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('q')

  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*, specs:product_specs(*), category:categories(*)')
    .eq('is_active', true)

  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .or(`name.eq.${category},slug.eq.${category}`)
      .single()
    if (cat?.id) query = query.eq('category_id', cat.id)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error } = await query
    .order('data_quality_score', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
