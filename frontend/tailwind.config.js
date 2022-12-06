module.exports = {
  mode: 'jit',
  content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
      extend: {
          colors: {
              primary: '#2B70E4',
              secondary: '#38B6FF',
              third: '#C1C1C1'
          },
          padding: {
              155: '155px',
              160: '160px',
          },
         
          animation: {
              'fade-in-down': 'fadeInDown 3s linear normal',
              fadeInUp: 'fadeInUp 0.5s linear normal',
              move: 'move 3s linear 1s infinite',
              move2: 'move 3s linear 2s infinite',
              move3: 'move 3s linear 3s infinite',
          },
          keyframes: {
              fadeInUp: {
                  '0%': { opacity: 0, transform: 'translateY(20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
              },
              move: {
                  '0%': { opacity: 0 },
                  '25%': { opacity: 0 },
                  '33%': { opacity: 1, transform: 'translateY(30px)' },
                  '67%': { opacity: 1, transform: 'translateY(40px)' },
                  '100%': {
                      opacity: 0,
                      transform: 'translateY(55px)',
                  },
              },
          },
      },

      fontSize: {
        sm: '0.8rem',
        base: '1rem',
        xl: '1.25rem',
        lg: '2rem',
        "2xl": '3rem',
      },
      fontFamily: {
        montserratbold: ['Montserratbold, sans-serif'],
        montserratregular: ['MontserratRegular, sans-serif'],
    },

      container: {
          center: true,
          padding: '15px',
          screens: {
              sm: '480px',
              lm: '575px',
              md: '768px',
              lg: '992px',
              xl: '1200px',
          },
      },
      screens: {
          // Maximum Medium Query
          'max-lg': { max: '1199px' },
          'max-md': { max: '991px' },
          'max-lm': { max: '767px' },
          'max-sm': { max: '575px' },

          // Fixed Medium Query
          'fixed-xs': { max: '479px' },
          'fixed-sm': { min: '480px', max: '575px' },
          'fixed-lm': { min: '576px', max: '767px' },
          'fixed-md': { min: '768px', max: '991px' },
          'fixed-lg': { min: '992px', max: '1199px' },

          // Minimum Medium Query
          sm: '480px',
          lm: '576px',
          md: '768px',
          lg: '992px',
          xl: '1200px',
      },
  },
  variants: {
      extand: {},
  },
  plugins: [],
};