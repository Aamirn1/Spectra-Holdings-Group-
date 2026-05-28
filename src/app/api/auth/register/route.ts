import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, userDb, categoryDb, businessDb } from '@/lib/supabase-db'
import { hashPassword, generateToken, slugify } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      console.error('Registration error: Missing Supabase environment variables')
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, email, password, role, phone, city, state, businessName, businessDescription, address, categorySlug } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (role && !['RESIDENT', 'BUSINESS', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Must be RESIDENT, BUSINESS, or ADMIN' },
        { status: 400 }
      )
    }

    // Check for duplicate email using admin client (bypasses RLS)
    const { data: existingUser, error: findError } = await supabaseAdmin
      .from('User')
      .select('id, email')
      .eq('email', email)
      .maybeSingle()

    if (findError) {
      console.error('Registration error checking existing user:', findError)
      return NextResponse.json(
        { success: false, error: 'Unable to verify email. Please try again.' },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const userRole = role || 'RESIDENT'

    // Create user using admin client (bypasses RLS for reliable registration)
    const { data: user, error: createError } = await supabaseAdmin
      .from('User')
      .insert({
        name,
        email,
        passwordHash,
        role: userRole,
        phone: phone || null,
        city: city || null,
        state: state || null,
      })
      .select()
      .maybeSingle()

    if (createError) {
      console.error('Registration error creating user:', createError)
      
      // Provide user-friendly error messages based on the Supabase error
      if (createError.code === '42501') {
        return NextResponse.json(
          { success: false, error: 'Database permission error. Please ensure Supabase RLS policies are configured correctly.' },
          { status: 500 }
        )
      }
      if (createError.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists' },
          { status: 409 }
        )
      }
      if (createError.message?.includes('relation') || createError.message?.includes('does not exist')) {
        return NextResponse.json(
          { success: false, error: 'Database tables not found. Please run the Supabase migration SQL first.' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to create account. Please try again later.' },
        { status: 500 }
      )
    }

    if (!user) {
      console.error('Registration error: User creation returned no data')
      return NextResponse.json(
        { success: false, error: 'Failed to create account. Please try again.' },
        { status: 500 }
      )
    }

    // If business role, create a Business entry
    if (userRole === 'BUSINESS') {
      if (!businessName || !businessDescription || !address || !categorySlug) {
        // Delete the user we just created since business data is incomplete
        await supabaseAdmin.from('User').delete().eq('id', user.id)
        return NextResponse.json(
          { success: false, error: 'Business name, description, address, and category are required for business accounts' },
          { status: 400 }
        )
      }

      const { data: category } = await supabaseAdmin
        .from('Category')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle()

      if (!category) {
        await supabaseAdmin.from('User').delete().eq('id', user.id)
        return NextResponse.json(
          { success: false, error: 'Invalid category' },
          { status: 400 }
        )
      }

      const businessSlug = slugify(businessName)
      const { error: businessCreateError } = await supabaseAdmin
        .from('Business')
        .insert({
          userId: user.id,
          name: businessName,
          slug: businessSlug,
          description: businessDescription,
          address,
          city: city || 'Unknown',
          state: state || 'Unknown',
          phone: phone || '',
          categoryId: category.id,
          status: 'pending',
        })

      if (businessCreateError) {
        console.error('Registration error creating business:', businessCreateError)
        // Still return success for the user, but note business creation failed
      }
    }

    const token = generateToken(user.id, user.email, user.role)

    // Return user without passwordHash
    const { passwordHash: _, ...userWithoutPassword } = user as Record<string, unknown> & { passwordHash: unknown }

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
    }, { status: 201 })
  } catch (error) {
    console.error('Registration unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
