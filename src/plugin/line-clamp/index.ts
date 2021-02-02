import plugin from "../index";

export default plugin(
  function ({ addDynamic, theme }) {

    addDynamic('line-clamp', ({ Utility, Property, Style }) => {
      if (Utility.amount === 'none') return Style(Utility.class, Property('-webkit-line-clamp', 'unset'));
      const value = Utility.handler.handleStatic(theme('lineClamp')).handleNumber(1, undefined, 'int').value;
      if (value) {
        return Style.generate(Utility.class, {
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
