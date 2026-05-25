import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser, slugify } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const upcoming = searchParams.get('upcoming')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: any = { isPublished: true }

    if (city) {
      where.city = { contains: city }
    }

    if (state) {
      where.state = state
    }

    if (upcoming === 'true') {
      where.date = { gte: new Date() }
    }

    const skip = (page - 1) * limit
    const [events, total] = await Promise.all([
      db.event.findMany({
        where,
        include: {
          business: {
            select: { id: true, name: true, slug: true, logoUrl: true },
          },
          _count: {
            select: { registrations: true },
          },
        },
        orderBy: { date: 'asc' },
        skip,
        take: limit,
      }),
      db.event.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get events error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    if (authUser.role !== 'admin' && authUser.role !== 'business') {
      return NextResponse.json(
        { success: false, error: 'Only admin or business accounts can create events' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title, description, content, date, endDate, location, city, state,
      imageUrl, category, businessId,
    } = body

    if (!title || !description || !date) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and date are required' },
        { status: 400 }
      )
    }

    const slug = slugify(title)

    // Check for duplicate slug
    const existing = await db.event.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An event with this title already exists' },
        { status: 409 }
      )
    }

    // If business user, auto-assign their business
    let eventBusinessId = businessId || null
    if (authUser.role === 'business' && !businessId) {
      const userBusiness = await db.business.findFirst({
        where: { userId: authUser.userId },
      })
      eventBusinessId = userBusiness?.id || null
    }

    const event = await db.event.create({
      data: {
        title,
        slug,
        description,
        content: content || null,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        location: location || null,
        city: city || null,
        state: state || null,
        imageUrl: imageUrl || null,
        category: category || null,
        businessId: eventBusinessId,
      },
    })

    return NextResponse.json({ success: true, event }, { status: 201 })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
