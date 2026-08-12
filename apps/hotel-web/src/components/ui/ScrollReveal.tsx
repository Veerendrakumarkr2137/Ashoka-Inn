'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  type?: 'text' | 'image' | 'card'
  delay?: number
  className?: string
}

// ─── Motion System v1.0 Timing Constants ─────────────────────────────────────
// Text: 0.9s | Image: 1.2s | Card: 0.9s | Ease: [0.25, 0.46, 0.45, 0.94]

export function ScrollReveal({
  children,
  type = 'text',
  delay = 0,
  className = '',
  ...props
}: ScrollRevealProps) {
  const isImage = type === 'image'
  const duration = isImage ? 1.2 : 0.9

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: isImage ? 20 : 24, 
        scale: isImage ? 1.015 : 1 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1 
      }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
