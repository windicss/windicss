import type { StaticUtility } from '../../interfaces';

// https://tailwindcss.com/docs/font-variant-numeric
// This feature uses var+comment hacks to get around property stripping:
// https://github.com/tailwindlabs/tailwindcss.com/issues/522#issuecomment-687667238
const fontVariants = {
  '--tw-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-numeric-figure': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-numeric-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-numeric-fraction': 'var(--tw-empty,/*!*/ /*!*/)',
  'font-variant-numeric':
    'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)',
};

export const staticUtilities: StaticUtility = {
  /**
   * ===========================================
   * Layout
   */

  // https://tailwindcss.com/docs/container
  // See dynamic.ts

  // https://tailwindcss.com/docs/box-sizing
  'box-border': {
    '-webkit-box-sizing': 'border-box',
    'box-sizing': 'border-box',
  },
  'box-content': {
    '-webkit-box-sizing': 'content-box',
    'box-sizing': 'content-box',
  },

  // https://tailwindcss.com/docs/display
  block: { display: 'block' },
  'inline-block': { display: 'inline-block' },
  inline: { display: 'inline' },
  flex: { display: ['-webkit-box', '-ms-flexbox', '-webkit-flex', 'flex'] },
  'inline-flex': {
    display: [
      '-webkit-inline-box',
      '-ms-inline-flexbox',
      '-webkit-inline-flex',
      'inline-flex',
    ],
  },
  table: { display: 'table' },
  'table-caption': { display: 'table-caption' },
  'table-cell': { display: 'table-cell' },
  'table-column': { display: 'table-column' },
  'table-column-group': { display: 'table-column-group' },
  'table-footer-group': { display: 'table-footer-group' },
  'table-header-group': { display: 'table-header-group' },
  'table-row-group': { display: 'table-row-group' },
  'table-row': { display: 'table-row' },
  'flow-root': { display: 'flow-root' },
  grid: { display: ['-ms-grid', 'grid'] },
  'inline-grid': { display: ['-ms-inline-grid', 'inline-grid'] },
  contents: { display: 'contents' },
  hidden: { display: 'none' },

  // https://tailwindcss.com/docs/float
  'float-right': { float: 'right' },
  'float-left': { float: 'left' },
  'float-none': { float: 'none' },

  // https://tailwindcss.com/docs/clear
  'clear-left': { clear: 'left' },
  'clear-right': { clear: 'right' },
  'clear-both': { clear: 'both' },
  'clear-none': { clear: 'none' },

  // https://tailwindcss.com/docs/object-fit
  'object-contain': { '-o-object-fit': 'contain', 'object-fit': 'contain' },
  'object-cover': { '-o-object-fit': 'cover', 'object-fit': 'cover' },
  'object-fill': { '-o-object-fit': 'fill', 'object-fit': 'fill' },
  'object-none': { '-o-object-fit': 'none', 'object-fit': 'none' },
  'object-scale-down': {
    '-o-object-fit': 'scale-down',
    'object-fit': 'scale-down',
  },

  // https://tailwindcss.com/docs/object-position
  // dynamic

  // https://tailwindcss.com/docs/overflow
  'overflow-auto': { overflow: 'auto' },
  'overflow-hidden': { overflow: 'hidden' },
  'overflow-visible': { overflow: 'visible' },
  'overflow-scroll': { overflow: 'scroll' },
  'overflow-x-auto': { 'overflow-x': 'auto' },
  'overflow-y-auto': { 'overflow-y': 'auto' },
  'overflow-x-hidden': { 'overflow-x': 'hidden' },
  'overflow-y-hidden': { 'overflow-y': 'hidden' },
  'overflow-x-visible': { 'overflow-x': 'visible' },
  'overflow-y-visible': { 'overflow-y': 'visible' },
  'overflow-x-scroll': { 'overflow-x': 'scroll' },
  'overflow-y-scroll': { 'overflow-y': 'scroll' },

  // https://tailwindcss.com/docs/overscroll-behavior
  'overscroll-auto': {
    'overscroll-behavior': 'auto',
    '-ms-scroll-chaining': 'chained',
  },
  'overscroll-contain': {
    'overscroll-behavior': 'contain',
    '-ms-scroll-chaining': 'none',
  },
  'overscroll-none': {
    'overscroll-behavior': 'none',
    '-ms-scroll-chaining': 'none',
  },
  'overscroll-y-auto': { 'overscroll-behavior-y': 'auto' },
  'overscroll-y-contain': { 'overscroll-behavior-y': 'contain' },
  'overscroll-y-none': { 'overscroll-behavior-y': 'none' },
  'overscroll-x-auto': { 'overscroll-behavior-x': 'auto' },
  'overscroll-x-contain': { 'overscroll-behavior-x': 'contain' },
  'overscroll-x-none': { 'overscroll-behavior-x': 'none' },

  // https://tailwindcss.com/docs/position
  static: { position: 'static' },
  fixed: { position: 'fixed' },
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  sticky: { position: ['sticky', '-webkit-sticky'] },

  // https://tailwindcss.com/docs/top-right-bottom-left
  // See dynamic.ts

  // https://tailwindcss.com/docs/visibility
  visible: { visibility: 'visible' },
  invisible: { visibility: 'hidden' },

  // https://tailwindcss.com/docs/z-index
  // See dynamic.ts

  /**
   * ===========================================
   * Flexbox
   */

  // https://tailwindcss.com/docs/flex-direction
  'flex-row': {
    '-webkit-box-orient': 'horizontal',
    '-webkit-box-direction': 'normal',
    '-ms-flex-direction': 'row',
    '-webkit-flex-direction': 'row',
    'flex-direction': 'row',
  },
  'flex-row-reverse': {
    '-webkit-box-orient': 'horizontal',
    '-webkit-box-direction': 'reverse',
    '-ms-flex-direction': 'row-reverse',
    '-webkit-flex-direction': 'row-reverse',
    'flex-direction': 'row-reverse',
  },
  'flex-col': {
    '-webkit-box-orient': 'vertical',
    '-webkit-box-direction': 'normal',
    '-ms-flex-direction': 'column',
    '-webkit-flex-direction': 'column',
    'flex-direction': 'column',
  },
  'flex-col-reverse': {
    '-webkit-box-orient': 'vertical',
    '-webkit-box-direction': 'reverse',
    '-ms-flex-direction': 'column-reverse',
    '-webkit-flex-direction': 'column-reverse',
    'flex-direction': 'column-reverse',
  },

  // https://tailwindcss.com/docs/flex-wrap
  'flex-wrap': {
    '-ms-flex-wrap': 'wrap',
    '-webkit-flex-wrap': 'wrap',
    'flex-wrap': 'wrap',
  },
  'flex-wrap-reverse': {
    '-ms-flex-wrap': 'wrap-reverse',
    '-webkit-flex-wrap': 'wrap-reverse',
    'flex-wrap': 'wrap-reverse',
  },
  'flex-nowrap': {
    '-ms-flex-wrap': 'nowrap',
    '-webkit-flex-wrap': 'nowrap',
    'flex-wrap': 'nowrap',
  },

  // https://tailwindcss.com/docs/flex
  // https://tailwindcss.com/docs/flex-grow
  // https://tailwindcss.com/docs/flex-shrink
  // https://tailwindcss.com/docs/order
  // See dynamic.ts

  /**
   * ===========================================
   * Grid
   */

  // https://tailwindcss.com/docs/grid-template-columns
  // https://tailwindcss.com/docs/grid-column
  'col-auto': { 'grid-column': 'auto' },
  // https://tailwindcss.com/docs/grid-template-rows
  // https://tailwindcss.com/docs/grid-row
  'row-auto': { 'grid-row': 'auto' },

  // https://tailwindcss.com/docs/grid-auto-flow
  'grid-flow-row': { 'grid-auto-flow': 'row' },
  'grid-flow-col': { 'grid-auto-flow': 'column' },
  'grid-flow-row-dense': { 'grid-auto-flow': 'row dense' },
  'grid-flow-col-dense': { 'grid-auto-flow': 'col dense' },

  // https://tailwindcss.com/docs/grid-auto-columns
  // https://tailwindcss.com/docs/grid-auto-rows
  // https://tailwindcss.com/docs/gap
  // See dynamic.ts

  // https://tailwindcss.com/docs/justify-content
  'justify-start': {
    '-webkit-box-pack': 'start',
    '-ms-flex-pack': 'start',
    '-webkit-justify-content': 'flex-start',
    'justify-content': 'flex-start',
  },
  'justify-end': {
    '-webkit-box-pack': 'end',
    '-ms-flex-pack': 'end',
    '-webkit-justify-content': 'flex-end',
    'justify-content': 'flex-end',
  },
  'justify-center': {
    '-webkit-box-pack': 'center',
    '-ms-flex-pack': 'center',
    '-webkit-justify-content': 'center',
    'justify-content': 'center',
  },
  'justify-between': {
    '-webkit-box-pack': 'justify',
    '-ms-flex-pack': 'justify',
    '-webkit-justify-content': 'space-between',
    'justify-content': 'space-between',
  },
  'justify-around': {
    '-ms-flex-pack': 'distribute',
    '-webkit-justify-content': 'space-around',
    'justify-content': 'space-around',
  },
  'justify-evenly': {
    '-webkit-box-pack': 'space-evenly',
    '-ms-flex-pack': 'space-evenly',
    '-webkit-justify-content': 'space-evenly',
    'justify-content': 'space-evenly',
  },

  // https://tailwindcss.com/docs/justify-items
  'justify-items-auto': { 'justify-items': 'auto' },
  'justify-items-start': { 'justify-items': 'start' },
  'justify-items-end': { 'justify-items': 'end' },
  'justify-items-center': { 'justify-items': 'center' },
  'justify-items-stretch': { 'justify-items': 'stretch' },

  // https://tailwindcss.com/docs/justify-self
  'justify-self-auto': {
    '-ms-grid-column-align': 'auto',
    'justify-self': 'auto',
  },
  'justify-self-start': {
    '-ms-grid-column-align': 'start',
    'justify-self': 'start',
  },
  'justify-self-end': { '-ms-grid-column-align': 'end', 'justify-self': 'end' },
  'justify-self-center': {
    '-ms-grid-column-align': 'center',
    'justify-self': 'center',
  },
  'justify-self-stretch': {
    '-ms-grid-column-align': 'stretch',
    'justify-self': 'stretch',
  },

  // https://tailwindcss.com/docs/align-content
  'content-center': {
    '-ms-flex-line-pack': 'center',
    '-webkit-align-content': 'center',
    'align-content': 'center',
  },
  'content-start': {
    '-ms-flex-line-pack': 'start',
    '-webkit-align-content': 'flex-start',
    'align-content': 'flex-start',
  },
  'content-end': {
    '-ms-flex-line-pack': 'end',
    '-webkit-align-content': 'flex-end',
    'align-content': 'flex-end',
  },
  'content-between': {
    '-ms-flex-line-pack': 'justify',
    '-webkit-align-content': 'space-between',
    'align-content': 'space-between',
  },
  'content-around': {
    '-ms-flex-line-pack': 'distribute',
    '-webkit-align-content': 'space-around',
    'align-content': 'space-around',
  },
  'content-evenly': {
    '-ms-flex-line-pack': 'space-evenly',
    '-webkit-align-content': 'space-evenly',
    'align-content': 'space-evenly',
  },

  // https://tailwindcss.com/docs/align-items
  'items-start': {
    '-webkit-box-align': 'start',
    '-ms-flex-align': 'start',
    '-webkit-align-items': 'flex-start',
    'align-items': 'flex-start',
  },
  'items-end': {
    '-webkit-box-align': 'end',
    '-ms-flex-align': 'end',
    '-webkit-align-items': 'flex-end',
    'align-items': 'flex-end',
  },
  'items-center': {
    '-webkit-box-align': 'center',
    '-ms-flex-align': 'center',
    '-webkit-align-items': 'center',
    'align-items': 'center',
  },
  'items-baseline': {
    '-webkit-box-align': 'baseline',
    '-ms-flex-align': 'baseline',
    '-webkit-align-items': 'baseline',
    'align-items': 'baseline',
  },
  'items-stretch': {
    '-webkit-box-align': 'stretch',
    '-ms-flex-align': 'stretch',
    '-webkit-align-items': 'stretch',
    'align-items': 'stretch',
  },

  // https://tailwindcss.com/docs/align-self
  'self-auto': {
    '-ms-flex-item-align': 'auto',
    '-ms-grid-row-align': 'auto',
    '-webkit-align-self': 'auto',
    'align-self': 'auto',
  },
  'self-start': {
    '-ms-flex-item-align': 'start',
    '-webkit-align-self': 'flex-start',
    'align-self': 'flex-start',
  },
  'self-end': {
    '-ms-flex-item-align': 'end',
    '-webkit-align-self': 'flex-end',
    'align-self': 'flex-end',
  },
  'self-center': {
    '-ms-flex-item-align': 'center',
    '-ms-grid-row-align': 'center',
    '-webkit-align-self': 'center',
    'align-self': 'center',
  },
  'self-stretch': {
    '-ms-flex-item-align': 'stretch',
    '-ms-grid-row-align': 'stretch',
    '-webkit-align-self': 'stretch',
    'align-self': 'stretch',
  },

  // https://tailwindcss.com/docs/place-content
  'place-content-center': { 'place-content': 'center' },
  'place-content-start': { 'place-content': 'start' },
  'place-content-end': { 'place-content': 'end' },
  'place-content-between': { 'place-content': 'space-between' },
  'place-content-around': { 'place-content': 'space-around' },
  'place-content-evenly': { 'place-content': 'space-evenly' },
  'place-content-stretch': { 'place-content': 'stretch' },

  // https://tailwindcss.com/docs/place-items
  'place-items-auto': { 'place-items': 'auto' },
  'place-items-start': { 'place-items': 'start' },
  'place-items-end': { 'place-items': 'end' },
  'place-items-center': { 'place-items': 'center' },
  'place-items-stretch': { 'place-items': 'stretch' },

  // https://tailwindcss.com/docs/place-self
  'place-self-auto': {
    '-ms-grid-row-align': 'auto',
    '-ms-grid-column-align': 'auto',
    'place-self': 'auto',
  },
  'place-self-start': {
    '-ms-grid-row-align': 'start',
    '-ms-grid-column-align': 'start',
    'place-self': 'start',
  },
  'place-self-end': {
    '-ms-grid-row-align': 'end',
    '-ms-grid-column-align': 'end',
    'place-self': 'end',
  },
  'place-self-center': {
    '-ms-grid-row-align': 'center',
    '-ms-grid-column-align': 'center',
    'place-self': 'center',
  },
  'place-self-stretch': {
    '-ms-grid-row-align': 'stretch',
    '-ms-grid-column-align': 'stretch',
    'place-self': 'stretch',
  },

  /**
   * ===========================================
   * Spacing
   */

  // https://tailwindcss.com/docs/padding
  // https://tailwindcss.com/docs/margin
  // https://tailwindcss.com/docs/space
  // See dynamic.ts

  /**
   * ===========================================
   * Sizing
   */

  // https://tailwindcss.com/docs/width
  // https://tailwindcss.com/docs/min-width
  // https://tailwindcss.com/docs/max-width
  // https://tailwindcss.com/docs/height
  // https://tailwindcss.com/docs/min-height
  // https://tailwindcss.com/docs/max-height
  // See dynamic.ts

  /**
   * ===========================================
   * Typography
   */

  // https://tailwindcss.com/docs/font-family
  // https://tailwindcss.com/docs/font-size
  // See dynamic.ts

  // https://tailwindcss.com/docs/font-smoothing
  antialiased: {
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  },

  'subpixel-antialiased': {
    '-webkit-font-smoothing': 'auto',
    '-moz-osx-font-smoothing': 'auto',
  },

  // https://tailwindcss.com/docs/font-style
  italic: { 'font-style': 'italic' },
  'not-italic': { 'font-style': 'normal' },

  // https://tailwindcss.com/docs/font-weight
  // See dynamic.ts

  // https://tailwindcss.com/docs/font-variant-numeric
  'normal-nums': { 'font-variant-numeric': 'normal' },
  ordinal: { ...fontVariants, '--tw-ordinal': 'ordinal' },

  'slashed-zero': {
    ...fontVariants,
    '--tw-slashed-zero': 'slashed-zero',
  },
  'lining-nums': { ...fontVariants, '--tw-numeric-figure': 'lining-nums' },

  'oldstyle-nums': {
    ...fontVariants,
    '--tw-numeric-figure': 'oldstyle-nums',
  },
  'proportional-nums': {
    ...fontVariants,
    '--tw-numeric-spacing': 'proportional-nums',
  },
  'tabular-nums': {
    ...fontVariants,
    '--tw-numeric-spacing': 'tabular-nums',
  },
  'diagonal-fractions': {
    ...fontVariants,
    '--tw-numeric-fraction': 'diagonal-fractions',
  },
  'stacked-fractions': {
    ...fontVariants,
    '--tw-numeric-fraction': 'stacked-fractions',
  },

  // https://tailwindcss.com/docs/letter-spacing
  // https://tailwindcss.com/docs/line-height
  // https://tailwindcss.com/docs/list-style-type
  // See dynamic.ts

  // https://tailwindcss.com/docs/list-style-position
  'list-inside': { 'list-style-position': 'inside' },
  'list-outside': { 'list-style-position': 'outside' },

  // https://tailwindcss.com/docs/placeholder-color
  // https://tailwindcss.com/docs/placeholder-opacity
  // See dynamic.ts

  // https://tailwindcss.com/docs/text-align
  'text-left': { 'text-align': 'left' },
  'text-center': { 'text-align': 'center' },
  'text-right': { 'text-align': 'right' },
  'text-justify': { 'text-align': 'justify' },

  // https://tailwindcss.com/docs/text-color
  // https://tailwindcss.com/docs/text-opacity
  // See dynamic.ts

  // https://tailwindcss.com/docs/text-decoration
  underline: { 'text-decoration': 'underline' },
  'line-through': { 'text-decoration': 'line-through' },
  'no-underline': { 'text-decoration': 'none' },

  // https://tailwindcss.com/docs/text-transform
  uppercase: { 'text-transform': 'uppercase' },
  lowercase: { 'text-transform': 'lowercase' },
  capitalize: { 'text-transform': 'capitalize' },
  'normal-case': { 'text-transform': 'none' },

  // https://tailwindcss.com/docs/text-overflow
  truncate: {
    overflow: 'hidden',
    '-o-text-overflow': 'ellipsis',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
  },

  'overflow-ellipsis': {
    '-o-text-overflow': 'ellipsis',
    'text-overflow': 'ellipsis',
  },
  'overflow-clip': { '-o-text-overflow': 'clip', 'text-overflow': 'clip' },

  // https://tailwindcss.com/docs/vertical-align
  'align-baseline': { 'vertical-align': 'baseline' },
  'align-top': { 'vertical-align': 'top' },
  'align-middle': { 'vertical-align': 'middle' },
  'align-bottom': { 'vertical-align': 'bottom' },
  'align-text-top': { 'vertical-align': 'text-top' },
  'align-text-bottom': { 'vertical-align': 'text-bottom' },

  // https://tailwindcss.com/docs/whitespace
  'whitespace-normal': { 'white-space': 'normal' },
  'whitespace-nowrap': { 'white-space': 'nowrap' },
  'whitespace-pre': { 'white-space': 'pre' },
  'whitespace-pre-line': { 'white-space': 'pre-line' },
  'whitespace-pre-wrap': { 'white-space': 'pre-wrap' },

  // https://tailwindcss.com/docs/word-break
  'break-normal': { 'word-break': 'normal', 'overflow-wrap': 'normal' },
  'break-words': { 'overflow-wrap': 'break-word' },
  'break-all': { 'word-break': 'break-all' },

  /**
   * ===========================================
   * Backgrounds
   */

  // https://tailwindcss.com/docs/background-attachment
  'bg-fixed': { 'background-attachment': 'fixed' },
  'bg-local': { 'background-attachment': 'local' },
  'bg-scroll': { 'background-attachment': 'scroll' },

  // https://tailwindcss.com/docs/background-clip
  'bg-clip-border': {
    '-webkit-background-clip': 'border-box',
    'background-clip': 'border-box',
  },
  'bg-clip-padding': {
    '-webkit-background-clip': 'padding-box',
    'background-clip': 'padding-box',
  },
  'bg-clip-content': {
    '-webkit-background-clip': 'content-box',
    'background-clip': 'content-box',
  },
  'bg-clip-text': {
    '-webkit-background-clip': 'text',
    'background-clip': 'text',
  },

  // https://tailwindcss.com/docs/background-color
  // https://tailwindcss.com/docs/background-opacity
  // https://tailwindcss.com/docs/background-position
  // See dynamic.ts

  // https://tailwindcss.com/docs/background-repeat
  'bg-repeat': { 'background-repeat': 'repeat' },
  'bg-no-repeat': { 'background-repeat': 'no-repeat' },
  'bg-repeat-x': { 'background-repeat': 'repeat-x' },
  'bg-repeat-y': { 'background-repeat': 'repeat-y' },
  'bg-repeat-round': { 'background-repeat': 'round' },
  'bg-repeat-space': { 'background-repeat': 'space' },

  // https://tailwindcss.com/docs/background-image
  // https://tailwindcss.com/docs/gradient-color-stops
  // See dynamic.ts

  /**
   * ===========================================
   * Borders
   */

  // https://tailwindcss.com/docs/border-radius
  // See dynamic.ts

  // https://tailwindcss.com/docs/border-width
  // See dynamic.ts

  // https://tailwindcss.com/docs/border-color
  // https://tailwindcss.com/docs/border-opacity
  // See dynamic.ts

  // https://tailwindcss.com/docs/border-style
  'border-solid': { 'border-style': 'solid' },
  'border-dashed': { 'border-style': 'dashed' },
  'border-dotted': { 'border-style': 'dotted' },
  'border-double': { 'border-style': 'double' },
  'border-none': { 'border-style': 'none' },

  // https://tailwindcss.com/docs/divide-width
  // https://tailwindcss.com/docs/divide-color
  // https://tailwindcss.com/docs/divide-opacity
  // See dynamic.ts

  // https://tailwindcss.com/docs/ring-width
  // https://tailwindcss.com/docs/ring-color
  // https://tailwindcss.com/docs/ring-opacity
  // https://tailwindcss.com/docs/ring-offset-width
  // https://tailwindcss.com/docs/ring-offset-color
  // dynamic

  /**
   * ===========================================
   * Effects
   */

  // https://tailwindcss.com/docs/box-shadow/
  // https://tailwindcss.com/docs/opacity
  // See dynamic.ts

  /**
   * ===========================================
   * Tables
   */

  // https://tailwindcss.com/docs/border-collapse
  'border-collapse': { 'border-collapse': 'collapse' },
  'border-separate': { 'border-collapse': 'separate' },

  // https://tailwindcss.com/docs/table-layout
  'table-auto': { 'table-layout': 'auto' },
  'table-fixed': { 'table-layout': 'fixed' },

  /**
   * ===========================================
   * Transitions
   */

  // https://tailwindcss.com/docs/transition-property
  // https://tailwindcss.com/docs/transition-duration
  // https://tailwindcss.com/docs/transition-delay
  // https://tailwindcss.com/docs/transition-timing-function
  // See dynamic.ts

  /**
   * ===========================================
   * Transforms
   */
  // https://tailwindcss.com/docs/transform
  transform: {
    '--tw-translate-x': '0',
    '--tw-translate-y': '0',
    '--tw-rotate': '0',
    '--tw-skew-x': '0',
    '--tw-skew-y': '0',
    '--tw-scale-x': '1',
    '--tw-scale-y': '1',
    '-webkit-transform':
      'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
    '-ms-transform':
      'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
    transform:
      'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
  },

  'transform-gpu': {
    '--tw-translate-x': '0',
    '--tw-translate-y': '0',
    '--tw-rotate': '0',
    '--tw-skew-x': '0',
    '--tw-skew-y': '0',
    '--tw-scale-x': '1',
    '--tw-scale-y': '1',
    '-webkit-transform':
      'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
    '-ms-transform':
      'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
    transform:
      'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
  },

  'transform-none': {
    '-webkit-transform': 'none',
    '-ms-transform': 'none',
    transform: 'none',
  },
  // https://tailwindcss.com/docs/transform-origin

  // https://tailwindcss.com/docs/scale
  // https://tailwindcss.com/docs/rotate
  // https://tailwindcss.com/docs/translate
  // https://tailwindcss.com/docs/skew
  // See dynamic.ts

  /**
   * ===========================================
   * Interactivity
   */

  // https://tailwindcss.com/docs/appearance
  'appearance-none': {
    '-webkit-appearance': 'none',
    '-moz-appearance': 'none',
    appearance: 'none',
  },

  // https://tailwindcss.com/docs/cursor
  // https://tailwindcss.com/docs/outline
  // See dynamic.ts

  // https://tailwindcss.com/docs/pointer-events
  'pointer-events-none': { 'pointer-events': 'none' },
  'pointer-events-auto': { 'pointer-events': 'auto' },

  // https://tailwindcss.com/docs/resize
  'resize-none': { resize: 'none' },
  'resize-y': { resize: 'vertical' },
  'resize-x': { resize: 'horizontal' },
  resize: { resize: 'both' },

  // https://tailwindcss.com/docs/user-select
  'select-none': {
    '-webkit-user-select': 'none',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',
    'user-select': 'none',
  },
  'select-text': {
    '-webkit-user-select': 'text',
    '-moz-user-select': 'text',
    '-ms-user-select': 'text',
    'user-select': 'text',
  },
  'select-all': {
    '-webkit-user-select': 'all',
    '-moz-user-select': 'all',
    '-ms-user-select': 'all',
    'user-select': 'all',
  },
  'select-auto': {
    '-webkit-user-select': 'auto',
    '-moz-user-select': 'auto',
    '-ms-user-select': 'auto',
    'user-select': 'auto',
  },

  /**
   * ===========================================
   * Svg
   */

  // https://tailwindcss.com/docs/fill
  // https://tailwindcss.com/docs/stroke
  // https://tailwindcss.com/docs/stroke-width
  'fill-current': { fill: 'currentColor' },
  'stroke-current': { stroke: 'currentColor' },
  // See dynamic.ts

  /**
   * ===========================================
   * Accessibility
   */

  // https://tailwindcss.com/docs/screen-readers
  'sr-only': {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    'white-space': 'nowrap',
    'border-width': '0',
  },
  'not-sr-only': {
    position: 'static',
    width: 'auto',
    height: 'auto',
    padding: '0',
    margin: '0',
    overflow: 'visible',
    clip: 'auto',
    'white-space': 'normal',
  },
};
