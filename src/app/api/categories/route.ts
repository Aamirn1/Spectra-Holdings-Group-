import { NextRequest, NextResponse } from 'next/server'
import { supabase, categoryDb } from '@/lib/supabase-db'
import { getAuthUser, slugify } from '@/lib/auth'

export async function GET() {
  try {
    // Fetch parent categories (parentId = null)
    const { data: categories } = await supabase
      .from('Category')
      .select('*')
      .is('parentId', null)
      .order('name')

    if (!categories) {
      return NextResponse.json({ success: true, categories: [] })
    }

    // Fetch children for all parent categories
    const parentIds = categories.map((c: Record<string, unknown>) => c.id)
    const { data: children } = await supabase
      .from('Category')
      .select('*')
      .in('parentId', parentIds)

    // Fetch approved business counts per category
    const { data: businessCounts } = await supabase
      .from('Business')
      .select('categoryId')
      .eq('status', 'approved')

    // Build count map
    const countMap: Record<string, number> = {}
    for (const b of (businessCounts || [])) {
      const cid = b.categoryId
      if (cid) {
        countMap[cid] = (countMap[cid] || 0) + 1
      }
    }

    // Build children map
    const childrenMap: Record<string, unknown[]> = {}
    for (const child of (children || [])) {
      const pid = child.parentId
      if (pid) {
        if (!childrenMap[pid]) childrenMap[pid] = []
        childrenMap[pid].push(child)
      }
    }

    // Compose final result
    const result = categories.map((cat: Record<string, unknown>) => ({
      ...cat,
      children: childrenMap[cat.id as string] || [],
      _count: {
        businesses: countMap[cat.id as string] || 0,
      },
    }))

    return NextResponse.json({ success: true, categories: result })
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
    const existing = await categoryDb.findUnique({ slug })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A category with this name already exists' },
        { status: 409 }
      )
    }

    // Validate parent if provided
    if (parentId) {
      const parent = await categoryDb.findUnique({ id: parentId })
      if (!parent) {
        return NextResponse.json(
          { success: false, error: 'Parent category not found' },
          { status: 400 }
        )
      }
    }

    const category = await categoryDb.create({
      name,
      slug,
      icon: icon || null,
      description: description || null,
      parentId: parentId || null,
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
