/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffc423',
          50: '#fff9e6',
          100: '#fff0b3',
          200: '#ffe066',
          300: '#ffd633',
          400: '#ffc423',
          500: '#e6a800',
          600: '#b38200',
          700: '#805d00',
          800: '#4d3700',
          900: '#1a1300',
        },
        base: {
          DEFAULT: '#303841',
          50: '#f5f6f7',
          100: '#e1e3e6',
          200: '#c3c7cc',
          300: '#a5aab2',
          400: '#878e98',
          500: '#69727f',
          600: '#4d5663',
          700: '#3a4250',
          800: '#303841',
          900: '#1e242c',
          950: '#11161b',
        },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
        display: ['Geist', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-sm': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      maxWidth: {
        content: '65ch',
        wide: '1400px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
