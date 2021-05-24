import plugin from '../index';

export default plugin(
  function ({ addDynamic, theme, variants }) {
    addDynamic('filter', ({ Utility }) => {
      return Utility.handler
        .handleStatic(theme('filter'))
        .createProperty(['-webkit-filter', 'filter']);
    }, {
      variants: variants('filter'),
      group: 'filter',
      completions: [
        'blur-{static}',
      ],
    });

    addDynamic('backdrop', ({ Utility }) => {
      return Utility.handler
        .handleStatic(theme('backdropFilter'))
        .createProperty(['-webkit-backdrop-filter', 'backdrop-filter']);
    }, {
      variants: variants('backdropFilter'),
      group: 'backdropFilter',
      completions: [
        'backdrop-{static}',
      ],
    });

    addDynamic('blur', ({ Utility }) => {
      return Utility.handler
        .handleStatic(theme('blur'))
        .handleSquareBrackets()
        .handleNumber(0, undefined, 'float', (number) => `${number}px`)
        .handleSize()
        .createProperty(
          ['-webkit-backdrop-filter', 'backdrop-filter'],
          (value: string) => {
            if (value === 'none') return 'none';
            return `blur(${value})`;
          }
        );
    }, {
      variants: variants('blur'),
      group: 'blur',
      completions: [
        'blur-{static}',
      ],
    });
  },
  {
    theme: {
      filter: {
        none: 'none',
        grayscale: 'grayscale(1)',
        invert: 'invert(1)',
        sepia: 'sepia(1)',
      },
      backdropFilter: {
        none: 'none',
        blur: 'blur(20px)',
      },
      blur: {
        none: 'none',
      },
    },
    variants: {
      filter: ['responsive'],
      backdropFilter: ['responsive'],
    },
  }
);
