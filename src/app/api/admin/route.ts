import { NextRequest, NextResponse } from 'next/server'
import { supabase, userDb, businessDb, eventDb, newsDb, categoryDb, contactMessageDb, stateDb, cityDb, communityDb } from '@/lib/supabase-db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request)
    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const [
      totalUsers,
      totalBusinesses,
      pendingApprovals,
      approvedBusinesses,
      rejectedBusinesses,
      totalEvents,
      totalNews,
      recentSignups,
      totalCategories,
      totalContactMessages,
      unreadMessages,
      totalStates,
      totalCities,
      totalCommunities,
    ] = await Promise.all([
      userDb.count(),
      businessDb.count(),
      businessDb.count({ status: 'pending' }),
      businessDb.count({ status: 'approved' }),
      businessDb.count({ status: 'rejected' }),
      eventDb.count({ isPublished: true }),
      newsDb.count({ isPublished: true }),
      userDb.findMany({ take: 5, orderBy: 'createdAt' }),
      categoryDb.count(),
      contactMessageDb.count(),
      contactMessageDb.count({ isRead: false }),
      stateDb.count(),
      cityDb.count(),
      communityDb.count(),
    ])

    // Business by state - use raw supabase since groupBy isn't supported in helpers
    const { data: businessByStateData } = await supabase
      .from('Business')
      .select('state')
      .eq('status', 'approved')

    const stateCountMap: Record<string, number> = {}
    for (const b of (businessByStateData || [])) {
      if (b.state) {
        stateCountMap[b.state] = (stateCountMap[b.state] || 0) + 1
      }
    }
    const businessByState = Object.entries(stateCountMap).map(([state, count]) => ({ state, count }))

    // Businesses by category - use raw supabase
    const { data: businessByCategoryData } = await supabase
      .from('Business')
      .select('categoryId')
      .eq('status', 'approved')

    const categoryCountMap: Record<string, number> = {}
    for (const b of (businessByCategoryData || [])) {
      if (b.categoryId) {
        categoryCountMap[b.categoryId] = (categoryCountMap[b.categoryId] || 0) + 1
      }
    }

    // Get category names
    const categoryIds = Object.keys(categoryCountMap)
    const { data: categories } = await supabase
      .from('Category')
      .select('id, name')
      .in('id', categoryIds)

    const categoryMap = new Map((categories || []).map((c: Record<string, unknown>) => [c.id, c.name]))
    const businessesByCategory = Object.entries(categoryCountMap).map(([catId, count]) => ({
      category: categoryMap.get(catId) || 'Unknown',
      count,
    }))

    // Get pending businesses for admin review
    const pendingBusinesses = await businessDb.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalBusinesses,
        pendingApprovals,
        approvedBusinesses,
        rejectedBusinesses,
        totalEvents,
        totalNews,
        totalCategories,
        totalContactMessages,
        unreadMessages,
        totalStates,
        totalCities,
        totalCommunities,
        recentSignups,
        businessByState,
        businessesByCategory,
        pendingBusinesses,
      },
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
