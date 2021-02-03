import { Processor } from "../../src/lib";
import { writeFileSync } from "fs";
import typography from "../../src/plugin/typography";
import type { Config, ThemeUtil } from "../../src/interfaces";

const userConfig:Config = {
  theme: {
    textIndent: { // defaults to {}
      '1': '0.25rem',
      '2': '0.5rem',
    },
    textShadow: { // defaults to {}
      'default': '0 2px 5px rgba(0, 0, 0, 0.5)',
      'lg': '0 2px 10px rgba(0, 0, 0, 0.5)',
    },
    textDecorationStyle: { // defaults to these values
      'solid': 'solid',
      'double': 'double',
      'dotted': 'dotted',
      'dashed': 'dashed',
      'wavy': 'wavy',
    },
    textDecorationColor: { // defaults to theme => theme('colors')
      'red': '#f00',
      'green': '#0f0',
      'blue': '#00f',
    },
    fontVariantCaps: { // defaults to these values
      'normal': 'normal',
      'small': 'small-caps',
      'all-small': 'all-small-caps',
      'petite': 'petite-caps',
      'unicase': 'unicase',
      'titling': 'titling-caps',
    },
    fontVariantNumeric: { // defaults to these values
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
    fontVariantLigatures: { // defaults to these values
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
    textRendering: { // defaults to these values
      'rendering-auto': 'auto',
      'optimize-legibility': 'optimizeLegibility',
      'optimize-speed': 'optimizeSpeed',
      'geometric-precision': 'geometricPrecision'
    },
    textStyles: theme => ({ // defaults to {}
      heading: {
        output: false, // this means there won't be a "heading" component in the CSS, but it can be extended
        fontWeight: theme('fontWeight.bold'),
        lineHeight: theme('lineHeight.tight'),
      },
      h1: {
        extends: 'heading', // this means all the styles in "heading" will be copied here; "extends" can also be an array to extend multiple text styles
        fontSize: theme('fontSize.5xl'),
        '@screen sm': {
          fontSize: theme('fontSize.6xl'),
        },
      },
      h2: {
        extends: 'heading',
        fontSize: theme('fontSize.4xl'),
        '@screen sm': {
          fontSize: theme('fontSize.5xl'),
        },
      },
      h3: {
        extends: 'heading',
        fontSize: theme('fontSize.4xl'),
      },
      h4: {
        extends: 'heading',
        fontSize: theme('fontSize.3xl'),
      },
      h5: {
        extends: 'heading',
        fontSize: theme('fontSize.2xl'),
      },
      h6: {
        extends: 'heading',
        fontSize: theme('fontSize.xl'),
      },
      link: {
        fontWeight: theme('fontWeight.bold'),
        color: theme('colors.blue.400'),
        '&:hover': {
          color: theme('colors.blue.600'),
          textDecoration: 'underline',
        },
      },
      richText: {
        fontWeight: theme('fontWeight.normal'),
        fontSize: theme('fontSize.base'),
        lineHeight: theme('lineHeight.relaxed'),
        '> * + *': {
          marginTop: '1em',
        },
        'h1': {
          extends: 'h1',
        },
        'h2': {
          extends: 'h2',
        },
        'h3': {
          extends: 'h3',
        },
        'h4': {
          extends: 'h4',
        },
        'h5': {
          extends: 'h5',
        },
        'h6': {
          extends: 'h6',
        },
        'ul': {
          listStyleType: 'disc',
        },
        'ol': {
          listStyleType: 'decimal',
        },
        'a': {
          extends: 'link',
        },
        'b, strong': {
          fontWeight: theme('fontWeight.bold'),
        },
        'i, em': {
          fontStyle: 'italic',
        },
      },
    }),
  }
}

describe("typography plugin", () => {
  it("interpret", () => {
    const processor = new Processor(userConfig);
    processor.loadPluginWithOptions(typography);
    const classes = `
      indent-1
      indent-2
      -indent-1
      text-shadow
      text-shadow-lg
      line-red
      line-green
      line-blue
      line-solid
      line-double
      line-dotted
      line-dashed
      line-wavy
      ellipsis
      no-ellipsis
      hyphens-none
      hyphens-manual
      hyphens-auto
      kerning
      kerning-none
      kerning-auto
      font-family-unset
      font-weight-unset
      font-style-unset
      text-size-unset
      text-align-unset
      leading-unset
      tracking-unset
      text-color-unset
      text-transform-unset
      caps-normal
      caps-small
      caps-all-small
      caps-petite
      caps-unicase
      caps-titling
      nums-normal
      nums-ordinal
      nums-slashed-zero
      nums-lining
      nums-oldstyle
      nums-proportional
      nums-tabular
      nums-diagonal-fractions
      nums-stacked-fractions
      ligatures-normal
      ligatures-none
      ligatures-common
      ligatures-no-common
      ligatures-discretionary
      ligatures-no-discretionary
      ligatures-historical
      ligatures-no-historical
      ligatures-contextual
      ligatures-no-contextual
      text-rendering-auto
      text-optimize-legibility
      text-optimize-speed
      text-geometric-precision
      c-h1
      c-h2
      c-h3
      c-h4
      c-h5
      c-h6
      c-link
      c-rich-text
    `;
    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);
    writeFileSync('typography.css', result.styleSheet.build());
  })
})
