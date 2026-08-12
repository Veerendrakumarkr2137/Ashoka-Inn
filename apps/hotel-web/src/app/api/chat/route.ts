import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Simulated AI response for demonstration without API keys
export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content || ''
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        let simulatedResponse = ''
        
        const lowerMsg = lastMessage.toLowerCase()
        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
          simulatedResponse = "Hello! I'm your digital concierge. How can I make your stay at Hotel Ashokha more comfortable?"
        } else if (lowerMsg.includes('time') && (lowerMsg.includes('check-in') || lowerMsg.includes('check in'))) {
          simulatedResponse = "Our standard check-in time is 3:00 PM, and check-out is at 11:00 AM. If you need an early check-in or late check-out, please let me know and I'll check availability for you!"
        } else if (lowerMsg.includes('gym') || lowerMsg.includes('pool') || lowerMsg.includes('amenities')) {
          simulatedResponse = "Hotel Ashokha features a state-of-the-art fitness center open 24/7 on the 4th floor, and a rooftop infinity pool open from 6:00 AM to 10:00 PM. We also have a luxury spa offering Ayurvedic treatments."
        } else if (lowerMsg.includes('restaurant') || lowerMsg.includes('food') || lowerMsg.includes('menu')) {
          simulatedResponse = "We have two world-class restaurants: 'The Golden Lotus' serving pan-Asian cuisine, and 'The Heritage' offering authentic Indian fine dining. Would you like me to make a dinner reservation for you?"
        } else if (lowerMsg.includes('room service') || lowerMsg.includes('towel')) {
          simulatedResponse = "I can certainly help with that. I've sent a request to our housekeeping team to bring fresh items to your room immediately. Is there anything else you need?"
        } else {
          simulatedResponse = `I'm a simulated AI concierge for Hotel Ashokha! In a production environment, I would be connected to GPT-4o to answer your query about: "${lastMessage}". For now, try asking me about check-in times, amenities, or room service!`
        }

        // Stream the response word by word to simulate AI generation
        const words = simulatedResponse.split(' ')
        for (let i = 0; i < words.length; i++) {
          // Vercel AI SDK expects format: 0:"text"
          controller.enqueue(encoder.encode(`0:"${words[i]} "` + '\n'))
          await new Promise(resolve => setTimeout(resolve, 30)) // delay between words
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
