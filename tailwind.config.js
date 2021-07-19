module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        black: '#121212',
        white: '#f3f3f3',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
