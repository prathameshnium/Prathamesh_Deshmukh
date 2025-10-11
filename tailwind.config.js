/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './pages/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Source Serif Pro', 'serif'],
      },
      colors: {
        'dark-bg': '#111827', // A deeper, more neutral charcoal gray
        'card-bg': '#1f2937', // Adjusted for better contrast with the new background
        'accent-orange': '#fbb967ff', // Kept for vibrant highlights
        'light-slate': '#a8b2d1',
        'slate': '#8892b0',
        'white': '#e2e8f0',
        'true-white': '#ffffff',
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