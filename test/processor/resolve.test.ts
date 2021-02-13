import { Processor } from "../../src/lib";
import { resolve } from "path";

const processor = new Processor(require(resolve('./test/assets/tailwind.plugin.config.js')));

describe("Resolve Tests", () => {
  it("resolve variants", () => {
    const processor = new Processor();
    const screenVariants = [
      'sm',  '-sm',  '+sm',
      'md',  '-md',  '+md',
      'lg',  '-lg',  '+lg',
      'xl',  '-xl',  '+xl',
      '2xl', '-2xl', '+2xl'
    ];
    const stateVariants = [
      'hover',             'focus',            'active',
      'visited',           'link',             'target',
      'focus-visible',     'focus-within',     'checked',
      'not-checked',       'default',          'disabled',
      'enabled',           'indeterminate',    'invalid',
      'valid',             'optional',         'required',
      'placeholder-shown', 'read-only',        'read-write',
      'not-disabled',      'first-of-type',    'not-first-of-type',
      'last-of-type',      'not-last-of-type', 'first',
      'last',              'not-first',        'not-last',
      'only-child',        'not-only-child',   'only-of-type',
      'not-only-of-type',  'even',             'odd',
      'even-of-type',      'odd-of-type',      'root',
      'empty',             'before',           'after',
      'first-letter',      'first-line',       'selection',
      'svg',               'all',              'all-child',
      'sibling',           'group-hover',      'group-focus',
      'group-active',      'group-visited',    'motion-safe',
      'motion-reduce'
    ];
    const themeVariants = [ '@dark', '@light', '.dark', '.light', 'dark', 'light' ];

    expect(Object.keys(processor.resolveVariants())).toEqual([...screenVariants, ...themeVariants, ...stateVariants]);
    expect(Object.keys(processor.resolveVariants('screen'))).toEqual(screenVariants);
    expect(Object.keys(processor.resolveVariants('theme'))).toEqual(themeVariants);
    expect(Object.keys(processor.resolveVariants('state'))).toEqual(stateVariants);
  })

  it("resolve static utilities", () => {
    expect(Object.keys(processor.resolveStaticUtilities(false)).length).toEqual(206);
    expect(Object.keys(processor.resolveStaticUtilities(true)).length).toEqual(234);
  })

  it("resolve dynamic utilities", () => {
    const dynamicKeys = [
      'container', 'object',  'inset',      'top',
      'right',     'bottom',  'left',       'z',
      'flex',      'order',   'grid',       'col',
      'row',       'auto',    'gap',        'p',
      'py',        'px',      'pt',         'pr',
      'pb',        'pl',      'm',          'my',
      'mx',        'mt',      'mr',         'mb',
      'ml',        'space',   'w',          'h',
      'min',       'max',     'text',       'font',
      'tracking',  'leading', 'list',       'placeholder',
      'bg',        'from',    'via',        'to',
      'rounded',   'border',  'divide',     'ring',
      'shadow',    'opacity', 'transition', 'duration',
      'ease',      'delay',   'animate',    'origin',
      'scale',     'rotate',  'translate',  'skew',
      'cursor',    'outline', 'fill',       'stroke'
    ];
    expect(Object.keys(processor.resolveDynamicUtilities(false))).toEqual(dynamicKeys);
    expect(Object.keys(processor.resolveDynamicUtilities(true))).toEqual([
      ...dynamicKeys,
      'filter',    'backdrop', 'blur',       'aspect-w',
      'aspect-h',  'aspect',   'line-clamp'
    ]);
  })
});
