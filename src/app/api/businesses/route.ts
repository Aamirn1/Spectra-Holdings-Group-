import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser, slugify } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const featured = searchParams.get('featured')
    const approved = searchParams.get('approved')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: any = {}

    // By default, only show approved businesses
    // Admin can see unapproved by passing approved=false
    if (approved === 'false') {
      const authUser = getAuthUser(request)
      if (authUser?.role !== 'admin') {
        where.isApproved = true
      } else {
        where.isApproved = false
      }
    } else if (approved === 'all') {
      const authUser = getAuthUser(request)
      if (authUser?.role !== 'admin') {
        where.isApproved = true
      }
      // admin sees all
    } else {
      where.isApproved = true
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

    if (featured === 'true') {
      where.isFeatured = true
    }

    const skip = (page - 1) * limit
    const [businesses, total] = await Promise.all([
      db.business.findMany({
        where,
        include: {
          category: true,
          user: {
            select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
          },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      db.business.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      businesses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get businesses error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch businesses' },
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

    if (authUser.role !== 'business' && authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Only business or admin accounts can create businesses' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name, description, address, city, state, neighborhood,
      latitude, longitude, phone, whatsapp, website, email,
      categoryId, hours, logoUrl, coverUrl, images, services, licenseInfo,
    } = body

    if (!name || !description || !address || !city || !state || !phone || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Name, description, address, city, state, phone, and category are required' },
        { status: 400 }
      )
    }

    const slug = slugify(name)

    // Check if slug already exists
    const existingBusiness = await db.business.findUnique({ where: { slug } })
    if (existingBusiness) {
      return NextResponse.json(
        { success: false, error: 'A business with this name already exists' },
        { status: 409 }
      )
    }

    const business = await db.business.create({
      data: {
        userId: authUser.userId,
        name,
        slug,
        description,
        address,
        city,
        state,
        neighborhood: neighborhood || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        phone,
        whatsapp: whatsapp || null,
        website: website || null,
        email: email || null,
        categoryId,
        hours: hours || null,
        logoUrl: logoUrl || null,
        coverUrl: coverUrl || null,
        images: images || null,
        services: services || null,
        licenseInfo: licenseInfo || null,
        isApproved: authUser.role === 'admin', // Admin-created businesses are auto-approved
      },
      include: {
        category: true,
        user: {
          select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
        },
      },
    })

    return NextResponse.json({ success: true, business }, { status: 201 })
  } catch (error) {
    console.error('Create business error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create business' },
      { status: 500 }
    )
  }
}
