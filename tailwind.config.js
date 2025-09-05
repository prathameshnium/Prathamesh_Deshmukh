/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        'accent-orange': '#FDBA74', // Replace this with the exact vibrant hex code you found
        // If you used yellow-500 directly, ensure Tailwind's default yellow-500 is what you want
      }
    },
  },
  plugins: [],
}