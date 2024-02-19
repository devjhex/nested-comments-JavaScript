/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'class',
  content: [
    "index.html",
    "./src/views/commentView.js",
    "./src/views/deleteModalView.js",
    "./src/views/editView.js",
    "./src/views/replyView.js",
  ],
  theme: {
    extend: {
    colors:{
        priModerateBlue:'hsl(238, 40%, 52%)',
        priSoftRed:'hsl(358, 79%, 66%)',
        priGrayishBlue:'hsl(239, 57%, 85%)',
        priPaleRed:'hsl(357, 100%, 86%)',
        white:'hsl(0, 0%, 100%)',
        nueDarkBlue:'hsl(212, 24%, 26%)',
        nueGrayishBlue:'hsl(211, 10%, 45%)',
        nueLightGray:'hsl(223, 19%, 93%)',
        nueVeryLightGray:'hsl(228, 33%, 97%)',
        darkModerateBlue:'hsl(238, 72%, 66%)',
        darkSoftRed:'hsl(358, 55%, 58%)',
        darkDarkBlue:'hsl(210, 65%, 81%)',
        darkGrayishBlue:'hsl(211, 26%, 78%)',
        darkLightGray:'hsl(228, 7%, 14%)',
        darkWhite:'hsl(240, 3%, 8%)',   
    },
    fontFamily:{
      rubik:'rubik'
    },
    keyframes:{
      open:{
        '0%':{transform:'scale(0)'},
        '100%':{transform:'scale(1)'}
      },
      fadeIn: {
        '0%':{opacity:'0'},
        '100%':{opacity:'1'}
      },
      fadeOut : {
        '0%':{opacity:'1'},
        '100%':{opacity:'0'}
      }
    },
    animation:{
      open:'open .5s ease-in-out forwards',
      fadeIn : 'fadeIn .5s ease-in-out forwards',
      fadeOut : 'fadeOut .5s ease-in-out forwards'
    }
    
    },
  },
  plugins: [],
}

