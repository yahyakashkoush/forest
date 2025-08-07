/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'forest-black': '#0a0a0a',
        'forest-gray': '#2a2a2a',
        'forest-lightGray': '#4a4a4a',
        'forest-accent': '#4a7c59',
      },
    },
  },
  plugins: [],
}