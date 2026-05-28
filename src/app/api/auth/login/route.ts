import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-db'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Use admin client to bypass RLS for user lookup
    const { data: user, error: findError } = await supabaseAdmin
      .from('User')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (findError) {
      console.error('Login error finding user:', findError)
      return NextResponse.json(
        { success: false, error: 'Unable to verify credentials. Please try again.' },
        { status: 500 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 403 }
      )
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update lastLoginAt using admin client
    await supabaseAdmin
      .from('User')
      .update({ lastLoginAt: new Date().toISOString() })
      .eq('id', user.id)

    const token = generateToken(user.id, user.email, user.role)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        city: user.city,
        state: user.state,
        avatarUrl: user.avatarUrl,
        communityId: user.communityId,
        isVerified: user.isVerified,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to login. Please try again.' },
      { status: 500 }
    )
  }
}
