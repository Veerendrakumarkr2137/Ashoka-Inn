'use client'

import { useEffect } from 'react'

export function GlobalErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason &&
        (event.reason instanceof Event ||
          (typeof event.reason === 'object' && event.reason.constructor?.name === 'Event') ||
          Object.prototype.toString.call(event.reason) === '[object Event]')
      ) {
        event.preventDefault()
        console.warn('Suppressed unhandled DOM Event rejection:', event.reason)
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}
