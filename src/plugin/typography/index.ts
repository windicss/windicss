import { FontSize, NestObject } from "../../interfaces";
import { isPlainObject, castArray } from "../../utils/tools";
import plugin from "../index";

const defaultOptions = {
  ellipsis: true,
  hyphens: true,
  kerning: true,
  textUnset: true,
  componentPrefix: 'c-',
};

const camelCaseToKebabCase = function(string: string) {
  return string
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .toLowerCase();
};

module.exports = plugin.withOptions(function(userOptions = {}) {
  return function({ theme, variants, e, addUtilities, addComponents, addDynamic }) {
    const options = {...userOptions, ...defaultOptions};

    addDynamic('indent', ({ Utility }) => {
      return Utility.handler.handleStatic(theme('textIndent')).handleSpacing().handleSize().handleNegative().createProperty('text-indent');
    }, variants('textIndent'))

    addDynamic('text-shadow', ({ Utility, Property }) => {
      if (Utility.raw === 'text-shadow') return Property('text-shadow', theme('textShadow.default', '0 2px 5px rgba(0, 0, 0, 0.5)') as string);
      return Utility.handler.handleStatic(theme('textShadow')).createProperty('text-shadow');
    }, variants('textShadow'))

    addDynamic('line', ({ Utility }) => {
      return Utility.handler.handleStatic(theme('textDecorationStyle')).createProperty(['-webkit-text-decoration-style', 'text-decoration-style']);
    }, variants('textDecorationStyle'));

    addDynamic('line', ({ Utility }) => {
      return Utility.handler.handleColor(theme('textDecorationColor')).createProperty(['-webkit-text-decoration-color', 'text-decoration-color']);
    }, variants('textDecorationColor'));


    if (options.ellipsis) {
      const ellipsisUtilities = {
        '.ellipsis': {
          textOverflow: 'ellipsis',
        },
        '.no-ellipsis': {
          textOverflow: 'clip',
        }
      };
      addUtilities(ellipsisUtilities, variants('ellipsis'));
    }

    if (options.hyphens) {
      const hyphensUtilities = {
        '.hyphens-none': {
          hyphens: 'none',
        },
        '.hyphens-manual': {
          hyphens: 'manual',
        },
        '.hyphens-auto': {
          hyphens: 'auto',
        },
      };
      addUtilities(hyphensUtilities, variants('hyphens'));
    }

    if (options.kerning) {
      const kerningUtilities = {
        '.kerning': {
          fontKerning: 'normal',
        },
        '.kerning-none': {
          fontKerning: 'none',
        },
        '.kerning-auto': {
          fontKerning: 'auto',
        },
      };
      addUtilities(kerningUtilities, variants('kerning'));
    }

    if (options.textUnset) {
      const textUnsetUtilities = {
        '.font-family-unset': {
          fontFamily: 'inherit',
        },
        '.font-weight-unset': {
          fontWeight: 'inherit',
        },
        '.font-style-unset': {
          fontStyle: 'inherit',
        },
        '.text-size-unset': {
          fontSize: 'inherit',
        },
        '.text-align-unset': {
          textAlign: 'inherit',
        },
        '.leading-unset': {
          lineHeight: 'inherit',
        },
        '.tracking-unset': {
          letterSpacing: 'inherit',
        },
        '.text-color-unset': {
          color: 'inherit',
        },
        '.text-transform-unset': {
          textTransform: 'inherit',
        },
      };
      addUtilities(textUnsetUtilities, variants('textUnset'));
    }

    addDynamic('caps', ({ Utility }) => {
      return Utility.handler.handleStatic(theme('fontVariantCaps')).createProperty('font-variant-caps');
    })

    addDynamic('nums', ({ Utility }) => {
      return Utility.handler.handleStatic(theme('fontVariantNumeric')).createProperty('font-variant-numeric');
    })

    addDynamic('ligatures', ({ Utility }) => {
      return Utility.handler.handleStatic(theme('fontVariantLigatures')).createProperty(['-webkit-font-variant-ligatures', 'font-variant-ligatures']);
    })

    addDynamic('text', ({ Utility }) => {
      return Utility.handler.handleStatic(theme('textRendering')).createProperty('text-rendering');
    })

    const textStylesTheme = theme('textStyles') as {[key:string]: NestObject};

    const resolveTextStyle = function(name: string, styles: {[key:string]: unknown} | FontSize, topLevel = false) {
      if (isPlainObject(styles)) {
        let resolvedStyles = {};
        for (const [key, value] of Object.entries(styles)) {
          if (key === 'extends') {
            (castArray(value) as string[]).forEach(textStyleToExtend => {
              for (const [extendedKey, extendedValue] of Object.entries(resolveTextStyle(textStyleToExtend, textStylesTheme[textStyleToExtend], true))) {
                if (extendedKey !== 'output') {
                  resolvedStyles = {
                    ...resolvedStyles,
                    ...resolveTextStyle(extendedKey as string, extendedValue as {[key:string]:unknown}),
                  };
                }
              }
            })
          }
        }

        if (topLevel) {
          return resolvedStyles;
        }

        return {
          [name]: resolvedStyles,
        };
      }

      if (Array.isArray(styles)) {
        if (name === 'fontSize' && styles.length === 2) {
          return {
            fontSize: styles[0],
            lineHeight: styles[1],
          };
        }
        return {
          [name]: styles.join(', '),
        };
      }

      return {
        [name]: styles,
      };
    };

    const textStyles: {[key:string]:NestObject} = {};
    for (const [componentName, componentStyles] of Object.entries(textStylesTheme)) {
      textStyles[`.${e(`${options.componentPrefix}${camelCaseToKebabCase(componentName)}`)}`] = resolveTextStyle(componentName, componentStyles, true);
    }

    addComponents(textStyles);
  };
}, function() {
  return {
    theme: {
      textIndent: {},
      textShadow: {},
      textDecorationStyle: {
        'solid': 'solid',
        'double': 'double',
        'dotted': 'dotted',
        'dashed': 'dashed',
        'wavy': 'wavy',
      },
      textDecorationColor: theme => theme('colors'),
      fontVariantCaps: {
        'normal': 'normal',
        'small': 'small-caps',
        'all-small': 'all-small-caps',
        'petite': 'petite-caps',
        'unicase': 'unicase',
        'titling': 'titling-caps',
      },
      fontVariantNumeric: {
        'normal': 'normal',
        'ordinal': 'ordinal',
        'slashed-zero': 'slashed-zero',
        'lining': 'lining-nums',
        'oldstyle': 'oldstyle-nums',
        'proportional': 'proportional-nums',
        'tabular': 'tabular-nums',
        'diagonal-fractions': 'diagonal-fractions',
        'stacked-fractions': 'stacked-fractions',
      },
      fontVariantLigatures: {
        'normal': 'normal',
        'none': 'none',
        'common': 'common-ligatures',
        'no-common': 'no-common-ligatures',
        'discretionary': 'discretionary-ligatures',
        'no-discretionary': 'no-discretionary-ligatures',
        'historical': 'historical-ligatures',
        'no-historical': 'no-historical-ligatures',
        'contextual': 'contextual',
        'no-contextual': 'no-contextual',
      },
      textRendering: {
        'rendering-auto': 'auto',
        'optimize-legibility': 'optimizeLegibility',
        'optimize-speed': 'optimizeSpeed',
        'geometric-precision': 'geometricPrecision'
      },
      textStyles: {},
    },
    variants: {
      textIndent: ['responsive'],
      textShadow: ['responsive'],
      textDecorationStyle: ['responsive'],
      textDecorationColor: ['responsive'],
      ellipsis: ['responsive'],
      hyphens: ['responsive'],
      kerning: ['responsive'],
      textUnset: ['responsive'],
      fontVariantCaps: ['responsive'],
      fontVariantNumeric: ['responsive'],
      fontVariantLigatures: ['responsive'],
      textRendering: ['responsive'],
    },
  };
});
