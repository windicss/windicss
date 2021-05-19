import { Processor } from '../../src/lib';

const processor = new Processor();

describe('Attributify Mode', () => {
  it('simple attributify', () => {
    expect(processor.attributify({
      font: 'bold',
      p: ['x-4', 'y-2', 'lg:4'],
      bg: ['green-400', 'opacity-50'],
    }).styleSheet.build()).toMatchSnapshot('css');
  });

  it('with variants', () => {
    expect(processor.attributify({
      sm: ['bg-red-500', 'bg-opacity-50'],
      'sm:hover': ['text-red-500', 'text-lg'],
      'sm-hover': ['text-red-500', 'text-lg'],
    }).styleSheet.build()).toMatchSnapshot('css');
  });

  it('mix utility and variant', () => {
    expect(processor.attributify({
      p: ['x-4', 'y-2', 'md:x-2', 'lg:hover:x-8'],
      sm: ['bg-red-500', 'bg-opacity-50', 'hover:bg-green-300'],
      'sm:hover': ['text-red-500', 'text-lg', 'focus:bg-white'],
    }).styleSheet.build()).toMatchSnapshot('css');
  });

  it('with variants and utility', () => {
    expect(processor.attributify({
      'sm:p': ['x-4', 'y-2'],
      'hover-text': ['red-300', 'sm'],
      'hover:text': ['red-500', 'lg'],
      'sm:hover:text': ['red-500', 'lg'],
      'sm-hover-text': ['red-300', 'sm'],
    }).styleSheet.build()).toMatchSnapshot('css');
  });

  it('with negative utility', () => {
    expect(processor.attributify({
      'm': ['-x-4', 'md:y-2'],
      'sm': ['-my-2'],
    }).styleSheet.build()).toMatchSnapshot('css');
  });

  it('with grid utility', () => {
    const result = processor.attributify({
      'grid': [
        'default', 'inline', // display
        'cols-1', 'cols-none', // grid-template-columns
        'col-auto', 'col-span-2', // grid-column
        'rows-3', 'rows-none', // grid-template-rows
        'row-auto', 'row-span-2', // grid-rows
        'flow-row', 'flow-col', 'flow-row-dense', // grid-auto-flow
        'auto-cols-auto', 'auto-cols-min', 'auto-cols-max', // grid-auto-columns
        'auto-rows-auto', 'auto-rows-min', 'auto-rows-max', // grid-auto-rows
        'gap-2', 'gap-x-4', 'gap-y-2', // gap/column-gap/row-gap
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with gradient utility', () => {
    const result = processor.attributify({
      'gradient': [
        'none', 'to-r', 'to-br',
        'from-yellow-400',
        'via-red-500',
        'to-pink-500',
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with display utility', () => {
    const result = processor.attributify({
      'display': [
        'visible', 'invisible', // visibility
        'inline', 'flow-root', 'contents', 'list-item', 'hidden', 'block', 'inline-block', // display
        'md:hidden',
        'backface-visible', 'backface-hidden',
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with backface utility', () => {
    const result = processor.attributify({
      'backface': [
        'visible', 'hidden',
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with position utility', () => {
    const result = processor.attributify({
      'position': [
        'static', 'fixed', 'absolute', 'relative', 'sticky', // position
        'inset-1', '-inset-1', 'inset-x-1', '-inset-y-2', // inset
        'top-1.5', '-left-3/4', // top/left/bottom/right
        'float-right', 'float-left', 'float-none', // float
        'clear-left', 'clear-right', 'clear-both', 'clear-none', // clear
        'order-1', 'order-first', // order
        'isolate', 'isolation-auto', // isolation
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with pos utility', () => {
    const result = processor.attributify({
      'pos': [
        'static', 'fixed', 'absolute', 'relative', 'sticky', // position
        'inset-1', '-inset-1', 'inset-x-1', '-inset-y-2', // inset
        'top-1.5', '-left-3/4', // top/left/bottom/right
        'float-right', 'float-left', 'float-none', // float
        'clear-left', 'clear-right', 'clear-both', 'clear-none', // clear
        'order-1', 'order-first', // order
        'isolate', 'isolation-auto', // isolation
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with box utility', () => {
    const result = processor.attributify({
      'box': [
        'decoration-slice', 'decoration-clone', // box-decoration-break
        'border', 'content',  // box-sizing
        'shadow', 'shadow-gray-200', // box-shadow
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with isolation utility', () => {
    const result = processor.attributify({
      'isolation': [
        'isolate', 'auto', // isolation
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with z-index width min-width max-width height min-height max-height opacity', () => {
    const result = processor.attributify({
      'w': [ '0', '1', 'full', 'screen', 'md:screen' ],
      'min-w': [ '0', '1', 'full', 'screen', 'md:screen' ],
      'max-w': [ '0', '1', 'full', 'screen', 'md:screen' ],
      'h': [ 'full', 'screen', 'md:screen' ],
      'min-h': [ 'full', 'screen', 'md:screen' ],
      'max-h': [ 'full', 'screen', 'md:screen' ],
      'opacity': [ '0', '50'],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with width and height utility', () => {
    const result = processor.attributify({
      'w': ['0', '1', 'full', '1/3', 'screen', 'md:screen', 'min', 'max', 'min-content', 'max-content', 'min-sm', 'max-2xl', 'min-none', 'min-1/3', 'max-2/3', 'min-prose', 'max-screen'],
      'h': ['auto', 'full', 'screen', '1/3', 'md:screen', 'min', 'max', 'min-content', 'max-content', 'min-sm', 'max-2xl', 'min-none', 'min-1/3', 'max-2/3', 'min-prose', 'max-screen'],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with table utility', () => {
    const result = processor.attributify({
      'table': [
        'default', 'inline', 'caption', 'cell', 'column', 'column-group', 'footer-group', 'header-group', 'row-group', 'row', // display
        'auto', 'fixed', // table-layout
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with caret utility', () => {
    const result = processor.attributify({
      'caret' : [
        'black', 'white', 'gray-500', // caret-color
        'opacity-50', // caret-opacit
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with animate appearance cursor outline pointer resize select fill stroke sr blend', () => {
    const result = processor.attributify({
      'animate': ['none', 'spin', 'ping'],
      'appearance': 'none',
      'cursor': ['auto', 'default', 'pointer'],
      'outline': ['none', 'white'],
      'pointer': ['none', 'auto'],
      'resize': ['~', 'default', 'none', 'x', 'y', 'both'],
      'select': ['none', 'text', 'all', 'auto'],
      'fill': ['current', 'gray-200'],
      'stroke': [
        'current', 'blue-500', // stroke
        '0', '2', // stroke-width
      ],
      'sr': ['only', 'not-only'],
      'blend': ['normal', 'overlay', 'color-burn'], // mix-blend-mode
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with object utility', () => {
    const result = processor.attributify({
      'object': [
        'contain', 'cover', 'fill', 'none', 'scale-down', // object-fit
        'bottom', 'center', 'left-bottom', 'right-top', // object-position
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with overflow utility', () => {
    const result = processor.attributify({
      'overflow': [
        'auto', 'hidden', 'visible', 'scroll', // overflow
        'x-auto', 'x-hidden', 'x-visible', 'x-scroll', // overflow-x
        'y-auto', 'y-hidden', 'y-visible', 'y-scroll', // overflow-y
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with overscroll utility', () => {
    const result = processor.attributify({
      'overscroll': [
        'auto', 'contain', 'none', // overscroll
        'x-auto', 'x-contain', 'x-none',  // overscroll-x
        'y-auto', 'y-contain', 'y-none', // overscroll-y
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with flex utility', () => {
    const result = processor.attributify({
      'flex': [
        'default', 'inline', // display
        'row', 'row-reverse', 'col', 'col-reverse',  // flex-direction
        'wrap', 'wrap-reverse', 'nowrap', // flex-wrap
        '1', 'auto', 'initial', 'none', // flex
        'grow', 'grow-0', // flex-grow
        'shrink', 'shrink-0', // flex-shrink
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with justify utility', () => {
    const result = processor.attributify({
      'justify': [
        'start', 'end', 'evenly', // justify-content
        'content-start', 'content-end', 'content-evenly', // justify-content
        'items-start', 'items-end', 'items-stretch', // justify-items
        'self-auto', 'self-start', 'self-center', // justify-self
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with align utility', () => {
    const result = processor.attributify({
      'align': [
        'center', 'end', // align-content
        'content-center', 'content-end', // align-content
        'items-start', 'items-center', // align-items
        'self-auto', 'self-end', // align-self
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with place utility', () => {
    const result = processor.attributify({
      'place': [
        'start', 'end', 'evenly', // place-content
        'content-start', 'content-end', 'content-evenly', // place-content
        'items-start', 'items-end', 'items-stretch', // place-items
        'self-auto', 'self-start', 'self-center', // place-self
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with margin padding space_between', () => {
    const result = processor.attributify({
      'm': ['4', 'x-2', 'y-3', 't-4'],
      'p': ['4', '-x-2', '-y-3', 'r-px'],
      'space': ['x-4', 'y-2', '-x-4'],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with font utility', () => {
    const result = processor.attributify({
      'font': [
        'sans', 'serif', 'mono', // font-family
        'antialiased', 'subpixel-antialiased', // font-smoothing
        'italic', 'not-italic', // font-style
        'thin', 'extralight', 'black', // font-weight
        'normal-nums', 'ordinal', 'slashed-zero', 'lining-nums', 'oldstyle-nums', 'proportional-nums', 'tabular-nums', 'diagonal-fractions', 'stacked-fractions', // font-variant-numeric
        'tracking-tighter', 'tracking-wider', // letter-spacing
        'leading-3', 'leading-none', 'leading-loose', // line-height
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with svg utility', () => {
    const result = processor.attributify({
      'svg': [
        'fill-current', 'fill-gray-200',
        'stroke-current', 'stroke-gray-200',
        'stroke-2', 'stroke-4',
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with list utility', () => {
    const result = processor.attributify({
      'list': [
        'none', 'disc', 'decimal', // list-style-type
        'inside', 'outside', // list-style-position
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with image utility', () => {
    const result = processor.attributify({
      'image': [
        'render-pixel', 'render-auto', 'render-edge', // image-rendering
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with placeholder utility', () => {
    const result = processor.attributify({
      'placeholder': [
        'transparent', 'blue-600', // color
        'opacity-50', // opacity
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with text utility', () => {
    const result = processor.attributify({
      'text': [
        'xs', 'sm', // font-size
        'left', 'center', 'right', 'justify', // text-align
        'baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', // vertical-align
        'red-500', // color
        'opacity-50', // opacity
        'underline', 'line-through', 'no-underline', // text-decoration
        'uppercase', 'lowercase', 'capitalize', 'normal-case', // text-transform
        'truncate', 'overflow-ellipsis', 'overflow-clip', // text-overflow
        'space-normal', 'space-nowrap', 'space-pre', 'space-pre-line', 'space-pre-wrap', // white-space
        'break-normal', 'break-words', 'break-all', // word-break
        'placeholder-gray-200', 'placeholder-opacity-80', // placeholder
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with bg utility', () => {
    const result = processor.attributify({
      'bg': [
        'fixed', 'local', 'scroll', // background-attachment
        'clip-border', 'clip-padding', 'clip-content', 'clip-text', // background-clip
        'black', 'white', // background-color
        'opacity-50', // "opacity"
        'bottom', 'center', 'left', 'bottom', 'left-bottom', // background-position
        'repeat', 'no-repeat', 'repeat-x', 'repeat-y', 'repeat-round', 'repeat-space', // background-repeat
        'auto', 'cover', 'contain', // background-size
        'none', // background-image: none
        'origin-border', 'origin-padding', 'origin-content', // background-origin
        'blend-normal', 'blend-hard-light', // background-blend-mode
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with border utility', () => {
    const result = processor.attributify({
      'border': [
        'rounded-none', 'rounded-sm', 'rounded-t-none', // border-radius
        '1', '2', 't-0', // border-width
        'gray-400', // border-color
        'opacity-50', // opacity
        'solid', 'dashed', 'dotted', 'double', 'none', // border-style
        'collapse', 'separate', // border-collapse
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with divide utility', () => {
    const result = processor.attributify({
      'divide': [
        'x', 'y-2', 'x-reverse', // divide-width
        'gray-400', // divide-color
        'opacity-50', // opacity
        'solid', 'dashed', 'dotted', 'double', 'none', // divide-style
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with ring utility', () => {
    const result = processor.attributify({
      'ring': [
        '0', '1', '2', '3', 'inset', 'default', // ring-width
        'gray-400', // ring-color
        'opacity-50', // opacity
        'offset-4', // ring-offset-width
        'offset-gray-200', // ring-offset-color
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with shadow utility', () => {
    const result = processor.attributify({
      'shadow': [
        'default', 'sm', 'md', 'inner', 'none', // shadow-size
        'gray-400', // shadow-color
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with container utility', () => {
    const result = processor.attributify({
      'container': ['default', '~'],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with filter utility', () => {
    const result = processor.attributify({
      'filter': [
        'default', 'none',
        'blur', 'blur-0', 'blur-sm',
        'brightness-50',
        'contrast-125',
        'drop-shadow', 'drop-shadow-sm', 'drop-shadow-md',
        'grayscale-0', 'grayscale',
        'hue-rotate-90', '-hue-rotate-90',
        'invert-0', 'invert',
        'saturate-0', 'saturate-100',
        'sepia-0', 'sepia',
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with backdrop utility', () => {
    const result = processor.attributify({
      'backdrop': [
        'default', 'none',
        'blur', 'blur-0', 'blur-sm',
        'brightness-50',
        'contrast-125',
        'grayscale-0', 'grayscale',
        'hue-rotate-90', '-hue-rotate-90',
        'invert-0', 'invert',
        'opacity-50', 'opacity-90',
        'saturate-0', 'saturate-100',
        'sepia-0', 'sepia',
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with transition utility', () => {
    const result = processor.attributify({
      'transition': [
        'default', 'none', 'all', 'colors', 'opacity', 'shadow', 'transform', // transition-property
        'duration-75', // transition-duration
        'ease-linear', 'ease-in', 'ease-out', 'ease-in-out', // transition-timing-function
        'delay-40', // transition-delay
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('with transform utility', () => {
    const result = processor.attributify({
      'transform': [
        'default', 'gpu', 'none', // transform
        'origin-center', 'origin-top', // transform-origin
        'scale-50', // scale
        'rotate-50', '-rotate-50', // rotate
        'translate-x-4', '-translate-y-3/4', //translate
        'skew-x-4', '-skew-y-12', //skew
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });


  it('replace default with ~', () => {
    const result = processor.attributify({
      'grid': '~',
      'table': '~',
      'flex': '~',
      'ring': '~',
      'shadow': '~',
      'border': '~',
      'filter': '~',
      'backdrop': '~',
      'transition': '~',
      'transform': '~',
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('important test', () => {
    const result = processor.attributify({
      'bg': ['!red-500', 'md:red-600'],
      'text': ['lg', 'white'],
      'border': '!md:~',
      '!shadow': 'lg',
      '!ring': '!opacity-50',
      '!md': 'bg-green-400',
      '!md:text': 'gray-200',
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('attributify order', () => {
    expect(processor.attributify({
      position: ['relative', 'fixed'],
    }).styleSheet.build()).toMatchSnapshot('css');
  });

  it('Attributes for medium only and large only', () => {
    expect(processor.attributify({
      '<sm': 'font-light',
      '<lg': 'p-4',
      '@lg': 'font-bold',
      '@md': ['px-4', 'py-2'],
      '@xl': ['bg-green-400', 'bg-opacity-50'],
      '@2xl': 'text-green-200',
      'text': ['lg', 'white', '<lg:gray-200', '@md:opacity-50'],
    }).styleSheet.build()).toMatchSnapshot('css');
  });
});
