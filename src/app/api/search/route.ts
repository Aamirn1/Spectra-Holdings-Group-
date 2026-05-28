import { NextRequest, NextResponse } from 'next/server'
import { supabase, categoryDb } from '@/lib/supabase-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    if (!q) {
      return NextResponse.json(
        { success: false, error: 'Search query (q) is required' },
        { status: 400 }
      )
    }

    // Use raw supabase client for complex OR queries
    let query = supabase
      .from('Business')
      .select('*, category:Category(*), user:User(id, name, avatarUrl)', { count: 'exact' })
      .eq('status', 'approved')
      .or(`name.ilike.%${q}%,description.ilike.%${q}%,services.ilike.%${q}%,neighborhood.ilike.%${q}%`)

    // Apply category filter
    if (category) {
      const cat = await categoryDb.findUnique({ slug: category })
      if (cat) {
        query = query.eq('categoryId', cat.id)
      }
    }

    if (city) {
      query = query.ilike('city', `%${city}%`)
    }

    if (state) {
      query = query.eq('state', state)
    }

    // Ordering: featured first, then by viewCount
    query = query.order('isFeatured', { ascending: false })
    query = query.order('viewCount', { ascending: false })

    // Pagination
    const skip = (page - 1) * limit
    query = query.range(skip, skip + limit - 1)

    const { data: businesses, count } = await query
    const total = count || 0

    return NextResponse.json({
      success: true,
      query: q,
      businesses: businesses || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search businesses' },
      { status: 500 }
    )
  }
}
