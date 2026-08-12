'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, Info } from 'lucide-react'
import { Button } from '@hospitality-os/ui/src/components/Button'
import { login } from '@/actions/auth'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const res = await login(password)
    
    if (res.success) {
      window.location.href = '/' // Trigger full reload to clear middleware cache
    } else {
      setError(res.error || 'Login failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-[#C6A96B]/10 blur-[100px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-[#172E64]/20 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex flex-col justify-center items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#C6A96B] to-[#E2D1A3] flex items-center justify-center shadow-lg mb-6">
            <Lock size={32} className="text-[#0F172A]" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white font-heading tracking-tight">
            Ashok Inn
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Secure Admin Portal Access
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl py-8 px-4 shadow-[0_32px_64px_rgba(0,0,0,0.3)] sm:rounded-3xl sm:px-10 border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex gap-2 items-center">
                <Info size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Master Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  suppressHydrationWarning
                  className="appearance-none block w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#C6A96B] focus:border-transparent transition-all sm:text-sm"
                  placeholder="Enter admin password..."
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base shadow-[0_0_0_1px_rgba(198,169,107,0.3),0_8px_24px_rgba(198,169,107,0.2)]"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={18} />}
            >
              Authenticate
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
