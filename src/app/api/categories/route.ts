import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser, slugify } from '@/lib/auth'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
        _count: {
          select: { businesses: { where: { status: 'approved' } } },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ success: true, categories })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
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
    const { name, icon, description, parentId } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }

    const slug = slugify(name)

    // Check for duplicate slug
    const existing = await db.category.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A category with this name already exists' },
        { status: 409 }
      )
    }

    // Validate parent if provided
    if (parentId) {
      const parent = await db.category.findUnique({ where: { id: parentId } })
      if (!parent) {
        return NextResponse.json(
          { success: false, error: 'Parent category not found' },
          { status: 400 }
        )
      }
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        icon: icon || null,
        description: description || null,
        parentId: parentId || null,
      },
    })

    return NextResponse.json({ success: true, category }, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
