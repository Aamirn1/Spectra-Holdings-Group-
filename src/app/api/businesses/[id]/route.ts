import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const business = await db.business.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
        },
      },
    })

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await db.business.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json({ success: true, business })
  } catch (error) {
    console.error('Get business error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch business' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await params

    const existingBusiness = await db.business.findUnique({ where: { id } })
    if (!existingBusiness) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Only owner or admin can update
    if (existingBusiness.userId !== authUser.userId && authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this business' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name, description, address, city, state, neighborhood,
      latitude, longitude, phone, whatsapp, website, email,
      categoryId, hours, logoUrl, coverUrl, images, services, licenseInfo,
      isApproved, isFeatured,
    } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (address !== undefined) updateData.address = address
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.state = state
    if (neighborhood !== undefined) updateData.neighborhood = neighborhood
    if (latitude !== undefined) updateData.latitude = latitude ? parseFloat(latitude) : null
    if (longitude !== undefined) updateData.longitude = longitude ? parseFloat(longitude) : null
    if (phone !== undefined) updateData.phone = phone
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp
    if (website !== undefined) updateData.website = website
    if (email !== undefined) updateData.email = email
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (hours !== undefined) updateData.hours = hours
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl
    if (images !== undefined) updateData.images = images
    if (services !== undefined) updateData.services = services
    if (licenseInfo !== undefined) updateData.licenseInfo = licenseInfo

    // Only admin can change approval/featured status
    if (authUser.role === 'admin') {
      if (isApproved !== undefined) updateData.isApproved = isApproved
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    }

    const business = await db.business.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        user: {
          select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
        },
      },
    })

    return NextResponse.json({ success: true, business })
  } catch (error) {
    console.error('Update business error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update business' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await params

    const existingBusiness = await db.business.findUnique({ where: { id } })
    if (!existingBusiness) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Only owner or admin can delete
    if (existingBusiness.userId !== authUser.userId && authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this business' },
        { status: 403 }
      )
    }

    await db.business.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Business deleted' })
  } catch (error) {
    console.error('Delete business error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete business' },
      { status: 500 }
    )
  }
}
