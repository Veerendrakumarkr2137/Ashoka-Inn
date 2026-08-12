'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@hospitality-os/utils'

// ─── Badge ────────────────────────────────────────────────────
export type BadgeVariant =
  | 'default'
  | 'gold'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
  | 'navy'

const badgeStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
  gold: 'bg-[#FDF9F0] text-[#C6A96B] border-[#F0D89F]',
  success: 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]',
  warning: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
  danger: 'bg-[#FEE2E2] text-[#7F1D1D] border-[#FECACA]',
  info: 'bg-[#DBEAFE] text-[#1E3A8A] border-[#BFDBFE]',
  outline: 'bg-transparent text-[#6B7280] border-[#E5E7EB]',
  navy: 'bg-[#0F172A] text-white border-[#0F172A]',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
  animated?: boolean
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  animated = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        badgeStyles[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', {
          'bg-[#C6A96B]': variant === 'gold',
          'bg-[#10B981]': variant === 'success',
          'bg-[#F59E0B]': variant === 'warning',
          'bg-[#DC2626]': variant === 'danger',
          'bg-[#2563EB]': variant === 'info',
          'bg-[#6B7280]': variant === 'default' || variant === 'outline',
          'bg-white': variant === 'navy',
        })}>
          {animated && (
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" />
          )}
        </span>
      )}
      {children}
    </span>
  )
}

// ─── Avatar ───────────────────────────────────────────────────
export interface AvatarProps {
  src?: string
  alt?: string
  firstName?: string
  lastName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  isOnline?: boolean
  className?: string
}

const sizeMap = {
  xs: { container: 'w-6 h-6', text: 'text-[10px]', indicator: 'w-2 h-2 -bottom-0 -right-0' },
  sm: { container: 'w-8 h-8', text: 'text-xs', indicator: 'w-2 h-2 bottom-0 right-0' },
  md: { container: 'w-10 h-10', text: 'text-sm', indicator: 'w-2.5 h-2.5 bottom-0 right-0' },
  lg: { container: 'w-12 h-12', text: 'text-base', indicator: 'w-3 h-3 bottom-0 right-0' },
  xl: { container: 'w-16 h-16', text: 'text-xl', indicator: 'w-3.5 h-3.5 bottom-0.5 right-0.5' },
  '2xl': { container: 'w-24 h-24', text: 'text-3xl', indicator: 'w-4 h-4 bottom-1 right-1' },
}

export function Avatar({ src, alt, firstName = '', lastName, size = 'md', isOnline, className }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false)
  const initials = `${firstName.charAt(0)}${lastName?.charAt(0) ?? ''}`.toUpperCase()
  const { container, text, indicator } = sizeMap[size]

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div className={cn('rounded-full overflow-hidden bg-gradient-to-br from-[#C6A96B] to-[#B8913A] flex items-center justify-center font-semibold text-white', container)}>
        {src && !imgError ? (
          <img 
            src={src} 
            alt={alt ?? `${firstName} ${lastName}`} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.preventDefault()
              setImgError(true)
            }} 
          />
        ) : (
          <span className={text}>{initials || '?'}</span>
        )}
      </div>
      {isOnline !== undefined && (
        <span className={cn('absolute rounded-full border-2 border-white', indicator, isOnline ? 'bg-[#10B981]' : 'bg-[#9CA3AF]')} />
      )}
    </div>
  )
}

// ─── Glass Card ───────────────────────────────────────────────
export interface GlassCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function GlassCard({ hover = true, padding = 'md', className, children, ...props }: GlassCardProps) {
  const paddingMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } } : undefined}
      className={cn(
        'bg-white/8 backdrop-blur-[20px]',
        'border border-white/12',
        'rounded-[28px]',
        'shadow-[0_20px_60px_rgba(15,23,42,0.12),0_8px_24px_rgba(15,23,42,0.08)]',
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ─── Section Container ────────────────────────────────────────
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article'
  fullWidth?: boolean
}

export function Section({ as: Tag = 'section', fullWidth = false, className, children, ...props }: SectionProps) {
  return (
    <Tag className={cn('py-16 md:py-24', className)} {...props}>
      <div className={cn(!fullWidth && 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')}>
        {children}
      </div>
    </Tag>
  )
}

// ─── Status Badge ─────────────────────────────────────────────
const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  AVAILABLE: { label: 'Available', variant: 'success' },
  OCCUPIED: { label: 'Occupied', variant: 'navy' },
  RESERVED: { label: 'Reserved', variant: 'gold' },
  CLEANING: { label: 'Cleaning', variant: 'warning' },
  MAINTENANCE: { label: 'Maintenance', variant: 'danger' },
  OUT_OF_SERVICE: { label: 'Out of Service', variant: 'outline' },
  PENDING: { label: 'Pending', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'info' },
  CHECKED_IN: { label: 'Checked In', variant: 'success' },
  CHECKED_OUT: { label: 'Checked Out', variant: 'default' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
  NO_SHOW: { label: 'No Show', variant: 'danger' },
}

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: string
}

export function StatusBadge({ status, size, className, ...props }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, variant: 'default' as BadgeVariant }
  return (
    <Badge variant={config.variant} size={size} dot className={className} {...props}>
      {config.label}
    </Badge>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'rounded' | 'circular'
  width?: string | number
  height?: string | number
}

export function Skeleton({ variant = 'rounded', width, height, className, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-[#F3F4F6] via-[#E5E7EB] to-[#F3F4F6]',
        'bg-[length:200%_100%]',
        variant === 'circular' ? 'rounded-full' : variant === 'rounded' ? 'rounded-[14px]' : 'rounded-none',
        className,
      )}
      style={{ width, height, animationDuration: '1.5s', ...style }}
      aria-hidden="true"
      {...props}
    />
  )
}

// ─── Divider ─────────────────────────────────────────────────
export interface DividerProps {
  label?: string
  className?: string
}

export function Divider({ label, className }: DividerProps) {
  if (!label) return <hr className={cn('border-[#E5E7EB]', className)} />
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 border-t border-[#E5E7EB]" />
      <span className="text-xs text-[#9CA3AF] font-medium">{label}</span>
      <div className="flex-1 border-t border-[#E5E7EB]" />
    </div>
  )
}
