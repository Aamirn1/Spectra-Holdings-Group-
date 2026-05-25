import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    const where: any = {
      isApproved: true,
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { services: { contains: q } },
        { neighborhood: { contains: q } },
      ],
    }

    if (category) {
      const cat = await db.category.findUnique({ where: { slug: category } })
      if (cat) {
        where.categoryId = cat.id
      }
    }

    if (city) {
      where.city = { contains: city }
    }

    if (state) {
      where.state = state
    }

    const skip = (page - 1) * limit
    const [businesses, total] = await Promise.all([
      db.business.findMany({
        where,
        include: {
          category: true,
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { viewCount: 'desc' },
        ],
        skip,
        take: limit,
      }),
      db.business.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      query: q,
      businesses,
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
