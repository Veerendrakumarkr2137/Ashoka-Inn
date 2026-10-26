import { prisma } from '@hospitality-os/database'

export interface AuditLogParams {
  category: 'BOOKING' | 'ROOM' | 'HOUSEKEEPING' | 'INSPECTION' | 'DAMAGE' | 'PAYMENT' | 'SERVICE' | 'SECURITY'
  action: string
  message: string
  author?: string
  bookingId?: string
  roomId?: string
  metadata?: Record<string, unknown>
}

export class AuditLogger {
  static async log(params: AuditLogParams) {
    const { category, action, message, author = 'System', bookingId, roomId, metadata } = params

    // Sanitize metadata to prevent leaking secrets/passwords/keys
    const sanitizedMetadata = metadata ? JSON.stringify(metadata, (key, value) => {
      if (['password', 'secret', 'token', 'apiKey', 'authorization'].includes(key.toLowerCase())) {
        return '[REDACTED]'
      }
      return value
    }) : undefined

    console.log(`[AuditLog:${category}] ${action} by ${author}: ${message}`)

    try {
      await prisma.activityLog.create({
        data: {
          category,
          action,
          message: sanitizedMetadata ? `${message} | Meta: ${sanitizedMetadata}` : message,
          author,
          bookingId: bookingId || null,
          roomId: roomId || null,
        },
      })
    } catch (err) {
      console.error('[AuditLogger Database Failure]', err)
    }
  }
}
