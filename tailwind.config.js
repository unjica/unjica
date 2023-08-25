const { createThemes } = require('tw-colors');

module.exports = {
  theme: {},
  plugins: [
    createThemes({
      light: {
       'background': '#c7c7c7',
       'text': '#000',
       'black': '#000',
       'white': '#fff',
       'green': '#00c334',
       'red':   '#f51c1c',
       'gray': {
         100: '#efefef',
         200: '#c7c7c7',
         300: '#707070',
         400: '#191919',
       },
       'purple': {
         200: '#fca5a5',
         300: '#9F7171',
         400: '#665367',
       },
     },
      dark: {
       'background': '#272727',
       'text': '#fff',
       'black': '#000',
       'white': '#fff',
       'green': '#00c334',
       'red':   '#f51c1c',
       'gray': {
         100: '#efefef',
         200: '#c7c7c7',
         300: '#707070',
         400: '#191919',
       },
       'purple': {
         200: '#fca5a5',
         300: '#9F7171',
         400: '#665367',
       },
     },
    })
  ],
  content: ["./src/**/*.{html,js}"]
}
