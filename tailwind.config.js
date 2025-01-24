/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B3A4B',
          light: '#234B61',
        },
        secondary: {
          DEFAULT: '#C5A572',
          light: '#D4B989',
        },
        background: '#F5F7F9',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        proxima: ['proxima-nova', 'sans-serif'],
      },
    },
  },
  plugins: [],
};