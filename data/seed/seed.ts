import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'

// Load env variables
config({ path: join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

interface SeedSpec {
  value: string
  numeric: number | null
  confidence: number
  verified: boolean
}

interface SeedProduct {
  name: string
  brand: string
  model_number?: string
  slug: string
  price_current: number
  price_original?: number
  description?: string
  amazon_url?: string
  flipkart_url?: string
  image_url?: string
  specs: Record<string, SeedSpec>
}

const CATEGORY_DEFINITIONS = [
  {
    name: 'projector',
    display_name: 'Projectors',
    icon: '📽️',
    description: 'Home cinema and portable projectors ranked by actual ANSI lumens and verified specs',
    file: 'projectors.json',
  },
  {
    name: 'smartphone',
    display_name: 'Smartphones',
    icon: '📱',
    description: 'Android and iOS smartphones ranked for your specific use case',
    file: 'smartphones.json',
  },
]

async function seed() {
  console.log('🌱 Starting seed...')

  for (const categoryDef of CATEGORY_DEFINITIONS) {
    console.log(`\n📂 Seeding category: ${categoryDef.display_name}`)

    // Upsert category
    const { data: category, error: catError } = await supabase
      .from('categories')
      .upsert(
        {
          name: categoryDef.name,
          display_name: categoryDef.display_name,
          icon: categoryDef.icon,
          description: categoryDef.description,
          normalization_config: {},
          is_active: true,
        },
        { onConflict: 'name' },
      )
      .select()
      .single()

    if (catError) {
      console.error(`  ❌ Category error:`, catError.message)
      continue
    }

    console.log(`  ✅ Category upserted: ${category.id}`)

    // Load products
    const filePath = join(process.cwd(), 'data', 'seed', categoryDef.file)
    let products: SeedProduct[] = []
    try {
      products = JSON.parse(readFileSync(filePath, 'utf-8'))
    } catch {
      console.error(`  ❌ Could not read ${categoryDef.file}`)
      continue
    }

    let successCount = 0
    for (const product of products) {
      // Upsert product
      const { data: dbProduct, error: productError } = await supabase
        .from('products')
        .upsert(
          {
            category_id: category.id,
            name: product.name,
            brand: product.brand,
            model_number: product.model_number,
            slug: product.slug,
            price_current: product.price_current,
            price_original: product.price_original ?? product.price_current,
            currency: 'INR',
            amazon_url: product.amazon_url,
            flipkart_url: product.flipkart_url,
            image_url: product.image_url,
            description: product.description,
            is_active: true,
            data_quality_score: 0.7,
          },
          { onConflict: 'slug' },
        )
        .select()
        .single()

      if (productError) {
        console.error(`  ❌ Product ${product.name}: ${productError.message}`)
        continue
      }

      // Upsert specs
      const specsToInsert = Object.entries(product.specs).map(([key, spec]) => ({
        product_id: dbProduct.id,
        spec_key: key,
        spec_value: spec.value,
        spec_value_numeric: spec.numeric,
        confidence: spec.confidence,
        source: 'manual',
        verified: spec.verified,
      }))

      if (specsToInsert.length > 0) {
        const { error: specsError } = await supabase
          .from('product_specs')
          .upsert(specsToInsert, { onConflict: 'product_id,spec_key' })

        if (specsError) {
          console.error(`  ⚠️  Specs for ${product.name}: ${specsError.message}`)
        }
      }

      // Record initial price
      await supabase.from('price_history').insert({
        product_id: dbProduct.id,
        price: product.price_current,
        source: 'seed',
      })

      successCount++
      console.log(`  ✅ ${product.name}`)
    }

    // Update product count
    await supabase
      .from('categories')
      .update({ product_count: successCount })
      .eq('id', category.id)

    console.log(`  📊 ${successCount}/${products.length} products seeded`)
  }

  console.log('\n✨ Seed complete!')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
