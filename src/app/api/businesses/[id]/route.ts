import { NextRequest, NextResponse } from 'next/server'
import { businessDb } from '@/lib/supabase-db'
import { getAuthUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const business = await businessDb.findUnique({ id })

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Increment view count - fetch current value first, then update
    const currentViewCount = (business as Record<string, unknown>).viewCount as number || 0
    await businessDb.update({ id }, { viewCount: currentViewCount + 1 })

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

    const existingBusiness = await businessDb.findUnique({ id })
    if (!existingBusiness) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Only owner or admin can update
    if ((existingBusiness as Record<string, unknown>).userId !== authUser.userId && authUser.role !== 'ADMIN') {
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
      status, isFeatured, communityId, socialLinks, serviceArea,
      seoTitle, seoDescription,
    } = body

    const updateData: Record<string, unknown> = {}
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
    if (communityId !== undefined) updateData.communityId = communityId
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks
    if (serviceArea !== undefined) updateData.serviceArea = serviceArea
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription

    // Only admin can change status/featured
    if (authUser.role === 'ADMIN') {
      if (status !== undefined) updateData.status = status
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    }

    const business = await businessDb.update({ id }, updateData)

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

    const existingBusiness = await businessDb.findUnique({ id })
    if (!existingBusiness) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    // Only owner or admin can delete
    if ((existingBusiness as Record<string, unknown>).userId !== authUser.userId && authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this business' },
        { status: 403 }
      )
    }

    await businessDb.delete({ id })

    return NextResponse.json({ success: true, message: 'Business deleted' })
  } catch (error) {
    console.error('Delete business error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete business' },
      { status: 500 }
    )
  }
}
