import { Processor } from '../../src/lib';
import { resolve } from 'path';

const processor = new Processor(require(resolve('./test/assets/windi.plugin.config.js')));

describe('Resolve Tests', () => {
  it('resolve variants', () => {
    const processor = new Processor();
    const screenVariants = [
      'sm',   '<sm',   '@sm', '-sm',  '+sm',
      'md',   '<md',   '@md', '-md',  '+md',
      'lg',   '<lg',   '@lg', '-lg',  '+lg',
      'xl',   '<xl',   '@xl', '-xl',  '+xl',
      '2xl', '<2xl',  '@2xl', '-2xl', '+2xl',
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
      'first-letter',      'first-line',       'file-selector-button',
      'selection',         'svg',              'all',
      'children',          'siblings',         'sibling',
      'ltr',               'rtl',              'group-hover',
      'group-focus',       'group-active',     'group-visited',
      'motion-safe',       'motion-reduce',
    ];
    const themeVariants = [ '@dark', '@light', '.dark', '.light', 'dark', 'light' ];

    expect(Object.keys(processor.resolveVariants())).toEqual([...screenVariants, ...themeVariants, ...stateVariants]);
    expect(Object.keys(processor.resolveVariants('screen'))).toEqual(screenVariants);
    expect(Object.keys(processor.resolveVariants('theme'))).toEqual(themeVariants);
    expect(Object.keys(processor.resolveVariants('state'))).toEqual(stateVariants);
  });

  it('resolve static utilities', () => {
    expect(Object.keys(processor.resolveStaticUtilities(false)).length).toEqual(293);
    expect(Object.keys(processor.resolveStaticUtilities(true)).length).toEqual(299);
  });

  it('resolve dynamic utilities', () => {
    expect(Object.keys(processor.resolveDynamicUtilities(false))).toMatchSnapshot('without-plugins');
    expect(Object.keys(processor.resolveDynamicUtilities(true))).toMatchSnapshot('with-plugins');
  });

  it('get corePlugins', () => {
    const processor = new Processor();
    expect(processor.config('corePlugins')).toMatchSnapshot('list');
    const processor2 = new Processor({
      corePlugins: ['container', 'cursor'],
    });
    expect(processor2.config('corePlugins')).toMatchSnapshot('list2');
    const processor3 = new Processor({
      corePlugins: {
        container: false,
        cursor: false,
      },
    });
    expect(processor3.config('corePlugins')).toMatchSnapshot('list3');
  });
});
