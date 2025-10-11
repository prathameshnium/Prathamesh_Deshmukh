const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './pages/**/*.html',
    './_assets/js/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['Junicode', 'serif'],
      },
      colors: {
        'dark-bg': 'var(--color-bg-dark)',
        'card-bg': 'var(--color-bg-card)',
        'accent-orange': 'var(--color-accent)',
        'light-slate': 'var(--color-text-light-slate)',
        'slate': 'var(--color-text-slate)',
        'off-white': 'var(--color-text-off-white)',
        'white': 'var(--color-text-white)',
      },
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
    },
  },
  plugins: [],
}