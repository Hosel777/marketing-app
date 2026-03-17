/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'creser-yellow': '#FFF9C4',
        'creser-mint': '#C8E6C9',
        'creser-pink': '#F8BBD9',
        'creser-blue': '#B3E5FC',
        'creser-violet': '#E1BEE7',
        'creser-text': '#37474F',
        'creser-text-light': '#78909C',
      },
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
