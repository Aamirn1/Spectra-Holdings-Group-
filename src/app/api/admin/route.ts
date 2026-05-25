import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request)
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const [
      totalUsers,
      totalBusinesses,
      pendingApprovals,
      totalEvents,
      totalNews,
      recentSignups,
      totalCategories,
      totalContactMessages,
      unreadMessages,
    ] = await Promise.all([
      db.user.count(),
      db.business.count(),
      db.business.count({ where: { isApproved: false } }),
      db.event.count({ where: { isPublished: true } }),
      db.news.count({ where: { isPublished: true } }),
      db.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      db.category.count(),
      db.contactMessage.count(),
      db.contactMessage.count({ where: { isRead: false } }),
    ])

    const businessByState = await db.business.groupBy({
      by: ['state'],
      _count: { id: true },
      where: { isApproved: true },
    })

    const businessesByCategory = await db.business.groupBy({
      by: ['categoryId'],
      _count: { id: true },
      where: { isApproved: true },
    })

    // Get category names for the groupBy result
    const categoryIds = businessesByCategory.map(b => b.categoryId).filter(Boolean) as string[]
    const categories = await db.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    })

    const categoryMap = new Map(categories.map(c => [c.id, c.name]))
    const businessesByCategoryNamed = businessesByCategory.map(b => ({
      category: categoryMap.get(b.categoryId) || 'Unknown',
      count: b._count.id,
    }))

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalBusinesses,
        pendingApprovals,
        totalEvents,
        totalNews,
        totalCategories,
        totalContactMessages,
        unreadMessages,
        recentSignups,
        businessByState: businessByState.map(b => ({ state: b.state, count: b._count.id })),
        businessesByCategory: businessesByCategoryNamed,
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
