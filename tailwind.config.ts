import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: '#818cf8', // indigo-400
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: (theme: (s: string) => string) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.zinc.700'),
            a: { color: theme('colors.indigo.600'), textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
            'h1,h2,h3,h4': { fontWeight: '700', letterSpacing: '-0.02em' },
            code: { fontFamily: theme('fontFamily.mono'), fontSize: '0.875em', background: theme('colors.zinc.100'), padding: '0.15em 0.35em', borderRadius: '0.25rem', fontWeight: '400' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            pre: { background: 'transparent', padding: 0, margin: 0 },
          },
        },
        invert: {
          css: {
            color: theme('colors.zinc.300'),
            a: { color: theme('colors.indigo.400') },
            code: { background: theme('colors.zinc.800'), color: theme('colors.zinc.200') },
          },
        },
      }),
    },
  },
  plugins: [typography],
} satisfies Config
