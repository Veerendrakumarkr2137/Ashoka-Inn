'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AshokLogo } from './AshokLogo'
import { useLoader } from '@/hooks/useLoader'

gsap.registerPlugin(useGSAP)

export function LoadingScreen() {
  const container = useRef<HTMLDivElement>(null)
  const { shouldPlay, isReady, isInitialized } = useLoader()

  useGSAP(() => {
    if (!shouldPlay) return

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('ashok-loader', 'true')
        document.body.classList.add('loading-complete')
        window.dispatchEvent(new Event('loadingComplete'))
      }
    })

    // Setup initial states
    gsap.set('.loading-screen-logo-wrapper', { opacity: 1, scale: 1, y: 0, x: 0 })
    gsap.set('.loading-screen-title', { opacity: 0, y: 15 })
    gsap.set('.loading-screen-tagline', { opacity: 0, y: 15 })
    gsap.set('.loading-screen-glow', { opacity: 0, scale: 0.8 })

    // 1. Background glow
    tl.to('.loading-screen-glow', {
      opacity: 0.15,
      scale: 1.1,
      duration: 1.8,
      ease: 'power2.out'
    })

    // 2. Logo Wrapper Fade & Scale Accent
    .to('.loading-screen-logo-wrapper', {
      opacity: 1,
      scale: 1.05,
      duration: 1.5,
      ease: 'power2.inOut'
    }, '-=1.2')

    // 4. Fade in Text
    .to('.loading-screen-title', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=0.5')
    .to('.loading-screen-tagline', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=1.0')

    // 5. Hold
    .to({}, { duration: 1.5 })

    // 6. Transition to Navbar / Hero
    // Fade out text and glow
    .to(['.loading-screen-title', '.loading-screen-tagline', '.loading-screen-glow'], {
      opacity: 0,
      y: -10,
      duration: 0.8,
      ease: 'power2.inOut'
    })
    // Fade out background so Hero shows through
    .to('.loading-screen-bg', {
      backgroundColor: 'transparent',
      duration: 1.2,
      ease: 'power2.inOut'
    }, '<')
    // Shrink and move logo to top-left (navbar area)
    .to('.loading-screen-logo-wrapper', {
      scale: 0.35,
      y: '-42vh',
      x: '-42vw', // Approximate nav position
      duration: 1.2,
      ease: 'power3.inOut'
    }, '<')

  }, { scope: container, dependencies: [shouldPlay] })

  // If we shouldn't play the animation and it's already initialized, return nothing
  if (isInitialized && !shouldPlay) {
    return null
  }

  // Prevent flash of loading screen if we haven't checked sessionStorage yet
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 z-50 bg-[#07121E]" />
    )
  }

  return (
    <div 
      ref={container}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 ${isReady ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Background layer */}
      <div className="absolute inset-0 bg-[#07121E] loading-screen-bg pointer-events-auto" />
      
      {/* Center Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-[#C8A96A] rounded-full blur-[120px] loading-screen-glow" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        
        <div className="loading-screen-logo-wrapper mb-10">
          <AshokLogo />
        </div>

        {/* Brand Name */}
        <h1 className="loading-screen-title text-3xl md:text-4xl font-bold tracking-[0.2em] text-white uppercase font-heading mb-4">
          Ashok Inn
        </h1>

        {/* Tagline */}
        <p className="loading-screen-tagline text-sm md:text-base text-[#C8A96A] tracking-[0.3em] uppercase font-medium">
          Bringing Comfort To Luxury
        </p>
      </div>
    </div>
  )
}
