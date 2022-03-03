// windi.config.js
const plugin = require('../../dist/plugin');
const colors = require('../../dist/colors');

module.exports = {
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      blue: colors.sky,
      red: colors.rose,
      pink: colors.fuchsia,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      const newUtilities = {
        '.skew-10deg': {
          transform: 'skewY(-10deg)',
        },
        '.skew-15deg': {
          transform: 'skewY(-15deg)',
        },
      };
      addUtilities(newUtilities);
    }),
    plugin(function({ addComponents }) {
      const buttons = {
        '.btn': {
          padding: '.5rem 1rem',
          borderRadius: '.25rem',
          fontWeight: '600',
        },
        '.btn-blue': {
          backgroundColor: '#3490dc',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#2779bd',
          },
        },
        '.btn-red': {
          backgroundColor: '#e3342f',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#cc1f1a',
          },
        },
      };
      addComponents(buttons);
    }),
    plugin(function({ addDynamic, variants }) {
      addDynamic('skew', ({ Utility, theme }) => {
        return Utility.handler
          .handleStatic(theme('skew'))
          .handleNumber(0, 360, 'int', (number) => `skewY(-${number}deg)`)
          .createProperty('transform');
      }, variants('skew'));
    }),
    require('../../dist/plugin/filters'),
    require('../../dist/plugin/forms'),
    require('../../dist/plugin/aspect-ratio'),
    require('../../dist/plugin/line-clamp'),
    require('../../dist/plugin/typography')({
      modifiers: ['DEFAULT', 'sm', 'lg', 'red'],
    }),
  ],
};
