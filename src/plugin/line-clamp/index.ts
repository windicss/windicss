import plugin from "../index";

const lineClamp = plugin(
  function ({ addDynamic, theme }) {

    addDynamic('line-clamp', ({ utility, Property, Style }) => {
      if (utility.amount === 'none') return Style(utility.class, Property('-webkit-line-clamp', 'unset'));
      const value = utility.handler.handleStatic(theme('lineClamp')).handleNumber(1, undefined, 'int').value;
      if (value) {
        return Style.generate(utility.class, {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': value,
        })
      }
    })
  },
  {
    theme: {
      lineClamp: {
      },
    },
    variants: {
      lineClamp: ['responsive'],
    },
  }
)

module.exports = lineClamp
