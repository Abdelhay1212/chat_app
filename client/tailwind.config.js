/** @type { import('tailwindcss').Config } */
export default {
  content: [
    './src/**/*.{js,jsx}',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#e7ecfe',
          DEFAULT: '#4c7dfe',
        },
        grey: {
          light: '#8f8f8f',
          DEFAULT: '#5d5d5d',
        },
        background: {
          DEFAULT: '#f9f9f9',
        }
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.caret-custom': {
          'caret-color': '#4c7dfe',
        },
      })
    },
  ],
}
