import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { createClient } from '@/utils/supabase/middleware'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-super-secret-key-12345')

// Paths that require authentication
const protectedPaths = ['/profile', '/room-service']

export async function middleware(request: NextRequest) {
  // 1. Refresh Supabase session
  const supabaseResponse = createClient(request)

  const { pathname } = request.nextUrl
  
  // Check if path is protected
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  
  if (isProtected) {
    const token = request.cookies.get('guest_token')?.value
    
    if (!token) {
      // Not logged in -> Redirect to login
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', encodeURI(request.url))
      return NextResponse.redirect(url)
    }

    try {
      // Verify token
      await jwtVerify(token, JWT_SECRET)
      return supabaseResponse
    } catch (error) {
      // Invalid token -> Redirect to login
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', encodeURI(request.url))
      return NextResponse.redirect(url)
    }
  }

  // If going to login while already logged in, redirect to profile
  if (pathname === '/login') {
    const token = request.cookies.get('guest_token')?.value
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET)
        return NextResponse.redirect(new URL('/profile', request.url))
      } catch (e) {
        // invalid token is fine here, just let them see the login page
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
