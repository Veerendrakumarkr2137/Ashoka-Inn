import { NextResponse } from 'next/server'
import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'

export const runtime = 'edge'

const SYSTEM_PROMPT = `You are the AI Concierge for Hotel Ashok Inn Davangere — a premier luxury hotel located beside KSRTC Bus Stand, PB Road, Davanagere, Karnataka (Phone: +91 80 1234 5678, Email: reservations@ashokinn.com).

Hotel Knowledge Base:
- Check-in: 12:00 PM | Check-out: 11:00 AM
- Location: Beside KSRTC Bus Stand, PB Road, Davanagere - 577004
- Room Collections & Pricing:
  1. Deluxe Non-AC Room (₹2,499/night, Max 2 guests)
  2. Superior AC Room (₹3,499/night, Max 2 guests)
  3. Executive Family AC Room (₹4,499/night, Max 4 guests) - Best for families / 4 members!
  4. King Suite Lounge (₹5,499/night, Max 3 guests) - Premium suite with lounge area
- Included Amenities: Free High-Speed Wi-Fi, Complimentary Breakfast, Valet Parking, 24x7 Front Desk Assistance.
- Dining & Venues:
  - D-Lounge: Premium cocktails & lounge ambiance
  - The Hikkups BBQ & Bar: Open-air sizzlers & drinks
  - Mercelys Ice Creams: Natural dairy desserts
  - Executive Meeting & Conference Halls with 360° virtual tours.

Instructions:
- Be warm, hospitable, and professional.
- For 4 members / family queries, always recommend the Executive Family AC Room (₹4,499/night) or booking 2 connecting rooms.
- Keep responses clear, helpful, and concise.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content || ''

    const apiKey = process.env.OPENAI_API_KEY
    if (apiKey && apiKey.startsWith('sk-') && !apiKey.includes('your_openai_api_key_here')) {
      const openai = createOpenAI({ apiKey })
      const result = await streamText({
        model: openai('gpt-4o-mini'),
        system: SYSTEM_PROMPT,
        messages
      })
      return result.toDataStreamResponse()
    }

    // Smart Hospitality Fallback Engine (when OPENAI_API_KEY is not yet configured)
    const lowerMsg = lastMessage.toLowerCase()
    let responseText = ''

    if (lowerMsg.includes('4 member') || lowerMsg.includes('4 members') || lowerMsg.includes('4 people') || lowerMsg.includes('family') || lowerMsg.includes('4 guest')) {
      responseText = "For 4 members, our Executive Family AC Room (₹4,499 / night) is the perfect choice! It comfortably accommodates up to 4 guests with spacious bedding, climate control, complimentary breakfast, free Wi-Fi, and 24x7 room service. Would you like to reserve it now?"
    } else if (lowerMsg.includes('room') || lowerMsg.includes('stay') || lowerMsg.includes('price') || lowerMsg.includes('tariff')) {
      responseText = "We offer 4 luxury room options at Hotel Ashok Inn Davangere:\n• Deluxe Non-AC (₹2,499/night, Max 2 guests)\n• Superior AC (₹3,499/night, Max 2 guests)\n• Executive Family AC (₹4,499/night, Max 4 guests)\n• King Suite Lounge (₹5,499/night, Max 3 guests)\nAll rooms include complimentary breakfast and free Wi-Fi!"
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      responseText = "Hello! I am your AI Concierge at Hotel Ashok Inn Davangere. How can I make your stay comfortable today? Feel free to ask about our rooms, dining, or facilities!"
    } else if (lowerMsg.includes('check-in') || lowerMsg.includes('check in') || lowerMsg.includes('check-out') || lowerMsg.includes('timing')) {
      responseText = "Our standard check-in time is 12:00 PM and check-out is 11:00 AM. Early check-in or late check-out is subject to availability. Please let us know your arrival time!"
    } else if (lowerMsg.includes('restaurant') || lowerMsg.includes('food') || lowerMsg.includes('dining') || lowerMsg.includes('hikkups') || lowerMsg.includes('lounge')) {
      responseText = "We feature three dining experiences: 'D-Lounge' for cocktails, 'The Hikkups BBQ & Bar' for sizzlers & drinks, and 'Mercelys' for artisanal ice creams. In-room dining is also available 24x7!"
    } else if (lowerMsg.includes('location') || lowerMsg.includes('address') || lowerMsg.includes('where')) {
      responseText = "Hotel Ashok Inn is located beside KSRTC Bus Stand, PB Road, Davanagere, Karnataka - 577004. Call reception anytime at +91 80 1234 5678."
    } else {
      responseText = `Thank you for asking about "${lastMessage}". At Hotel Ashok Inn Davangere, we provide luxury rooms starting from ₹2,499/night, fine dining, banquet halls, and 24x7 service. For immediate reservations, call our front desk at +91 80 1234 5678!`
    }

    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        const words = responseText.split(' ')
        for (let i = 0; i < words.length; i++) {
          controller.enqueue(encoder.encode(`0:"${words[i]} "` + '\n'))
          await new Promise(resolve => setTimeout(resolve, 25))
        }
        controller.close()
      }
    })

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
