import { NextRequest, NextResponse } from 'next/server'
import { businessDb, categoryDb } from '@/lib/supabase-db'
import { getAuthUser, slugify } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const featured = searchParams.get('featured')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: Record<string, unknown> = {}

    // By default, only show approved businesses
    // Admin can see pending by passing status=pending or status=all
    if (status === 'pending') {
      const authUser = getAuthUser(request)
      if (authUser?.role !== 'ADMIN') {
        where.status = 'approved'
      } else {
        where.status = 'pending'
      }
    } else if (status === 'all') {
      const authUser = getAuthUser(request)
      if (authUser?.role !== 'ADMIN') {
        where.status = 'approved'
      }
      // admin sees all
    } else {
      where.status = 'approved'
    }

    if (category) {
      const cat = await categoryDb.findUnique({ slug: category })
      if (cat) {
        where.categoryId = cat.id
      }
    }

    if (city) {
      where.city = city
    }

    if (state) {
      where.state = state
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const skip = (page - 1) * limit
    const [businesses, total] = await Promise.all([
      businessDb.findMany({
        where,
        orderBy: { isFeatured: 'desc', createdAt: 'desc' },
        skip,
        take: limit,
      }),
      businessDb.count(where),
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

    if (authUser.role !== 'BUSINESS' && authUser.role !== 'ADMIN') {
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
      communityId, socialLinks, serviceArea, seoTitle, seoDescription,
    } = body

    if (!name || !description || !address || !city || !state || !phone || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Name, description, address, city, state, phone, and category are required' },
        { status: 400 }
      )
    }

    const slug = slugify(name)

    // Check if slug already exists
    const existingBusiness = await businessDb.findUnique({ slug })
    if (existingBusiness) {
      return NextResponse.json(
        { success: false, error: 'A business with this name already exists' },
        { status: 409 }
      )
    }

    const business = await businessDb.create({
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
      communityId: communityId || null,
      socialLinks: socialLinks || null,
      serviceArea: serviceArea || null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      status: authUser.role === 'ADMIN' ? 'approved' : 'pending', // Admin-created businesses are auto-approved
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
