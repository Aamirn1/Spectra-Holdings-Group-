import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request)

    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    // Use admin client to bypass RLS for user lookup
    const { data: user, error } = await supabaseAdmin
      .from('User')
      .select('id, email, name, role, phone, address, city, state, neighborhood, latitude, longitude, avatarUrl, bio, communityId, isVerified, isActive, lastLoginAt, createdAt, updatedAt')
      .eq('id', authUser.userId)
      .maybeSingle()

    if (error) {
      console.error('Auth me error:', error)
      return NextResponse.json({ success: false, error: 'Failed to get user' }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get user' },
      { status: 500 }
    )
  }
}
