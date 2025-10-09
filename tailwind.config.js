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
        'accent-orange': '#f6ad55', 
        'dark-bg': '#1a202c',       
        'card-bg': '#2d3748',
        'light-slate': '#a8b2d1',
        'slate': '#8892b0'
      }
    },
  },
  plugins: [],
}