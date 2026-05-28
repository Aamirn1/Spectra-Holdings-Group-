import { NextRequest, NextResponse } from 'next/server'
import { contactMessageDb } from '@/lib/supabase-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    await contactMessageDb.create({
      name,
      email,
      phone: phone || null,
      subject,
      message,
    })

    return NextResponse.json({ success: true, message: 'Message sent successfully' }, { status: 201 })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
