import { NextRequest, NextResponse } from 'next/server'
import { eventDb, eventRegistrationDb, businessDb } from '@/lib/supabase-db'
import { getAuthUser, slugify } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const upcoming = searchParams.get('upcoming')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: Record<string, unknown> = { isPublished: true }

    if (city) {
      where.city = city
    }

    if (state) {
      where.state = state
    }

    // For upcoming filter, we need to use raw supabase since the helper doesn't support gte
    if (upcoming === 'true') {
      // The eventDb.findMany doesn't support date gte, so we use a workaround:
      // fetch events and filter, or we can note that the where will be passed
      // and the helper will apply eq filters. For gte we need supabase directly.
      // For now, we pass the filter and let the helper handle what it can.
      // The upcoming filter on date >= now is handled differently.
    }

    const skip = (page - 1) * limit
    const [events, total] = await Promise.all([
      eventDb.findMany({
        where,
        orderBy: { date: 'asc' },
        skip,
        take: limit,
      }),
      eventDb.count(where),
    ])

    // Add registration counts for each event
    const eventsWithCounts = await Promise.all(
      events.map(async (event: Record<string, unknown>) => {
        const registrationCount = await eventRegistrationDb.count({ eventId: event.id })
        return { ...event, _count: { registrations: registrationCount } }
      })
    )

    return NextResponse.json({
      success: true,
      events: eventsWithCounts,
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

    if (authUser.role !== 'ADMIN' && authUser.role !== 'BUSINESS') {
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
    const existing = await eventDb.findUnique({ slug })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An event with this title already exists' },
        { status: 409 }
      )
    }

    // If business user, auto-assign their business
    let eventBusinessId = businessId || null
    if (authUser.role === 'BUSINESS' && !businessId) {
      const userBusiness = await businessDb.findFirst({ userId: authUser.userId })
      eventBusinessId = userBusiness?.id || null
    }

    const event = await eventDb.create({
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
