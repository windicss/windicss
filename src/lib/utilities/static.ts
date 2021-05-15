import type { StaticUtility } from '../../interfaces';

const fontVariants = {
  '--tw-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-numeric-figure': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-numeric-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-numeric-fraction': 'var(--tw-empty,/*!*/ /*!*/)',
  'font-variant-numeric': 'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)',
};

export const staticUtilities: StaticUtility = {
  // https://windicss.org/utilities/behaviors.html#box-decoration-break
  'decoration-slice': {
    'utility': {
      '-webkit-box-decoration-break': 'slice',
      'box-decoration-break': 'slice',
    },
    'meta': {
      'group': 'boxDecorationBreak',
      'order': 1,
    },
  },

  'decoration-clone': {
    'utility': {
      '-webkit-box-decoration-break': 'clone',
      'box-decoration-break': 'clone',
    },
    'meta': {
      'group': 'boxDecorationBreak',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/sizing.html#box-sizing
  'box-border': {
    'utility': {
      '-webkit-box-sizing': 'border-box',
      'box-sizing': 'border-box',
    },
    'meta': {
      'group': 'boxSizing',
      'order': 1,
    },
  },
  'box-content': {
    'utility': {
      '-webkit-box-sizing': 'content-box',
      'box-sizing': 'content-box',
    },
    'meta': {
      'group': 'boxSizing',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/display.html
  'block': {
    'utility': {
      'display': 'block',
    },
    'meta': {
      'group': 'display',
      'order': 1,
    },
  },
  'inline-block': {
    'utility': {
      'display': 'inline-block',
    },
    'meta': {
      'group': 'display',
      'order': 2,
    },
  },
  'inline': {
    'utility': {
      'display': 'inline',
    },
    'meta': {
      'group': 'display',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/flexbox.html
  'flex': {
    'utility': {
      'display': [
        '-webkit-box',
        '-ms-flexbox',
        '-webkit-flex',
        'flex',
      ],
    },
    'meta': {
      'group': 'display',
      'order': 4,
    },
  },
  'inline-flex': {
    'utility': {
      'display': [
        '-webkit-inline-box',
        '-ms-inline-flexbox',
        '-webkit-inline-flex',
        'inline-flex',
      ],
    },
    'meta': {
      'group': 'display',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/tables.html
  'table': {
    'utility': {
      'display': 'table',
    },
    'meta': {
      'group': 'display',
      'order': 6,
    },
  },
  'inline-table': {
    'utility': {
      'display': 'inline-table',
    },
    'meta': {
      'group': 'display',
      'order': 7,
    },
  },
  'table-caption': {
    'utility': {
      'display': 'table-caption',
    },
    'meta': {
      'group': 'display',
      'order': 8,
    },
  },
  'table-cell': {
    'utility': {
      'display': 'table-cell',
    },
    'meta': {
      'group': 'display',
      'order': 9,
    },
  },
  'table-column': {
    'utility': {
      'display': 'table-column',
    },
    'meta': {
      'group': 'display',
      'order': 10,
    },
  },
  'table-column-group': {
    'utility': {
      'display': 'table-column-group',
    },
    'meta': {
      'group': 'display',
      'order': 11,
    },
  },
  'table-footer-group': {
    'utility': {
      'display': 'table-footer-group',
    },
    'meta': {
      'group': 'display',
      'order': 12,
    },
  },
  'table-header-group': {
    'utility': {
      'display': 'table-header-group',
    },
    'meta': {
      'group': 'display',
      'order': 13,
    },
  },
  'table-row-group': {
    'utility': {
      'display': 'table-row-group',
    },
    'meta': {
      'group': 'display',
      'order': 14,
    },
  },
  'table-row': {
    'utility': {
      'display': 'table-row',
    },
    'meta': {
      'group': 'display',
      'order': 15,
    },
  },
  'flow-root': {
    'utility': {
      'display': 'flow-root',
    },
    'meta': {
      'group': 'display',
      'order': 16,
    },
  },

  // https://windicss.org/utilities/grid.html
  'grid': {
    'utility': {
      'display': [
        '-ms-grid',
        'grid',
      ],
    },
    'meta': {
      'group': 'display',
      'order': 17,
    },
  },
  'inline-grid': {
    'utility': {
      'display': [
        '-ms-inline-grid',
        'inline-grid',
      ],
    },
    'meta': {
      'group': 'display',
      'order': 18,
    },
  },
  'contents': {
    'utility': {
      'display': 'contents',
    },
    'meta': {
      'group': 'display',
      'order': 19,
    },
  },
  'list-item': {
    'utility': {
      'display': 'list-item',
    },
    'meta': {
      'group': 'display',
      'order': 20,
    },
  },
  'hidden': {
    'utility': {
      'display': 'none',
    },
    'meta': {
      'group': 'display',
      'order': 21,
    },
  },

  // https://windicss.org/utilities/positioning.html#floats
  'float-right': {
    'utility': {
      'float': 'right',
    },
    'meta': {
      'group': 'float',
      'order': 1,
    },
  },
  'float-left': {
    'utility': {
      'float': 'left',
    },
    'meta': {
      'group': 'float',
      'order': 2,
    },
  },
  'float-none': {
    'utility': {
      'float': 'none',
    },
    'meta': {
      'group': 'float',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/positioning.html#clear
  'clear-left': {
    'utility': {
      'clear': 'left',
    },
    'meta': {
      'group': 'clear',
      'order': 1,
    },
  },
  'clear-right': {
    'utility': {
      'clear': 'right',
    },
    'meta': {
      'group': 'clear',
      'order': 2,
    },
  },
  'clear-both': {
    'utility': {
      'clear': 'both',
    },
    'meta': {
      'group': 'clear',
      'order': 3,
    },
  },
  'clear-none': {
    'utility': {
      'clear': 'none',
    },
    'meta': {
      'group': 'clear',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/positioning.html#isolation
  'isolate': {
    'utility': {
      'isolation': 'isolate',
    },
    'meta': {
      'group': 'isolation',
      'order': 1,
    },
  },
  'isolation-auto': {
    'utility': {
      'isolation': 'auto',
    },
    'meta': {
      'group': 'isolation',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/positioning.html#object-fit
  'object-contain': {
    'utility': {
      '-o-object-fit': 'contain',
      'object-fit': 'contain',
    },
    'meta': {
      'group': 'objectFit',
      'order': 1,
    },
  },
  'object-cover': {
    'utility': {
      '-o-object-fit': 'cover',
      'object-fit': 'cover',
    },
    'meta': {
      'group': 'objectFit',
      'order': 2,
    },
  },
  'object-fill': {
    'utility': {
      '-o-object-fit': 'fill',
      'object-fit': 'fill',
    },
    'meta': {
      'group': 'objectFit',
      'order': 3,
    },
  },
  'object-none': {
    'utility': {
      '-o-object-fit': 'none',
      'object-fit': 'none',
    },
    'meta': {
      'group': 'objectFit',
      'order': 4,
    },
  },
  'object-scale-down': {
    'utility': {
      '-o-object-fit': 'scale-down',
      'object-fit': 'scale-down',
    },
    'meta': {
      'group': 'objectFit',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/behaviors.html#overflow
  'overflow-auto': {
    'utility': {
      'overflow': 'auto',
    },
    'meta': {
      'group': 'overflow',
      'order': 1,
    },
  },
  'overflow-hidden': {
    'utility': {
      'overflow': 'hidden',
    },
    'meta': {
      'group': 'overflow',
      'order': 2,
    },
  },
  'overflow-visible': {
    'utility': {
      'overflow': 'visible',
    },
    'meta': {
      'group': 'overflow',
      'order': 3,
    },
  },
  'overflow-scroll': {
    'utility': {
      'overflow': 'scroll',
    },
    'meta': {
      'group': 'overflow',
      'order': 4,
    },
  },
  'overflow-x-auto': {
    'utility': {
      'overflow-x': 'auto',
    },
    'meta': {
      'group': 'overflow',
      'order': 5,
    },
  },
  'overflow-y-auto': {
    'utility': {
      'overflow-y': 'auto',
    },
    'meta': {
      'group': 'overflow',
      'order': 6,
    },
  },
  'overflow-x-hidden': {
    'utility': {
      'overflow-x': 'hidden',
    },
    'meta': {
      'group': 'overflow',
      'order': 7,
    },
  },
  'overflow-y-hidden': {
    'utility': {
      'overflow-y': 'hidden',
    },
    'meta': {
      'group': 'overflow',
      'order': 8,
    },
  },
  'overflow-x-visible': {
    'utility': {
      'overflow-x': 'visible',
    },
    'meta': {
      'group': 'overflow',
      'order': 9,
    },
  },
  'overflow-y-visible': {
    'utility': {
      'overflow-y': 'visible',
    },
    'meta': {
      'group': 'overflow',
      'order': 10,
    },
  },
  'overflow-x-scroll': {
    'utility': {
      'overflow-x': 'scroll',
    },
    'meta': {
      'group': 'overflow',
      'order': 11,
    },
  },
  'overflow-y-scroll': {
    'utility': {
      'overflow-y': 'scroll',
    },
    'meta': {
      'group': 'overflow',
      'order': 12,
    },
  },

  // https://windicss.org/utilities/behaviors.html#overscroll-behavior
  'overscroll-auto': {
    'utility': {
      'overscroll-behavior': 'auto',
      '-ms-scroll-chaining': 'chained',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 1,
    },
  },
  'overscroll-contain': {
    'utility': {
      'overscroll-behavior': 'contain',
      '-ms-scroll-chaining': 'none',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 2,
    },
  },
  'overscroll-none': {
    'utility': {
      'overscroll-behavior': 'none',
      '-ms-scroll-chaining': 'none',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 3,
    },
  },
  'overscroll-y-auto': {
    'utility': {
      'overscroll-behavior-y': 'auto',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 4,
    },
  },
  'overscroll-y-contain': {
    'utility': {
      'overscroll-behavior-y': 'contain',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 5,
    },
  },
  'overscroll-y-none': {
    'utility': {
      'overscroll-behavior-y': 'none',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 6,
    },
  },
  'overscroll-x-auto': {
    'utility': {
      'overscroll-behavior-x': 'auto',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 7,
    },
  },
  'overscroll-x-contain': {
    'utility': {
      'overscroll-behavior-x': 'contain',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 8,
    },
  },
  'overscroll-x-none': {
    'utility': {
      'overscroll-behavior-x': 'none',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 9,
    },
  },

  // https://windicss.org/utilities/positioning.html#position
  'static': {
    'utility': {
      'position': 'static',
    },
    'meta': {
      'group': 'position',
      'order': 1,
    },
  },
  'fixed': {
    'utility': {
      'position': 'fixed',
    },
    'meta': {
      'group': 'position',
      'order': 2,
    },
  },
  'absolute': {
    'utility': {
      'position': 'absolute',
    },
    'meta': {
      'group': 'position',
      'order': 3,
    },
  },
  'relative': {
    'utility': {
      'position': 'relative',
    },
    'meta': {
      'group': 'position',
      'order': 4,
    },
  },
  'sticky': {
    'utility': {
      'position': [
        'sticky',
        '-webkit-sticky',
      ],
    },
    'meta': {
      'group': 'position',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/display.html#visibility
  'visible': {
    'utility': {
      'visibility': 'visible',
    },
    'meta': {
      'group': 'visibility',
      'order': 1,
    },
  },
  'invisible': {
    'utility': {
      'visibility': 'hidden',
    },
    'meta': {
      'group': 'visibility',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/display.html#backface-visibility
  'backface-visible': {
    'utility': {
      '-webkit-backface-visibility': 'visible',
      'backface-visibility': 'visible',
    },
    'meta': {
      'group': 'backfaceVisibility',
      'order': 1,
    },
  },
  'backface-hidden': {
    'utility': {
      '-webkit-backface-visibility': 'hidden',
      'backface-visibility': 'hidden',
    },
    'meta': {
      'group': 'backfaceVisibility',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/flexbox.html#flex-direction
  'flex-row': {
    'utility': {
      '-webkit-box-orient': 'horizontal',
      '-webkit-box-direction': 'normal',
      '-ms-flex-direction': 'row',
      '-webkit-flex-direction': 'row',
      'flex-direction': 'row',
    },
    'meta': {
      'group': 'flexDirection',
      'order': 1,
    },
  },
  'flex-row-reverse': {
    'utility': {
      '-webkit-box-orient': 'horizontal',
      '-webkit-box-direction': 'reverse',
      '-ms-flex-direction': 'row-reverse',
      '-webkit-flex-direction': 'row-reverse',
      'flex-direction': 'row-reverse',
    },
    'meta': {
      'group': 'flexDirection',
      'order': 2,
    },
  },
  'flex-col': {
    'utility': {
      '-webkit-box-orient': 'vertical',
      '-webkit-box-direction': 'normal',
      '-ms-flex-direction': 'column',
      '-webkit-flex-direction': 'column',
      'flex-direction': 'column',
    },
    'meta': {
      'group': 'flexDirection',
      'order': 3,
    },
  },
  'flex-col-reverse': {
    'utility': {
      '-webkit-box-orient': 'vertical',
      '-webkit-box-direction': 'reverse',
      '-ms-flex-direction': 'column-reverse',
      '-webkit-flex-direction': 'column-reverse',
      'flex-direction': 'column-reverse',
    },
    'meta': {
      'group': 'flexDirection',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/flexbox.html#flex-wrap
  'flex-wrap': {
    'utility': {
      '-ms-flex-wrap': 'wrap',
      '-webkit-flex-wrap': 'wrap',
      'flex-wrap': 'wrap',
    },
    'meta': {
      'group': 'flexWrap',
      'order': 1,
    },
  },
  'flex-wrap-reverse': {
    'utility': {
      '-ms-flex-wrap': 'wrap-reverse',
      '-webkit-flex-wrap': 'wrap-reverse',
      'flex-wrap': 'wrap-reverse',
    },
    'meta': {
      'group': 'flexWrap',
      'order': 2,
    },
  },
  'flex-nowrap': {
    'utility': {
      '-ms-flex-wrap': 'nowrap',
      '-webkit-flex-wrap': 'nowrap',
      'flex-wrap': 'nowrap',
    },
    'meta': {
      'group': 'flexWrap',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/grid.html#grid-column-span
  'col-auto': {
    'utility': {
      'grid-column': 'auto',
    },
    'meta': {
      'group': 'gridColumn',
      'order': 1,
    },
  },

  // https://windicss.org/utilities/grid.html#grid-row-span
  'row-auto': {
    'utility': {
      'grid-row': 'auto',
    },
    'meta': {
      'group': 'gridRow',
      'order': 1,
    },
  },

  // https://windicss.org/utilities/grid.html#grid-auto-flow
  'grid-flow-row': {
    'utility': {
      'grid-auto-flow': 'row',
    },
    'meta': {
      'group': 'gridAutoFlow',
      'order': 1,
    },
  },
  'grid-flow-col': {
    'utility': {
      'grid-auto-flow': 'column',
    },
    'meta': {
      'group': 'gridAutoFlow',
      'order': 2,
    },
  },
  'grid-flow-row-dense': {
    'utility': {
      'grid-auto-flow': 'row dense',
    },
    'meta': {
      'group': 'gridAutoFlow',
      'order': 3,
    },
  },
  'grid-flow-col-dense': {
    'utility': {
      'grid-auto-flow': 'col dense',
    },
    'meta': {
      'group': 'gridAutoFlow',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/positioning.html#justify-content
  'justify-start': {
    'utility': {
      '-webkit-box-pack': 'start',
      '-ms-flex-pack': 'start',
      '-webkit-justify-content': 'flex-start',
      'justify-content': 'flex-start',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 1,
    },
  },
  'justify-end': {
    'utility': {
      '-webkit-box-pack': 'end',
      '-ms-flex-pack': 'end',
      '-webkit-justify-content': 'flex-end',
      'justify-content': 'flex-end',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 2,
    },
  },
  'justify-center': {
    'utility': {
      '-webkit-box-pack': 'center',
      '-ms-flex-pack': 'center',
      '-webkit-justify-content': 'center',
      'justify-content': 'center',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 3,
    },
  },
  'justify-between': {
    'utility': {
      '-webkit-box-pack': 'justify',
      '-ms-flex-pack': 'justify',
      '-webkit-justify-content': 'space-between',
      'justify-content': 'space-between',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 4,
    },
  },
  'justify-around': {
    'utility': {
      '-ms-flex-pack': 'distribute',
      '-webkit-justify-content': 'space-around',
      'justify-content': 'space-around',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 5,
    },
  },
  'justify-evenly': {
    'utility': {
      '-webkit-box-pack': 'space-evenly',
      '-ms-flex-pack': 'space-evenly',
      '-webkit-justify-content': 'space-evenly',
      'justify-content': 'space-evenly',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 6,
    },
  },

  // https://windicss.org/utilities/positioning.html#justify-items
  'justify-items-auto': {
    'utility': {
      'justify-items': 'auto',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 1,
    },
  },
  'justify-items-start': {
    'utility': {
      'justify-items': 'start',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 2,
    },
  },
  'justify-items-end': {
    'utility': {
      'justify-items': 'end',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 3,
    },
  },
  'justify-items-center': {
    'utility': {
      'justify-items': 'center',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 4,
    },
  },
  'justify-items-stretch': {
    'utility': {
      'justify-items': 'stretch',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/positioning.html#justify-self
  'justify-self-auto': {
    'utility': {
      '-ms-grid-column-align': 'auto',
      'justify-self': 'auto',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 1,
    },
  },
  'justify-self-start': {
    'utility': {
      '-ms-grid-column-align': 'start',
      'justify-self': 'start',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 2,
    },
  },
  'justify-self-end': {
    'utility': {
      '-ms-grid-column-align': 'end',
      'justify-self': 'end',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 3,
    },
  },
  'justify-self-center': {
    'utility': {
      '-ms-grid-column-align': 'center',
      'justify-self': 'center',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 4,
    },
  },
  'justify-self-stretch': {
    'utility': {
      '-ms-grid-column-align': 'stretch',
      'justify-self': 'stretch',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/positioning.html#align-content
  'content-center': {
    'utility': {
      '-ms-flex-line-pack': 'center',
      '-webkit-align-content': 'center',
      'align-content': 'center',
    },
    'meta': {
      'group': 'alignContent',
      'order': 1,
    },
  },
  'content-start': {
    'utility': {
      '-ms-flex-line-pack': 'start',
      '-webkit-align-content': 'flex-start',
      'align-content': 'flex-start',
    },
    'meta': {
      'group': 'alignContent',
      'order': 2,
    },
  },
  'content-end': {
    'utility': {
      '-ms-flex-line-pack': 'end',
      '-webkit-align-content': 'flex-end',
      'align-content': 'flex-end',
    },
    'meta': {
      'group': 'alignContent',
      'order': 3,
    },
  },
  'content-between': {
    'utility': {
      '-ms-flex-line-pack': 'justify',
      '-webkit-align-content': 'space-between',
      'align-content': 'space-between',
    },
    'meta': {
      'group': 'alignContent',
      'order': 4,
    },
  },
  'content-around': {
    'utility': {
      '-ms-flex-line-pack': 'distribute',
      '-webkit-align-content': 'space-around',
      'align-content': 'space-around',
    },
    'meta': {
      'group': 'alignContent',
      'order': 5,
    },
  },
  'content-evenly': {
    'utility': {
      '-ms-flex-line-pack': 'space-evenly',
      '-webkit-align-content': 'space-evenly',
      'align-content': 'space-evenly',
    },
    'meta': {
      'group': 'alignContent',
      'order': 6,
    },
  },

  // https://windicss.org/utilities/positioning.html#align-items
  'items-start': {
    'utility': {
      '-webkit-box-align': 'start',
      '-ms-flex-align': 'start',
      '-webkit-align-items': 'flex-start',
      'align-items': 'flex-start',
    },
    'meta': {
      'group': 'alignItems',
      'order': 1,
    },
  },
  'items-end': {
    'utility': {
      '-webkit-box-align': 'end',
      '-ms-flex-align': 'end',
      '-webkit-align-items': 'flex-end',
      'align-items': 'flex-end',
    },
    'meta': {
      'group': 'alignItems',
      'order': 2,
    },
  },
  'items-center': {
    'utility': {
      '-webkit-box-align': 'center',
      '-ms-flex-align': 'center',
      '-webkit-align-items': 'center',
      'align-items': 'center',
    },
    'meta': {
      'group': 'alignItems',
      'order': 3,
    },
  },
  'items-baseline': {
    'utility': {
      '-webkit-box-align': 'baseline',
      '-ms-flex-align': 'baseline',
      '-webkit-align-items': 'baseline',
      'align-items': 'baseline',
    },
    'meta': {
      'group': 'alignItems',
      'order': 4,
    },
  },
  'items-stretch': {
    'utility': {
      '-webkit-box-align': 'stretch',
      '-ms-flex-align': 'stretch',
      '-webkit-align-items': 'stretch',
      'align-items': 'stretch',
    },
    'meta': {
      'group': 'alignItems',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/positioning.html#align-self
  'self-auto': {
    'utility': {
      '-ms-flex-item-align': 'auto',
      '-ms-grid-row-align': 'auto',
      '-webkit-align-self': 'auto',
      'align-self': 'auto',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 1,
    },
  },
  'self-start': {
    'utility': {
      '-ms-flex-item-align': 'start',
      '-webkit-align-self': 'flex-start',
      'align-self': 'flex-start',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 2,
    },
  },
  'self-end': {
    'utility': {
      '-ms-flex-item-align': 'end',
      '-webkit-align-self': 'flex-end',
      'align-self': 'flex-end',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 3,
    },
  },
  'self-center': {
    'utility': {
      '-ms-flex-item-align': 'center',
      '-ms-grid-row-align': 'center',
      '-webkit-align-self': 'center',
      'align-self': 'center',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 4,
    },
  },
  'self-stretch': {
    'utility': {
      '-ms-flex-item-align': 'stretch',
      '-ms-grid-row-align': 'stretch',
      '-webkit-align-self': 'stretch',
      'align-self': 'stretch',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/positioning.html#place-content
  'place-content-center': {
    'utility': {
      'place-content': 'center',
    },
    'meta': {
      'group': 'placeContent',
      'order': 1,
    },
  },
  'place-content-start': {
    'utility': {
      'place-content': 'start',
    },
    'meta': {
      'group': 'placeContent',
      'order': 2,
    },
  },
  'place-content-end': {
    'utility': {
      'place-content': 'end',
    },
    'meta': {
      'group': 'placeContent',
      'order': 3,
    },
  },
  'place-content-between': {
    'utility': {
      'place-content': 'space-between',
    },
    'meta': {
      'group': 'placeContent',
      'order': 4,
    },
  },
  'place-content-around': {
    'utility': {
      'place-content': 'space-around',
    },
    'meta': {
      'group': 'placeContent',
      'order': 5,
    },
  },
  'place-content-evenly': {
    'utility': {
      'place-content': 'space-evenly',
    },
    'meta': {
      'group': 'placeContent',
      'order': 6,
    },
  },
  'place-content-stretch': {
    'utility': {
      'place-content': 'stretch',
    },
    'meta': {
      'group': 'placeContent',
      'order': 7,
    },
  },

  // https://windicss.org/utilities/positioning.html#place-items
  'place-items-auto': {
    'utility': {
      'place-items': 'auto',
    },
    'meta': {
      'group': 'placeItems',
      'order': 1,
    },
  },
  'place-items-start': {
    'utility': {
      'place-items': 'start',
    },
    'meta': {
      'group': 'placeItems',
      'order': 2,
    },
  },
  'place-items-end': {
    'utility': {
      'place-items': 'end',
    },
    'meta': {
      'group': 'placeItems',
      'order': 3,
    },
  },
  'place-items-center': {
    'utility': {
      'place-items': 'center',
    },
    'meta': {
      'group': 'placeItems',
      'order': 4,
    },
  },
  'place-items-stretch': {
    'utility': {
      'place-items': 'stretch',
    },
    'meta': {
      'group': 'placeItems',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/positioning.html#place-self
  'place-self-auto': {
    'utility': {
      '-ms-grid-row-align': 'auto',
      '-ms-grid-column-align': 'auto',
      'place-self': 'auto',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 1,
    },
  },
  'place-self-start': {
    'utility': {
      '-ms-grid-row-align': 'start',
      '-ms-grid-column-align': 'start',
      'place-self': 'start',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 2,
    },
  },
  'place-self-end': {
    'utility': {
      '-ms-grid-row-align': 'end',
      '-ms-grid-column-align': 'end',
      'place-self': 'end',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 3,
    },
  },
  'place-self-center': {
    'utility': {
      '-ms-grid-row-align': 'center',
      '-ms-grid-column-align': 'center',
      'place-self': 'center',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 4,
    },
  },
  'place-self-stretch': {
    'utility': {
      '-ms-grid-row-align': 'stretch',
      '-ms-grid-column-align': 'stretch',
      'place-self': 'stretch',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/typography.html#font-smoothing
  'antialiased': {
    'utility': {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
    'meta': {
      'group': 'fontSmoothing',
      'order': 1,
    },
  },
  'subpixel-antialiased': {
    'utility': {
      '-webkit-font-smoothing': 'auto',
      '-moz-osx-font-smoothing': 'auto',
    },
    'meta': {
      'group': 'fontSmoothing',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/typography.html#font-style
  'italic': {
    'utility': {
      'font-style': 'italic',
    },
    'meta': {
      'group': 'fontStyle',
      'order': 1,
    },
  },
  'not-italic': {
    'utility': {
      'font-style': 'normal',
    },
    'meta': {
      'group': 'fontStyle',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/typography.html#font-variant-numeric
  'normal-nums': {
    'utility': {
      'font-variant-numeric': 'normal',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 1,
    },
  },
  'ordinal': {
    'utility': {
      ...fontVariants,
      '--tw-ordinal': 'ordinal',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 2,
    },
  },
  'slashed-zero': {
    'utility': {
      ...fontVariants,
      '--tw-slashed-zero': 'slashed-zero',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 3,
    },
  },
  'lining-nums': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-figure': 'lining-nums',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 4,
    },
  },
  'oldstyle-nums': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-figure': 'oldstyle-nums',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 5,
    },
  },
  'proportional-nums': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-spacing': 'proportional-nums',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 6,
    },
  },
  'tabular-nums': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-spacing': 'tabular-nums',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 7,
    },
  },
  'diagonal-fractions': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-fraction': 'diagonal-fractions',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 8,
    },
  },
  'stacked-fractions': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-fraction': 'stacked-fractions',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 9,
    },
  },

  // https://windicss.org/utilities/behaviors.html#list-style-position
  'list-inside': {
    'utility': {
      'list-style-position': 'inside',
    },
    'meta': {
      'group': 'listStylePosition',
      'order': 1,
    },
  },
  'list-outside': {
    'utility': {
      'list-style-position': 'outside',
    },
    'meta': {
      'group': 'listStylePosition',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/typography.html#text-alignment
  'text-left': {
    'utility': {
      'text-align': 'left',
    },
    'meta': {
      'group': 'textAlign',
      'order': 1,
    },
  },
  'text-center': {
    'utility': {
      'text-align': 'center',
    },
    'meta': {
      'group': 'textAlign',
      'order': 2,
    },
  },
  'text-right': {
    'utility': {
      'text-align': 'right',
    },
    'meta': {
      'group': 'textAlign',
      'order': 3,
    },
  },
  'text-justify': {
    'utility': {
      'text-align': 'justify',
    },
    'meta': {
      'group': 'textAlign',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/typography.html#text-decoration
  'underline': {
    'utility': {
      '-webkit-text-decoration-line': 'underline',
      'text-decoration-line': 'underline',
    },
    'meta': {
      'group': 'textDecoration',
      'order': 1,
    },
  },
  'line-through': {
    'utility': {
      '-webkit-text-decoration-line': 'line-through',
      'text-decoration-line': 'line-through',
    },
    'meta': {
      'group': 'textDecoration',
      'order': 2,
    },
  },
  'no-underline': {
    'utility': {
      'text-decoration': 'none',
    },
    'meta': {
      'group': 'textDecoration',
      'order': 3,
    },
  },

  // http://localhost:3001/utilities/typography.html#text-decoration-style
  'underline-solid': {
    'utility': {
      '-webkit-text-decoration-style': 'solid',
      'text-decoration-style': 'solid',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 1,
    },
  },
  'underline-double': {
    'utility': {
      '-webkit-text-decoration-style': 'double',
      'text-decoration-style': 'double',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 2,
    },
  },
  'underline-dotted': {
    'utility': {
      '-webkit-text-decoration-style': 'dotted',
      'text-decoration-style': 'dotted',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 3,
    },
  },
  'underline-dashed': {
    'utility': {
      '-webkit-text-decoration-style': 'dashed',
      'text-decoration-style': 'dashed',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/typography.html#text-transform
  'uppercase': {
    'utility': {
      'text-transform': 'uppercase',
    },
    'meta': {
      'group': 'textTransform',
      'order': 1,
    },
  },
  'lowercase': {
    'utility': {
      'text-transform': 'lowercase',
    },
    'meta': {
      'group': 'textTransform',
      'order': 2,
    },
  },
  'capitalize': {
    'utility': {
      'text-transform': 'capitalize',
    },
    'meta': {
      'group': 'textTransform',
      'order': 3,
    },
  },
  'normal-case': {
    'utility': {
      'text-transform': 'none',
    },
    'meta': {
      'group': 'textTransform',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/typography.html#text-overflow
  'truncate': {
    'utility': {
      'overflow': 'hidden',
      '-o-text-overflow': 'ellipsis',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
    'meta': {
      'group': 'textOverflow',
      'order': 1,
    },
  },
  'overflow-ellipsis': {
    'utility': {
      '-o-text-overflow': 'ellipsis',
      'text-overflow': 'ellipsis',
    },
    'meta': {
      'group': 'textOverflow',
      'order': 2,
    },
  },
  'overflow-clip': {
    'utility': {
      '-o-text-overflow': 'clip',
      'text-overflow': 'clip',
    },
    'meta': {
      'group': 'textOverflow',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/typography.html#vertical-alignment
  'align-baseline': {
    'utility': {
      'vertical-align': 'baseline',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 1,
    },
  },
  'align-top': {
    'utility': {
      'vertical-align': 'top',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 2,
    },
  },
  'align-middle': {
    'utility': {
      'vertical-align': 'middle',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 3,
    },
  },
  'align-bottom': {
    'utility': {
      'vertical-align': 'bottom',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 4,
    },
  },
  'align-text-top': {
    'utility': {
      'vertical-align': 'text-top',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 5,
    },
  },
  'align-text-bottom': {
    'utility': {
      'vertical-align': 'text-bottom',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 6,
    },
  },

  // https://windicss.org/utilities/typography.html#whitespace
  'whitespace-normal': {
    'utility': {
      'white-space': 'normal',
    },
    'meta': {
      'group': 'whitespace',
      'order': 1,
    },
  },
  'whitespace-nowrap': {
    'utility': {
      'white-space': 'nowrap',
    },
    'meta': {
      'group': 'whitespace',
      'order': 2,
    },
  },
  'whitespace-pre': {
    'utility': {
      'white-space': 'pre',
    },
    'meta': {
      'group': 'whitespace',
      'order': 3,
    },
  },
  'whitespace-pre-line': {
    'utility': {
      'white-space': 'pre-line',
    },
    'meta': {
      'group': 'whitespace',
      'order': 4,
    },
  },
  'whitespace-pre-wrap': {
    'utility': {
      'white-space': 'pre-wrap',
    },
    'meta': {
      'group': 'whitespace',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/typography.html#word-break
  'break-normal': {
    'utility': {
      'word-break': 'normal',
      'overflow-wrap': 'normal',
    },
    'meta': {
      'group': 'wordBreak',
      'order': 1,
    },
  },
  'break-words': {
    'utility': {
      'overflow-wrap': 'break-word',
    },
    'meta': {
      'group': 'wordBreak',
      'order': 2,
    },
  },
  'break-all': {
    'utility': {
      'word-break': 'break-all',
    },
    'meta': {
      'group': 'wordBreak',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/typography.html#writing-mode
  'write-normal': {
    'utility': {
      '-webkit-writing-mode': 'horizontal-tb',
      '-ms-writing-mode': 'lr-tb',
      'writing-mode': 'horizontal-tb',
    },
    'meta': {
      'group': 'writingMode',
      'order': 1,
    },
  },

  'write-vertical-right': {
    'utility': {
      '-webkit-writing-mode': 'vertical-rl',
      '-ms-writing-mode': 'tb-rl',
      'writing-mode': 'vertical-rl',
    },
    'meta': {
      'group': 'writingMode',
      'order': 2,
    },
  },

  'write-vertical-left': {
    'utility': {
      '-webkit-writing-mode': 'vertical-lr',
      '-ms-writing-mode': 'tb-lr',
      'writing-mode': 'vertical-lr',
    },
    'meta': {
      'group': 'writingMode',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/typography.html#writing-orientation
  'write-orient-mixed': {
    'utility': {
      '-webkit-text-orientation': 'mixed',
      'text-orientation': 'mixed',
    },
    'meta': {
      'group': 'writingMode',
      'order': 4,
    },
  },

  'write-orient-upright': {
    'utility': {
      '-webkit-text-orientation': 'upright',
      'text-orientation': 'upright',
    },
    'meta': {
      'group': 'writingMode',
      'order': 5,
    },
  },

  'write-orient-sideways': {
    'utility': {
      '-webkit-text-orientation': 'sideways',
      'text-orientation': 'sideways',
    },
    'meta': {
      'group': 'writingMode',
      'order': 6,
    },
  },

  // https://windicss.org/utilities/typography.html#hyphens
  'hyphens-none': {
    'utility': {
      '-webkit-hyphens': 'none',
      '-ms-hyphens': 'none',
      'hyphens': 'none',
    },
    'meta': {
      'group': 'hyphens',
      'order': 1,
    },
  },
  'hyphens-manual': {
    'utility': {
      '-webkit-hyphens': 'manual',
      '-ms-hyphens': 'manual',
      'hyphens': 'manual',
    },
    'meta': {
      'group': 'hyphens',
      'order': 2,
    },
  },
  'hyphens-auto': {
    'utility': {
      '-webkit-hyphens': 'auto',
      '-ms-hyphens': 'auto',
      'hyphens': 'auto',
    },
    'meta': {
      'group': 'hyphens',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/backgrounds.html#background-attachment
  'bg-fixed': {
    'utility': {
      'background-attachment': 'fixed',
    },
    'meta': {
      'group': 'backgroundAttachment',
      'order': 1,
    },
  },
  'bg-local': {
    'utility': {
      'background-attachment': 'local',
    },
    'meta': {
      'group': 'backgroundAttachment',
      'order': 2,
    },
  },
  'bg-scroll': {
    'utility': {
      'background-attachment': 'scroll',
    },
    'meta': {
      'group': 'backgroundAttachment',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/backgrounds.html#background-clip
  'bg-clip-border': {
    'utility': {
      '-webkit-background-clip': 'border-box',
      'background-clip': 'border-box',
    },
    'meta': {
      'group': 'backgroundClip',
      'order': 1,
    },
  },
  'bg-clip-padding': {
    'utility': {
      '-webkit-background-clip': 'padding-box',
      'background-clip': 'padding-box',
    },
    'meta': {
      'group': 'backgroundClip',
      'order': 2,
    },
  },
  'bg-clip-content': {
    'utility': {
      '-webkit-background-clip': 'content-box',
      'background-clip': 'content-box',
    },
    'meta': {
      'group': 'backgroundClip',
      'order': 3,
    },
  },
  'bg-clip-text': {
    'utility': {
      '-webkit-background-clip': 'text',
      'background-clip': 'text',
    },
    'meta': {
      'group': 'backgroundClip',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/backgrounds.html#background-repeat
  'bg-repeat': {
    'utility': {
      'background-repeat': 'repeat',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 1,
    },
  },
  'bg-no-repeat': {
    'utility': {
      'background-repeat': 'no-repeat',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 2,
    },
  },
  'bg-repeat-x': {
    'utility': {
      'background-repeat': 'repeat-x',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 3,
    },
  },
  'bg-repeat-y': {
    'utility': {
      'background-repeat': 'repeat-y',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 4,
    },
  },
  'bg-repeat-round': {
    'utility': {
      'background-repeat': 'round',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 5,
    },
  },
  'bg-repeat-space': {
    'utility': {
      'background-repeat': 'space',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 6,
    },
  },

  // https://windicss.org/utilities/backgrounds.html#background-origin
  'bg-origin-border': {
    'utility': {
      'background-origin': 'border-box',
    },
    'meta': {
      'group': 'backgroundOrigin',
      'order': 1,
    },
  },
  'bg-origin-padding': {
    'utility': {
      'background-origin': 'padding-box',
    },
    'meta': {
      'group': 'backgroundOrigin',
      'order': 2,
    },
  },
  'bg-origin-content': {
    'utility': {
      'background-origin': 'content-box',
    },
    'meta': {
      'group': 'backgroundOrigin',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/borders.html#border-style
  'border-solid': {
    'utility': {
      'border-style': 'solid',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 1,
    },
  },
  'border-dashed': {
    'utility': {
      'border-style': 'dashed',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 2,
    },
  },
  'border-dotted': {
    'utility': {
      'border-style': 'dotted',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 3,
    },
  },
  'border-double': {
    'utility': {
      'border-style': 'double',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 4,
    },
  },
  'border-none': {
    'utility': {
      'border-style': 'none',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/behaviors.html#image-rendering
  'image-render-auto': {
    'utility': {
      'image-rendering': 'auto',
    },
    'meta': {
      'group': 'imageRendering',
      'order': 1,
    },
  },
  'image-render-pixel': {
    'utility': {
      '-ms-interpolation-mode': 'nearest-neighbor',
      'image-rendering': ['-webkit-optimize-contrast', '-moz-crisp-edges', '-o-pixelated', 'pixelated'],
    },
    'meta': {
      'group': 'imageRendering',
      'order': 2,
    },
  },
  'image-render-edge': {
    'utility': {
      'image-rendering': 'crisp-edges',
    },
    'meta': {
      'group': 'imageRendering',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/effects.html#mix-blend-mode
  'mix-blend-normal': {
    'utility': {
      'mix-blend-mode': 'normal',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 1,
    },
  },
  'mix-blend-multiply': {
    'utility': {
      'mix-blend-mode': 'multiply',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 2,
    },
  },
  'mix-blend-screen': {
    'utility': {
      'mix-blend-mode': 'screen',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 3,
    },
  },
  'mix-blend-overlay': {
    'utility': {
      'mix-blend-mode': 'overlay',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 4,
    },
  },
  'mix-blend-darken': {
    'utility': {
      'mix-blend-mode': 'darken',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 5,
    },
  },
  'mix-blend-lighten': {
    'utility': {
      'mix-blend-mode': 'lighten',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 6,
    },
  },
  'mix-blend-color-dodge': {
    'utility': {
      'mix-blend-mode': 'color-dodge',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 7,
    },
  },
  'mix-blend-color-burn': {
    'utility': {
      'mix-blend-mode': 'color-burn',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 8,
    },
  },
  'mix-blend-hard-light': {
    'utility': {
      'mix-blend-mode': 'hard-light',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 9,
    },
  },
  'mix-blend-soft-light': {
    'utility': {
      'mix-blend-mode': 'soft-light',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 10,
    },
  },
  'mix-blend-difference': {
    'utility': {
      'mix-blend-mode': 'difference',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 11,
    },
  },
  'mix-blend-exclusion': {
    'utility': {
      'mix-blend-mode': 'exclusion',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 12,
    },
  },
  'mix-blend-hue': {
    'utility': {
      'mix-blend-mode': 'hue',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 13,
    },
  },
  'mix-blend-saturation': {
    'utility': {
      'mix-blend-mode': 'saturation',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 14,
    },
  },
  'mix-blend-color': {
    'utility': {
      'mix-blend-mode': 'color',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 15,
    },
  },
  'mix-blend-luminosity': {
    'utility': {
      'mix-blend-mode': 'luminosity',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 16,
    },
  },
  // https://windicss.org/utilities/backgrounds.html#background-blend-mode
  'bg-blend-normal': {
    'utility': {
      'background-blend-mode': 'normal',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 1,
    },
  },
  'bg-blend-multiply': {
    'utility': {
      'background-blend-mode': 'multiply',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 2,
    },
  },
  'bg-blend-screen': {
    'utility': {
      'background-blend-mode': 'screen',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 3,
    },
  },
  'bg-blend-overlay': {
    'utility': {
      'background-blend-mode': 'overlay',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 4,
    },
  },
  'bg-blend-darken': {
    'utility': {
      'background-blend-mode': 'darken',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 5,
    },
  },
  'bg-blend-lighten': {
    'utility': {
      'background-blend-mode': 'lighten',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 6,
    },
  },
  'bg-blend-color-dodge': {
    'utility': {
      'background-blend-mode': 'color-dodge',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 7,
    },
  },
  'bg-blend-color-burn': {
    'utility': {
      'background-blend-mode': 'color-burn',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 8,
    },
  },
  'bg-blend-hard-light': {
    'utility': {
      'background-blend-mode': 'hard-light',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 9,
    },
  },
  'bg-blend-soft-light': {
    'utility': {
      'background-blend-mode': 'soft-light',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 10,
    },
  },
  'bg-blend-difference': {
    'utility': {
      'background-blend-mode': 'difference',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 11,
    },
  },
  'bg-blend-exclusion': {
    'utility': {
      'background-blend-mode': 'exclusion',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 12,
    },
  },
  'bg-blend-hue': {
    'utility': {
      'background-blend-mode': 'hue',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 13,
    },
  },
  'bg-blend-saturation': {
    'utility': {
      'background-blend-mode': 'saturation',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 14,
    },
  },
  'bg-blend-color': {
    'utility': {
      'background-blend-mode': 'color',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 15,
    },
  },
  'bg-blend-luminosity': {
    'utility': {
      'background-blend-mode': 'luminosity',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 16,
    },
  },

  // https://windicss.org/utilities/filters.html#filter
  'filter': {
    'utility': {
      '--tw-blur': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-invert': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-drop-shadow': 'var(--tw-empty,/*!*/ /*!*/)',
      '-webkit-filter': 'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)',
      'filter': 'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)',
    },
    'meta': {
      'group': 'filter',
      'order': 1,
    },
  },

  'filter-none': {
    'utility': {
      '-webkit-filter': 'none',
      'filter': 'none',
    },
    'meta': {
      'group': 'filter',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/filters.html#backdrop-filter
  'backdrop-filter': {
    'utility': {
      '--tw-backdrop-blur': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-invert': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-opacity': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
      '-webkit-backdrop-filter': 'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)',
      'backdrop-filter': 'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)',
    },
    'meta': {
      'group': 'backdropFilter',
      'order': 1,
    },
  },

  'backdrop-filter-none': {
    'utility': {
      '-webkit-backdrop-filter': 'none',
      'backdrop-filter': 'none',
    },
    'meta': {
      'group': 'backdropFilter',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/tables.html#table-border-collapse
  'border-collapse': {
    'utility': {
      'border-collapse': 'collapse',
    },
    'meta': {
      'group': 'borderCollapse',
      'order': 1,
    },
  },
  'border-separate': {
    'utility': {
      'border-collapse': 'separate',
    },
    'meta': {
      'group': 'borderCollapse',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/tables.html#table-caption-side
  'caption-top': {
    'utility': {
      'caption-side': 'top',
    },
    'meta': {
      'group': 'captionSide',
      'order': 1,
    },
  },

  'caption-bottom': {
    'utility': {
      'caption-side': 'bottom',
    },
    'meta': {
      'group': 'captionSide',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/tables.html#table-empty-cells
  'empty-cells-visible': {
    'utility': {
      'empty-cells': 'show',
    },
    'meta': {
      'group': 'emptyCells',
      'order': 1,
    },
  },

  'empty-cells-hidden': {
    'utility': {
      'empty-cells': 'hide',
    },
    'meta': {
      'group': 'emptyCells',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/tables.html#table-layout
  'table-auto': {
    'utility': {
      'table-layout': 'auto',
    },
    'meta': {
      'group': 'tableLayout',
      'order': 1,
    },
  },
  'table-fixed': {
    'utility': {
      'table-layout': 'fixed',
    },
    'meta': {
      'group': 'tableLayout',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/transforms.html
  'transform': {
    'utility': {
      '--tw-rotate': '0',
      '--tw-rotate-x': '0',
      '--tw-rotate-y': '0',
      '--tw-rotate-z': '0',
      '--tw-scale-x': '1',
      '--tw-scale-y': '1',
      '--tw-scale-z': '1',
      '--tw-skew-x': '0',
      '--tw-skew-y': '0',
      '--tw-translate-x': '0',
      '--tw-translate-y': '0',
      '--tw-translate-z': '0',
      '-webkit-transform': 'rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))',
      '-ms-transform': 'rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))',
      'transform': 'rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))',
    },
    'meta': {
      'group': 'transform',
      'order': 1,
    },
  },
  'transform-gpu': {
    'utility': {
      '--tw-rotate': '0',
      '--tw-rotate-x': '0',
      '--tw-rotate-y': '0',
      '--tw-rotate-z': '0',
      '--tw-scale-x': '1',
      '--tw-scale-y': '1',
      '--tw-scale-z': '1',
      '--tw-skew-x': '0',
      '--tw-skew-y': '0',
      '--tw-translate-x': '0',
      '--tw-translate-y': '0',
      '--tw-translate-z': '0',
      '-webkit-transform': 'rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z))',
      '-ms-transform': 'rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z))',
      'transform': 'rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z))',
    },
    'meta': {
      'group': 'transform',
      'order': 2,
    },
  },
  'transform-none': {
    'utility': {
      '-webkit-transform': 'none',
      '-ms-transform': 'none',
      'transform': 'none',
    },
    'meta': {
      'group': 'transform',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/transforms.html#transform-type
  'preserve-flat': {
    'utility': {
      '-webkit-transform-style': 'flat',
      'transform-style': 'flat',
    },
    'meta': {
      'group': 'transform',
      'order': 4,
    },
  },

  'preserve-3d': {
    'utility': {
      '-webkit-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
    'meta': {
      'group': 'transform',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/behaviors.html#appearance
  'appearance-none': {
    'utility': {
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      'appearance': 'none',
    },
    'meta': {
      'group': 'appearance',
      'order': 1,
    },
  },

  // https://windicss.org/utilities/behaviors.html#pointer-events
  'pointer-events-none': {
    'utility': {
      'pointer-events': 'none',
    },
    'meta': {
      'group': 'pointerEvents',
      'order': 1,
    },
  },
  'pointer-events-auto': {
    'utility': {
      'pointer-events': 'auto',
    },
    'meta': {
      'group': 'pointerEvents',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/behaviors.html#resize
  'resize-none': {
    'utility': {
      'resize': 'none',
    },
    'meta': {
      'group': 'resize',
      'order': 1,
    },
  },
  'resize-y': {
    'utility': {
      'resize': 'vertical',
    },
    'meta': {
      'group': 'resize',
      'order': 2,
    },
  },
  'resize-x': {
    'utility': {
      'resize': 'horizontal',
    },
    'meta': {
      'group': 'resize',
      'order': 3,
    },
  },
  'resize': {
    'utility': {
      'resize': 'both',
    },
    'meta': {
      'group': 'resize',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/behaviors.html#user-select
  'select-none': {
    'utility': {
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      'user-select': 'none',
    },
    'meta': {
      'group': 'userSelect',
      'order': 1,
    },
  },
  'select-text': {
    'utility': {
      '-webkit-user-select': 'text',
      '-moz-user-select': 'text',
      '-ms-user-select': 'text',
      'user-select': 'text',
    },
    'meta': {
      'group': 'userSelect',
      'order': 2,
    },
  },
  'select-all': {
    'utility': {
      '-webkit-user-select': 'all',
      '-moz-user-select': 'all',
      '-ms-user-select': 'all',
      'user-select': 'all',
    },
    'meta': {
      'group': 'userSelect',
      'order': 3,
    },
  },
  'select-auto': {
    'utility': {
      '-webkit-user-select': 'auto',
      '-moz-user-select': 'auto',
      '-ms-user-select': 'auto',
      'user-select': 'auto',
    },
    'meta': {
      'group': 'userSelect',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/svg.html#fill-color
  // https://windicss.org/utilities/svg.html#stroke-color
  'fill-current': {
    'utility': {
      'fill': 'currentColor',
    },
    'meta': {
      'group': 'fill',
      'order': 1,
    },
  },
  'stroke-current': {
    'utility': {
      'stroke': 'currentColor',
    },
    'meta': {
      'group': 'stroke',
      'order': 1,
    },
  },
  // https://windicss.org/utilities/svg.html#stroke-linecap
  'stroke-cap-auto': {
    'utility': {
      'stroke-linecap': 'butt',
    },
    'meta': {
      'group': 'stroke',
      'order': 2,
    },
  },
  'stroke-cap-square': {
    'utility': {
      'stroke-linecap': 'square',
    },
    'meta': {
      'group': 'stroke',
      'order': 3,
    },
  },
  'stroke-cap-round': {
    'utility': {
      'stroke-linecap': 'round',
    },
    'meta': {
      'group': 'stroke',
      'order': 4,
    },
  },
  // https://windicss.org/utilities/svg.html#stroke-linejoin
  'stroke-join-auto': {
    'utility': {
      'stroke-linejoin': 'miter',
    },
    'meta': {
      'group': 'stroke',
      'order': 5,
    },
  },
  'stroke-join-arcs': {
    'utility': {
      'stroke-linejoin': 'arcs',
    },
    'meta': {
      'group': 'stroke',
      'order': 6,
    },
  },
  'stroke-join-bevel': {
    'utility': {
      'stroke-linejoin': 'bevel',
    },
    'meta': {
      'group': 'stroke',
      'order': 7,
    },
  },
  'stroke-join-clip': {
    'utility': {
      'stroke-linejoin': 'miter-clip',
    },
    'meta': {
      'group': 'stroke',
      'order': 8,
    },
  },
  'stroke-join-round': {
    'utility': {
      'stroke-linejoin': 'round',
    },
    'meta': {
      'group': 'stroke',
      'order': 9,
    },
  },
  // https://windicss.org/utilities/behaviors.html#screen-readers-access
  'sr-only': {
    'utility': {
      'position': 'absolute',
      'width': '1px',
      'height': '1px',
      'padding': '0',
      'margin': '-1px',
      'overflow': 'hidden',
      'clip': 'rect(0, 0, 0, 0)',
      'white-space': 'nowrap',
      'border-width': '0',
    },
    'meta': {
      'group': 'accessibility',
      'order': 1,
    },
  },
  'not-sr-only': {
    'utility': {
      'position': 'static',
      'width': 'auto',
      'height': 'auto',
      'padding': '0',
      'margin': '0',
      'overflow': 'visible',
      'clip': 'auto',
      'white-space': 'normal',
    },
    'meta': {
      'group': 'accessibility',
      'order': 2,
    },
  },
};
