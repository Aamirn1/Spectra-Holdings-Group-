import { NextRequest, NextResponse } from 'next/server'
import { newsDb } from '@/lib/supabase-db'
import { getAuthUser, slugify } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: Record<string, unknown> = { isPublished: true }

    if (category) {
      where.category = category
    }

    const skip = (page - 1) * limit
    const [news, total] = await Promise.all([
      newsDb.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      newsDb.count(where),
    ])

    return NextResponse.json({
      success: true,
      news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get news error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request)
    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, excerpt, content, imageUrl, category, isPublished } = body

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const slug = slugify(title)

    // Check for duplicate slug
    const existing = await newsDb.findUnique({ slug })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A news article with this title already exists' },
        { status: 409 }
      )
    }

    const news = await newsDb.create({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      imageUrl: imageUrl || null,
      category: category || null,
      isPublished: isPublished !== undefined ? isPublished : true,
      authorId: authUser.userId,
    })

    return NextResponse.json({ success: true, news }, { status: 201 })
  } catch (error) {
    console.error('Create news error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create news' },
      { status: 500 }
    )
  }
}
