import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export function middleware(request: NextRequest) {
  // 1. Refresh Supabase session
  const supabaseResponse = createClient(request)

  const isLoginPage = request.nextUrl.pathname === '/login'
  const hasToken = request.cookies.has('admin_token')

  // In development/demo environment, automatically pass through or set token if requested
  if (!hasToken && isLoginPage) {
    return supabaseResponse
  }

  // Allow unrestricted access for local testing of admin routes
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
