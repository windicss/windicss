interface ThemeAnimation {
  keyframes?: Record<string, string>
  durations?: Record<string, string>
  timingFns?: Record<string, string>
  properties?: Record<string, object>
}

export interface Theme {
  width?: Record<string, string>
  height?: Record<string, string>
  maxWidth?: Record<string, string>
  maxHeight?: Record<string, string>
  minWidth?: Record<string, string>
  minHeight?: Record<string, string>
  borderRadius?: Record<string, string>
  breakpoints?: Record<string, string>
  colors?: Record<string, string | Record<string, string>>
  fontFamily?: Record<string, string>
  fontSize?: Record<string, [string, string]>
  lineHeight?: Record<string, string>
  letterSpacing?: Record<string, string>
  wordSpacing?: Record<string, string>
  boxShadow?: Record<string, string>
  textIndent?: Record<string, string>
  textShadow?: Record<string, string>
  textStrokeWidth?: Record<string, string>
  // filters
  blur?: Record<string, string>
  dropShadow?: Record<string, string | string[]>
  // animation
  animation?: ThemeAnimation
}

const baseSize = {
  'xs': '20rem',
  'sm': '24rem',
  'md': '28rem',
  'lg': '32rem',
  'xl': '36rem',
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  '5xl': '64rem',
  '6xl': '72rem',
  '7xl': '80rem',
  'min': 'min-content',
  'max': 'max-content',
  'prose': '65ch',
}

export const theme: Theme = {
  width: {
    auto: 'auto',
    ...baseSize,
    screen: '100vw',
  },
  height: {
    auto: 'auto',
    ...baseSize,
    screen: '100vh',
  },
  maxWidth: {
    none: 'none',
    ...baseSize,
    screen: '100vw',
  },
  maxHeight: {
    none: 'none',
    ...baseSize,
    screen: '100vh',
  },
  minWidth: {
    none: 'none',
    ...baseSize,
    screen: '100vw',
  },
  minHeight: {
    none: 'none',
    ...baseSize,
    screen: '100vh',
  },
  colors: {},
  fontFamily: {},
  fontSize: {
    'xs': ['0.75rem', '1rem'],
    'sm': ['0.875rem', '1.25rem'],
    'base': ['1rem', '1.5rem'],
    'lg': ['1.125rem', '1.75rem'],
    'xl': ['1.25rem', '1.75rem'],
    '2xl': ['1.5rem', '2rem'],
    '3xl': ['1.875rem', '2.25rem'],
    '4xl': ['2.25rem', '2.5rem'],
    '5xl': ['3rem', '1'],
    '6xl': ['3.75rem', '1'],
    '7xl': ['4.5rem', '1'],
    '8xl': ['6rem', '1'],
    '9xl': ['8rem', '1'],
  },
  // keep in ASC order
  breakpoints: {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },
  borderRadius: {
    'DEFAULT': '0.25rem',
    'none': '0px',
    'sm': '0.125rem',
    'md': '0.375rem',
    'lg': '0.5rem',
    'xl': '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    'full': '9999px',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  wordSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  boxShadow: {
    'DEFAULT': '0 1px 3px 0 rgba(var(--un-shadow-color), 0.1), 0 1px 2px 0 rgba(var(--un-shadow-color), 0.06)',
    'sm': '0 1px 2px 0 rgba(var(--un-shadow-color), 0.05)',
    'md': '0 4px 6px -1px rgba(var(--un-shadow-color), 0.1), 0 2px 4px -1px rgba(var(--un-shadow-color), 0.06)',
    'lg': '0 10px 15px -3px rgba(var(--un-shadow-color), 0.1), 0 4px 6px -2px rgba(var(--un-shadow-color), 0.05)',
    'xl': '0 20px 25px -5px rgba(var(--un-shadow-color), 0.1), 0 10px 10px -5px rgba(var(--un-shadow-color), 0.04)',
    '2xl': '25px 50px -12px rgba(var(--un-shadow-color), 0.25)',
    'inner': 'inset 0 2px 4px 0 rgba(var(--un-shadow-color), 0.06)',
    'none': 'none',
  },
  textIndent: {
    'DEFAULT': '1.5rem',
    'xs': '0.5rem',
    'sm': '1rem',
    'md': '1.5rem',
    'lg': '2rem',
    'xl': '2.5rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  textShadow: {},
  textStrokeWidth: {
    DEFAULT: '1.5rem',
    none: '0',
    sm: 'thin',
    md: 'medium',
    lg: 'thick',
  },
  blur: {
    'DEFAULT': '8px',
    '0': '0',
    'sm': '4px',
    'md': '12px',
    'lg': '16px',
    'xl': '24px',
    '2xl': '40px',
    '3xl': '64px',
  },
  dropShadow: {
    'DEFAULT': ['0 1px 2px rgba(0, 0, 0, 0.1)', '0 1px 1px rgba(0, 0, 0, 0.06)'],
    'sm': '0 1px 1px rgba(0,0,0,0.05)',
    'md': ['0 4px 3px rgba(0, 0, 0, 0.07)', '0 2px 2px rgba(0, 0, 0, 0.06)'],
    'lg': ['0 10px 8px rgba(0, 0, 0, 0.04)', '0 4px 3px rgba(0, 0, 0, 0.1)'],
    'xl': ['0 20px 13px rgba(0, 0, 0, 0.03)', '0 8px 5px rgba(0, 0, 0, 0.08)'],
    '2xl': '0 25px 25px rgba(0, 0, 0, 0.15)',
    'none': '0 0 #0000',
  },
}