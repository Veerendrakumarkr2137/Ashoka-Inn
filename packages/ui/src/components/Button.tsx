'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@hospitality-os/utils'

// ─── Button Variants ─────────────────────────────────────────
const buttonVariants = cva(
  // Base styles - all buttons
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium tracking-wide select-none',
    'rounded-[14px] transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A96B] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'relative overflow-hidden',
  ],
  {
    variants: {
      variant: {
        // Gold CTA - primary action (Book Now, Confirm, etc.)
        primary: [
          'bg-[#C6A96B] text-white',
          'hover:bg-[#B8913A] hover:shadow-[0_0_0_1px_rgba(198,169,107,0.3),0_8px_24px_rgba(198,169,107,0.25)]',
          'active:scale-[0.98]',
          'shadow-[0_1px_3px_rgba(198,169,107,0.2)]',
        ],
        // Navy - secondary CTA
        secondary: [
          'bg-[#0F172A] text-white',
          'hover:bg-[#172E64] hover:shadow-[0_8px_24px_rgba(15,23,42,0.2)]',
          'active:scale-[0.98]',
        ],
        // White outlined
        outline: [
          'border border-[#E5E7EB] bg-white text-[#111827]',
          'hover:border-[#C6A96B] hover:text-[#C6A96B] hover:bg-[#FDF9F0]',
          'active:scale-[0.98]',
        ],
        // Transparent with gold hover
        ghost: [
          'bg-transparent text-[#6B7280]',
          'hover:bg-[#F7F5F2] hover:text-[#111827]',
          'active:bg-[#F0EDE8]',
        ],
        // Ghost Gold variant
        'ghost-gold': [
          'bg-transparent text-[#C6A96B]',
          'hover:bg-[#FDF9F0]',
          'active:bg-[#F8EDCF]',
        ],
        // Danger
        danger: [
          'bg-[#DC2626] text-white',
          'hover:bg-[#B91C1C] hover:shadow-[0_8px_24px_rgba(220,38,38,0.2)]',
          'active:scale-[0.98]',
        ],
        // Link style
        link: [
          'bg-transparent text-[#C6A96B] underline-offset-4',
          'hover:underline',
          'p-0 h-auto',
        ],
      },
      size: {
        xs: 'h-7 px-3 text-xs',
        sm: 'h-8 px-4 text-sm',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0 rounded-full',
        'icon-lg': 'h-12 w-12 p-0 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

// ─── Gold Shimmer Overlay ─────────────────────────────────────
function GoldShimmer() {
  return (
    <motion.span
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
      initial={{ x: '-100%' }}
      whileHover={{ x: '100%' }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    />
  )
}

// ─── Button Props ─────────────────────────────────────────────
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  shimmer?: boolean
}

// ─── Button Component ─────────────────────────────────────────
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      shimmer = true,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || isLoading

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        suppressHydrationWarning
        {...props}
      >
        {/* Gold shimmer on primary variant */}
        {variant === 'primary' && shimmer && !isLoading && <GoldShimmer />}

        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className="animate-spin" size={size === 'xs' || size === 'sm' ? 14 : 16} />
        )}

        {/* Left icon */}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}

        {/* Label */}
        {isLoading && loadingText ? loadingText : children}

        {/* Right icon */}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
