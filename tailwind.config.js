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
        'primary': '#193549',
        'secondary': '#122738',
        'accent': '#ffc600',
        'hot-pink': '#ff0088',
        'blush-pink': '#ff628c',
        'orange': '#ff9d00',
        'light-slate': '#a8b2d1',
        'slate': '#8892b0',
        'white': '#FFFFFF',
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