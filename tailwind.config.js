/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'buttonwhite': 'var(--white)',
        'green': 'var(--green)',
        'mainColor2': 'var(--main-color-2)',
        'subtleAccent': 'var(--subtle-accent)',
        'black': 'var(--black)',
        'charcoal': 'var(--charcoal)',
        'black2': 'var(--black-2)',
        'white': 'var(--white)',
        'brownGrey': 'var(--brown-grey)',
        'gray1': 'var(--gray-1)',
        'gray2': 'var(--gray-2)',
        'red': 'var(--red)',
        'lightBg': 'var(--light-bg)',
        'modalOverlay': 'var(--modal-overlay)',
        'recipeCardHeader': 'var(--recipe-card-header)',
        'brownishGrey': 'var(--brownish-grey)',
      },
      spacing: {
        '12': '3.188rem',
        '5': '1.313rem',
      },
      fontSize: {
        'custom': '1rem',
      },
      lineHeight: {
        'custom': '1.31',
      },
    },

  },
  plugins: [],
  
}


console.log(JSON.stringify(module.exports))