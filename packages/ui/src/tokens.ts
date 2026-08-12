// ─── Hospitality OS Design Tokens ────────────────────────────
// CSS Custom Properties injected at runtime per-tenant
// Tokens defined here are the platform defaults (Hotel Ashokha)

export const tokens = {
  // ── Primitive Colors ───────────────────────────────────────
  colors: {
    // Navy scale
    navy: {
      50: '#F0F4FA',
      100: '#D9E2F2',
      200: '#B3C5E5',
      300: '#7D9DD1',
      400: '#4D75BC',
      500: '#2851A3',
      600: '#1E3D82',
      700: '#172E64',
      800: '#112047',
      900: '#0F172A', // Primary
      950: '#070C18',
    },
    // Gold scale
    gold: {
      50: '#FDF9F0',
      100: '#F8EDCF',
      200: '#F0D89F',
      300: '#E6C265',
      400: '#D9A93A',
      500: '#C6A96B', // Primary gold
      600: '#B8913A',
      700: '#9A7630',
      800: '#7C5D25',
      900: '#5E461C',
      950: '#3E2E10',
    },
    // Cream / Warm White
    cream: {
      50: '#FFFFFF',
      100: '#FDFCFA',
      200: '#FAF8F5',
      300: '#F7F5F2', // Main cream bg
      400: '#F0EDE8',
      500: '#E8E4DC',
      600: '#D4CFC6',
      700: '#B8B2A8',
    },
    // Neutral / Gray
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    // Semantic status colors
    success: {
      light: '#D1FAE5',
      default: '#10B981',
      dark: '#065F46',
    },
    warning: {
      light: '#FEF3C7',
      default: '#F59E0B',
      dark: '#92400E',
    },
    danger: {
      light: '#FEE2E2',
      default: '#DC2626',
      dark: '#7F1D1D',
    },
    info: {
      light: '#DBEAFE',
      default: '#2563EB',
      dark: '#1E3A8A',
    },
  },

  // ── Typography ────────────────────────────────────────────
  typography: {
    fonts: {
      heading: '"Playfair Display", Georgia, serif',
      body: '"Inter", "Manrope", system-ui, -apple-system, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      md: '1.125rem',    // 18px
      lg: '1.25rem',     // 20px
      xl: '1.5rem',      // 24px
      '2xl': '1.875rem', // 30px
      '3xl': '2.25rem',  // 36px
      '4xl': '3rem',     // 48px
      '5xl': '3.75rem',  // 60px
      '6xl': '4.5rem',   // 72px
      '7xl': '6rem',     // 96px
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeights: {
      tight: '1.1',
      snug: '1.25',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
      luxury: '0.15em',
    },
  },

  // ── Spacing (8pt grid) ────────────────────────────────────
  spacing: {
    px: '1px',
    0: '0',
    0.5: '2px',
    1: '4px',
    1.5: '6px',
    2: '8px',
    2.5: '10px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    11: '44px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    28: '112px',
    32: '128px',
    36: '144px',
    40: '160px',
    48: '192px',
    56: '224px',
    64: '256px',
  },

  // ── Border Radius ─────────────────────────────────────────
  radius: {
    none: '0',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '14px',    // Buttons, inputs
    xl: '16px',
    '2xl': '20px', // Cards
    '3xl': '24px', // Images, dialogs
    '4xl': '28px', // Panels, sidebar
    full: '9999px',
  },

  // ── Shadows ───────────────────────────────────────────────
  shadows: {
    none: 'none',
    soft: '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
    medium: '0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)',
    floating: '0 8px 24px rgba(15, 23, 42, 0.10), 0 4px 8px rgba(15, 23, 42, 0.06)',
    luxury: '0 20px 60px rgba(15, 23, 42, 0.12), 0 8px 24px rgba(15, 23, 42, 0.08)',
    gold: '0 0 0 1px rgba(198, 169, 107, 0.3), 0 8px 24px rgba(198, 169, 107, 0.15)',
    inner: 'inset 0 2px 4px rgba(15, 23, 42, 0.06)',
  },

  // ── Motion ────────────────────────────────────────────────
  motion: {
    duration: {
      instant: '50ms',
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
      lazy: '600ms',
      luxury: '800ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  // ── Z-Index Layers ────────────────────────────────────────
  zIndex: {
    base: 0,
    raised: 10,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    toast: 500,
    tooltip: 600,
  },

  // ── Breakpoints ───────────────────────────────────────────
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ── Blur ──────────────────────────────────────────────────
  blur: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
    '3xl': '64px',
  },
} as const

// ── Framer Motion Presets ─────────────────────────────────────
export const motionPresets = {
  // Page entry
  pageEntry: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  // Scale in (modal, cards)
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  // Slide up (toasts, bottom sheets)
  slideUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 16 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  // Slide in from right (drawer)
  slideRight: {
    initial: { opacity: 0, x: '100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '100%' },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },
  staggerItem: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  // Card hover
  cardHover: {
    rest: { y: 0, boxShadow: tokens.shadows.medium },
    hover: {
      y: -6,
      boxShadow: tokens.shadows.luxury,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
} as const

export type Tokens = typeof tokens
