import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays, addDays, isWeekend } from 'date-fns'

// ─── Tailwind Class Merging ───────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Currency Formatting ──────────────────────────────────────
export function formatCurrency(
  amount: number,
  currency = 'INR',
  locale = 'en-IN',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(amount: number, locale = 'en-IN'): string {
  return new Intl.NumberFormat(locale).format(amount)
}

// ─── Date Utilities ───────────────────────────────────────────
export function formatDate(date: Date | string, pattern = 'dd MMM yyyy'): string {
  return format(new Date(date), pattern)
}

export function formatDateRange(checkIn: Date | string, checkOut: Date | string): string {
  const ci = new Date(checkIn)
  const co = new Date(checkOut)
  if (ci.getMonth() === co.getMonth() && ci.getFullYear() === co.getFullYear()) {
    return `${format(ci, 'dd')} – ${format(co, 'dd MMM yyyy')}`
  }
  return `${format(ci, 'dd MMM')} – ${format(co, 'dd MMM yyyy')}`
}

export function getNights(checkIn: Date | string, checkOut: Date | string): number {
  return differenceInDays(new Date(checkOut), new Date(checkIn))
}

export function addNights(date: Date | string, nights: number): Date {
  return addDays(new Date(date), nights)
}

export function isWeekendDate(date: Date | string): boolean {
  return isWeekend(new Date(date))
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  if (hour < 20) return 'evening'
  return 'night'
}

// ─── GST Calculation ─────────────────────────────────────────
export function calculateGST(
  amount: number,
  ratePercent: number,
): { taxableAmount: number; gstAmount: number; totalWithGST: number } {
  const gstAmount = (amount * ratePercent) / 100
  return {
    taxableAmount: amount,
    gstAmount: Math.round(gstAmount * 100) / 100,
    totalWithGST: Math.round((amount + gstAmount) * 100) / 100,
  }
}

export function getHotelGSTRate(pricePerNight: number): number {
  // Indian GST slabs for hotels
  if (pricePerNight <= 1000) return 0
  if (pricePerNight <= 7500) return 12
  return 18
}

// ─── Booking Utilities ────────────────────────────────────────
export function generateBookingNumber(): string {
  const prefix = 'HA'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export function getBookingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
    CHECKED_IN: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    CHECKED_OUT: 'bg-slate-100 text-slate-800 border-slate-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    NO_SHOW: 'bg-orange-100 text-orange-800 border-orange-200',
  }
  return colors[status] ?? 'bg-gray-100 text-gray-800 border-gray-200'
}

export function getRoomStatusColor(status: string): string {
  const colors: Record<string, string> = {
    AVAILABLE: '#10B981',
    OCCUPIED: '#0F172A',
    RESERVED: '#C6A96B',
    CLEANING: '#F59E0B',
    MAINTENANCE: '#F97316',
    OUT_OF_SERVICE: '#DC2626',
  }
  return colors[status] ?? '#6B7280'
}

// ─── String Utilities ─────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength).trim()}…`
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function toTitleCase(text: string): string {
  return text
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}

export function getInitials(firstName: string, lastName?: string): string {
  const first = firstName.charAt(0).toUpperCase()
  const last = lastName ? lastName.charAt(0).toUpperCase() : ''
  return `${first}${last}`
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  if (!user || !domain) return email
  const masked = user.charAt(0) + '***' + (user.length > 2 ? user.charAt(user.length - 1) : '')
  return `${masked}@${domain}`
}

export function maskPhone(phone: string): string {
  if (phone.length < 4) return phone
  return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4)
}

// ─── Validation Utilities ─────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPhone(phone: string): boolean {
  return /^[+]?[\d\s\-().]{8,15}$/.test(phone)
}

export function isValidGST(gst: string): boolean {
  return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst)
}

// ─── ORM / Query Utilities ────────────────────────────────────
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
} {
  const totalPages = Math.ceil(total / limit)
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

export function getPaginationOffset(page: number, limit: number): number {
  return (page - 1) * limit
}

// ─── Error Utilities ──────────────────────────────────────────
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}

// ─── Object Utilities ─────────────────────────────────────────
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => delete result[key])
  return result as Omit<T, K>
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    if (key in obj) result[key] = obj[key]
  })
  return result
}

// ─── Array Utilities ─────────────────────────────────────────
export function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string,
): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = keyFn(item)
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    },
    {} as Record<string, T[]>,
  )
}

export function uniqueBy<T>(items: T[], keyFn: (item: T) => string | number): T[] {
  const seen = new Set<string | number>()
  return items.filter((item) => {
    const key = keyFn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ─── Delay Utility ────────────────────────────────────────────
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── Environment & Application Configuration ─────────────────
export * from './hotelConfig'

export function isDevelopment(): boolean {

  return process.env.NODE_ENV === 'development'
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function getEnv(key: string, fallback = ''): string {
  return process.env[key] || fallback
}

export function getRequiredEnv(key: string): string {
  const val = process.env[key]
  if (!val) {
    if (isProduction()) {
      throw new Error(`[Configuration Error] Missing required environment variable: ${key}`)
    }
  }
  return val || ''
}

export function getAppConfig() {
  return {
    nodeEnv: getEnv('NODE_ENV', 'development'),
    hotelName: getEnv('NEXT_PUBLIC_HOTEL_NAME', 'Hotel Ashokha'),
    appUrl: getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    adminUrl: getEnv('NEXT_PUBLIC_ADMIN_URL', 'http://localhost:3001'),
    databaseUrl: getRequiredEnv('DATABASE_URL'),
    adminPassword: getEnv('ADMIN_PASSWORD', 'admin123'),
    authSecret: getEnv('AUTH_SECRET', 'super-secret-auth-key-change-in-production'),
    jwtSecret: getEnv('JWT_SECRET', 'super-secret-jwt-key-change-in-production'),
    providers: {
      voice: getEnv('VOICE_PROVIDER', 'mock'),
      whatsapp: getEnv('WHATSAPP_PROVIDER', 'mock'),
      email: getEnv('EMAIL_PROVIDER', 'mock'),
      payment: getEnv('PAYMENT_PROVIDER', 'mock'),
    },
    n8n: {
      baseUrl: getEnv('N8N_BASE_URL', 'http://localhost:5678'),
      webhookSecret: getEnv('N8N_WEBHOOK_SECRET', 'n8n-secure-webhook-secret-key-12345'),
    },
  }
}

