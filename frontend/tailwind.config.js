/** @type {import('tailwindcss').Config} */
import { heroui } from '@heroui/theme'

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    heroui({
      layout: {
        spacing: {
          xs: '0.125rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2.5rem',
        },
        radius: {
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          pill: '999px',
        },
        breakpoints: {
          sm: '540px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1440px',
        },
        container: {
          sm: '540px',
          md: '720px',
          lg: '960px',
          xl: '1140px',
          '2xl': '1320px',
        },
      },
      themes: {
        light: {
          colors: {
            background: '#ffffff',
            foreground: '#0f172a',
            panel: '#f8fafc',
            border: '#e2e8f0',
            muted: '#475569',
            accent: {
              DEFAULT: '#0ea5e9',
              foreground: '#0b1120',
            },
            primary: {
              DEFAULT: '#0ea5e9',
              foreground: '#0b1120',
            },
            secondary: {
              DEFAULT: '#6ee7b7',
              foreground: '#0b0f0e',
            },
          },
        },
        dark: {
          extend: 'dark',
          colors: {
            background: '#0b0c10',
            foreground: '#e5e7eb',
            panel: '#111217',
            border: '#1f2430',
            muted: '#a1a1aa',
            accent: {
              DEFAULT: '#6ee7b7',
              foreground: '#0b0f0e',
            },
            primary: {
              DEFAULT: '#6ee7b7',
              foreground: '#0b0f0e',
            },
            secondary: {
              DEFAULT: '#0ea5e9',
              foreground: '#0f172a',
            },
          },
        },
      },
    }),
  ],
}
