'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export function MainContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <div className={`flex-1 flex flex-col min-h-screen ${isLoginPage ? '' : 'ml-[var(--sidebar-width)]'}`}>
      {children}
    </div>
  )
}
