/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        pastel: {
          background: '#FFF5E4',
          section: '#FFE3E1',
          highlight: '#FFD1D1',
          accent: '#FF9494',
          footer: '#FF9494',
        },
      },
    },
  },
  plugins: [],
}

