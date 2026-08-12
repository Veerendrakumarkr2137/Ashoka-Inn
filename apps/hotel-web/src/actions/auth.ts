'use server'

import { prisma } from '@hospitality-os/database'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-super-secret-key-12345')

/**
 * 1. Guest Account Sign In (Email + Password or Auto-Guest Account)
 */
export async function loginWithPassword(email: string, pass?: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return { success: false, error: 'No guest account found with this email. Please check your email or use Booking Lookup.' }
    }

    // Create JWT Session
    const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    const cookieStore = await cookies()
    cookieStore.set('guest_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return { success: true }
  } catch (error) {
    console.error('[Auth Error]:', error)
    return { success: false, error: 'An unexpected authentication error occurred.' }
  }
}

/**
 * 2. Manage Booking / Reservation Lookup (Email + Booking Reference)
 */
export async function loginWithBookingRef(email: string, bookingRef: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { bookingRef: bookingRef.trim().toUpperCase() },
      include: { user: true },
    })

    if (!booking) {
      return { success: false, error: 'Booking reference not found. Please verify your confirmation code.' }
    }

    if (booking.user.email.toLowerCase() !== email.trim().toLowerCase()) {
      return { success: false, error: 'Email address does not match this booking reference.' }
    }

    // Create JWT Session
    const token = await new SignJWT({ userId: booking.user.id, email: booking.user.email, role: booking.user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    const cookieStore = await cookies()
    cookieStore.set('guest_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return { success: true }
  } catch (error) {
    console.error('[Booking Lookup Error]:', error)
    return { success: false, error: 'Failed to retrieve reservation details.' }
  }
}

/**
 * Legacy wrapper for backward compatibility
 */
export async function login(email: string, bookingRef: string) {
  return loginWithBookingRef(email, bookingRef)
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('guest_token')
  return { success: true }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('guest_token')?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string; email: string; role: string }
  } catch (error) {
    return null
  }
}
