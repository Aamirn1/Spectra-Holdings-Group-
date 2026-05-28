import { NextRequest, NextResponse } from 'next/server'
import { userDb, categoryDb, businessDb } from '@/lib/supabase-db'
import { hashPassword, generateToken, slugify } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role, phone, city, state, businessName, businessDescription, address, categorySlug } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (role && !['RESIDENT', 'BUSINESS', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Must be RESIDENT, BUSINESS, or ADMIN' },
        { status: 400 }
      )
    }

    // Check for duplicate email
    const existingUser = await userDb.findUnique({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const userRole = role || 'RESIDENT'

    const user = await userDb.create({
      name,
      email,
      passwordHash,
      role: userRole,
      phone: phone || null,
      city: city || null,
      state: state || null,
    })

    // If business role, create a Business entry
    if (userRole === 'BUSINESS') {
      if (!businessName || !businessDescription || !address || !categorySlug) {
        // Delete the user we just created since business data is incomplete
        await userDb.delete({ id: user.id })
        return NextResponse.json(
          { success: false, error: 'Business name, description, address, and category are required for business accounts' },
          { status: 400 }
        )
      }

      const category = await categoryDb.findUnique({ slug: categorySlug })
      if (!category) {
        await userDb.delete({ id: user.id })
        return NextResponse.json(
          { success: false, error: 'Invalid category' },
          { status: 400 }
        )
      }

      const businessSlug = slugify(businessName)
      await businessDb.create({
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
