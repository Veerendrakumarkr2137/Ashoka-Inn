'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@hospitality-os/utils'

// ─── Input Props ──────────────────────────────────────────────
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  error?: string
  success?: boolean
  helperText?: string
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
  containerClassName?: string
  size?: 'sm' | 'md' | 'lg'
}

// ─── Input Component (Floating Label) ────────────────────────
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightElement,
      containerClassName,
      size = 'md',
      type = 'text',
      className,
      id,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      disabled,
      required,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '')
    const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`

    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue
    const isFloated = isFocused || (currentValue !== '' && currentValue !== undefined)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value)
      onChange?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const heightMap = { sm: 'h-11', md: 'h-13', lg: 'h-15' }
    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type

    return (
      <div className={cn('relative', containerClassName)}>
        {/* Input wrapper */}
        <div
          className={cn(
            'relative flex items-center',
            'rounded-[14px] border bg-white transition-all duration-200',
            // States
            !error && !success && !isFocused && 'border-[#E5E7EB]',
            isFocused && !error && !success && 'border-[#C6A96B] shadow-[0_0_0_3px_rgba(198,169,107,0.12)]',
            success && !error && 'border-[#10B981] shadow-[0_0_0_3px_rgba(16,185,129,0.12)]',
            error && 'border-[#DC2626] shadow-[0_0_0_3px_rgba(220,38,38,0.12)]',
            disabled && 'bg-[#F9FAFB] cursor-not-allowed opacity-60',
            heightMap[size],
          )}
        >
          {/* Left icon */}
          {leftIcon && (
            <span className="pl-4 text-[#9CA3AF] shrink-0">{leftIcon}</span>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={isControlled ? value : internalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              'flex-1 bg-transparent outline-none px-4 pt-5 pb-1',
              'text-[#111827] text-sm placeholder:text-transparent',
              'transition-all duration-200',
              leftIcon && 'pl-2',
              className,
            )}
            placeholder={label}
            {...props}
          />

          {/* Floating label */}
          <motion.label
            htmlFor={inputId}
            className={cn(
              'absolute pointer-events-none text-[#9CA3AF] font-medium',
              'transition-all duration-200 origin-left',
              leftIcon ? 'left-10' : 'left-4',
            )}
            animate={
              isFloated
                ? { y: -10, scale: 0.75, color: error ? '#DC2626' : isFocused ? '#C6A96B' : '#9CA3AF' }
                : { y: 0, scale: 1, color: '#9CA3AF' }
            }
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {label}
            {required && <span className="text-[#DC2626] ml-0.5">*</span>}
          </motion.label>

          {/* Right element: password toggle / icons */}
          <div className="pr-4 flex items-center gap-2">
            {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
            {success && !error && <CheckCircle2 size={16} className="text-[#10B981]" />}
            {error && <AlertCircle size={16} className="text-[#DC2626]" />}
            {rightElement}
          </div>
        </div>

        {/* Error / helper text */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              id={`${inputId}-error`}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5 text-xs text-[#DC2626] flex items-center gap-1"
            >
              <AlertCircle size={12} />
              {error}
            </motion.p>
          )}
          {!error && helperText && (
            <motion.p
              id={`${inputId}-helper`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1.5 text-xs text-[#9CA3AF]"
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  },
)
Input.displayName = 'Input'

// ─── Textarea Component ───────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  helperText?: string
  containerClassName?: string
  showCount?: boolean
  maxLength?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, containerClassName, showCount, maxLength, className, id, value, defaultValue, onChange, onFocus, onBlur, disabled, required, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '')
    const inputId = id ?? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue
    const isFloated = isFocused || (currentValue !== '' && currentValue !== undefined)
    const charCount = String(currentValue ?? '').length

    return (
      <div className={cn('relative', containerClassName)}>
        <div className={cn(
          'relative rounded-[14px] border bg-white transition-all duration-200 pt-2',
          !error && !isFocused && 'border-[#E5E7EB]',
          isFocused && !error && 'border-[#C6A96B] shadow-[0_0_0_3px_rgba(198,169,107,0.12)]',
          error && 'border-[#DC2626] shadow-[0_0_0_3px_rgba(220,38,38,0.12)]',
          disabled && 'bg-[#F9FAFB] opacity-60',
        )}>
          <textarea
            ref={ref}
            id={inputId}
            value={isControlled ? value : internalValue}
            onChange={(e) => { if (!isControlled) setInternalValue(e.target.value); onChange?.(e) }}
            onFocus={(e) => { setIsFocused(true); onFocus?.(e) }}
            onBlur={(e) => { setIsFocused(false); onBlur?.(e) }}
            disabled={disabled}
            maxLength={maxLength}
            className={cn('w-full bg-transparent outline-none px-4 pt-5 pb-3 resize-none text-sm text-[#111827]', 'placeholder:text-transparent min-h-[120px]', className)}
            placeholder={label}
            {...props}
          />
          <motion.label
            htmlFor={inputId}
            className="absolute pointer-events-none left-4 text-[#9CA3AF] font-medium"
            animate={isFloated ? { y: 4, scale: 0.75, color: error ? '#DC2626' : isFocused ? '#C6A96B' : '#9CA3AF' } : { y: 18, scale: 1, color: '#9CA3AF' }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {label}{required && <span className="text-[#DC2626] ml-0.5">*</span>}
          </motion.label>
          {showCount && maxLength && (
            <span className="absolute bottom-3 right-4 text-xs text-[#9CA3AF]">{charCount}/{maxLength}</span>
          )}
        </div>
        {error && <p role="alert" className="mt-1.5 text-xs text-[#DC2626]">{error}</p>}
        {!error && helperText && <p className="mt-1.5 text-xs text-[#9CA3AF]">{helperText}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
