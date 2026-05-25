import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history } = body

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const systemPrompt = `You are Spectra Assistant, a helpful AI for the Spectra Holdings Group community platform. You help residents connect with local businesses and services in their community. You can:

1. Help users find businesses and services in their area
2. Provide information about community events and news
3. Guide users on how to use the platform (register, search, save businesses, etc.)
4. Answer questions about local services like plumbing, electrical work, healthcare, restaurants, etc.
5. Be friendly, concise, and helpful

The platform connects residents with local businesses across multiple states including TX, FL, CA, NY, and GA. Categories include Plumbing, Electrical, HVAC, Landscaping, Healthcare, Restaurants, Auto Repair, Cleaning, Legal, Education, Fitness, Beauty & Spa, Pet Services, Home Security, and Moving Services.

Keep your responses concise and practical. If someone asks about specific businesses, suggest they use the search feature on the platform. If they need to contact a business, guide them to the business listing for contact details.`

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ]

    // Add conversation history
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role && msg.content) {
          messages.push({ role: msg.role as 'user' | 'assistant', content: msg.content })
        }
      }
    }

    // Add current message
    messages.push({ role: 'user', content: message })

    const response = await zai.chat.completions.create({
      messages,
    })

    // Extract the reply from the response
    let reply = ''
    if (response?.choices?.[0]?.message?.content) {
      reply = response.choices[0].message.content
    } else if (typeof response === 'string') {
      reply = response
    } else if (response?.content) {
      reply = response.content
    } else {
      reply = "I'm sorry, I couldn't process your request. Please try again."
    }

    return NextResponse.json({ success: true, reply })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}
