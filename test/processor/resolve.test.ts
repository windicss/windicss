import { Processor } from '../../src/lib';
import { resolve } from 'path';
import { pseudoClassNames } from '../../src/config/order';

const processor = new Processor(require(resolve('./test/assets/windi.plugin.config.js')));

describe('Resolve Tests', () => {
  it('resolve variants', () => {
    const processor = new Processor();
    const screenVariants = [
      'sm', '<sm', '@sm', '-sm', '+sm',
      'md', '<md', '@md', '-md', '+md',
      'lg', '<lg', '@lg', '-lg', '+lg',
      'xl', '<xl', '@xl', '-xl', '+xl',
      '2xl', '<2xl', '@2xl', '-2xl', '+2xl',
    ];
    const stateVariants = [
      ...pseudoClassNames, 'not-checked',
      'not-disabled',
      'not-first-of-type',
      'not-last-of-type',
      'first',
      'not-first',
      'last',
      'not-last',
      'not-only-child',
      'not-only-of-type',
      'even',
      'odd',
      'even-of-type',
      'odd-of-type', 'before', 'after',
      'first-letter', 'first-line', 'file-selector-button',
      'file', 'selection', 'marker', 'svg',
      'all', 'children', 'siblings',
      'sibling', 'ltr', 'rtl',
      ...pseudoClassNames.map(pseudoClassName => `group-${pseudoClassName}`),
      'motion-safe', 'motion-reduce',
      ...pseudoClassNames.map(pseudoClassName => `peer-${pseudoClassName}`),
      ...pseudoClassNames.map(pseudoClassName => `peer-not-${pseudoClassName}`),
    ];
    const themeVariants = ['@dark', '@light', '.dark', '.light', 'dark', 'light'];
    const orientationVariants = ['portrait', 'landscape'];

    expect(Object.keys(processor.resolveVariants())).toEqual([...screenVariants, ...themeVariants, ...stateVariants, ...orientationVariants]);
    expect(Object.keys(processor.resolveVariants('orientation'))).toEqual(orientationVariants);
    expect(Object.keys(processor.resolveVariants('screen'))).toEqual(screenVariants);
    expect(Object.keys(processor.resolveVariants('theme'))).toEqual(themeVariants);
    expect(Object.keys(processor.resolveVariants('state'))).toEqual(stateVariants);
  });

  it('resolve static utilities', () => {
    expect(Object.keys(processor.resolveStaticUtilities(false)).length).toEqual(351);
    expect(Object.keys(processor.resolveStaticUtilities(true)).length).toEqual(360);
    expect(Object.keys(processor.resolveStaticUtilities(true)).length).toEqual(360);
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
