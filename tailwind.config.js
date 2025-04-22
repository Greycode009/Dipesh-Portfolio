/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#bb86fc',
        secondary: '#9d4edd',
        background: '#121212',
        surface: '#1f1f1f',
        darktext: '#121212',
        lighttext: '#e0e0e0',
        dimtext: '#bbbbbb'
      },
      boxShadow: {
        'custom': '0 10px 20px rgba(0, 0, 0, 0.2)',
        'hover': '0 15px 30px rgba(187, 134, 252, 0.2)',
      },
    },
  },
  plugins: [],
} 