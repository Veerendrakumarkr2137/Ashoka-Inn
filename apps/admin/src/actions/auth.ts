'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function login(password: string) {
  if (!ADMIN_PASSWORD) {
    return { success: false, error: 'Server configuration error: ADMIN_PASSWORD not set.' }
  }

  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_token', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    })
    return { success: true }
  }
  return { success: false, error: 'Invalid password' }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
  redirect('/login')
}
