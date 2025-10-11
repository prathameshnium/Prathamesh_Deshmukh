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
        sans: ['Junicode', ...defaultTheme.fontFamily.sans],
        serif: ['Junicode', 'serif'],
      },
      colors: {
        'dark-bg': 'var(--color-bg-dark)',
        'card-bg': 'var(--color-bg-card)',
        'accent-orange': '#f6ad55', /* Retaining original accent for consistency */
        'light-slate': 'var(--color-text-light-slate)',
        'slate': 'var(--color-text-slate)',
        'white': 'var(--color-text-white)',
        'true-white': '#ffffff',
      },
    },
  },
  plugins: [],
}