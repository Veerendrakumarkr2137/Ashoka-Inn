'use client'

import { useState, useEffect } from 'react'

export function useLoader() {
  const [shouldPlay, setShouldPlay] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Only run on client
    const hasPlayed = sessionStorage.getItem('ashok-loader')
    
    if (hasPlayed === 'true') {
      setShouldPlay(false)
      setIsReady(true) // Immediate
    } else {
      setShouldPlay(true)
      // We will set ashok-loader=true after it finishes in the animation timeline
    }
    setIsInitialized(true)
  }, [])

  return { shouldPlay, isReady, isInitialized }
}
