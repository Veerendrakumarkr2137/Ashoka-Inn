import React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MainContainer } from '@/components/layout/MainContainer'
import { GlobalErrorHandler } from '@/components/GlobalErrorHandler'
import './globals.css'

export const metadata = {
  title: 'Ashok Inn | Admin Dashboard',
  description: 'Enterprise Hotel Operating System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="font-sans" suppressHydrationWarning>
      <body className="antialiased bg-[var(--bg-app)] text-[var(--text-primary)]" suppressHydrationWarning>
        <GlobalErrorHandler />
        <div className="flex min-h-screen">
          <Sidebar />
          <MainContainer>
            <Header />
            <main className="flex-1 overflow-x-hidden">
              {children}
            </main>
          </MainContainer>
        </div>
      </body>
    </html>
  )
}
