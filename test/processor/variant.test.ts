import { Property } from '../../src/utils/style';
import type { Style } from '../../src/utils/style';
import { baseConfig } from '../../src/config';
import {
  generateScreens,
  generateStates,
  generateThemes,
  resolveVariants,
} from '../../src/lib/variants';
import { Processor } from '../../src/lib';

function _generateTestVariants(variants: { [key: string]: () => Style }) {
  const output: { [key: string]: string } = {};
  for (const [name, func] of Object.entries(variants)) {
    const style = func();
    style.selector = '.test';
    style.add(new Property('background', '#1C1C1E'));
    output[name] = style.build();
  }
  return output;
}

describe('Variants', () => {
  it('generate screens', () => {
    const screens = generateScreens({
      sm: '640px',
      lg: '1024px',
      print: { raw: 'print' },
      narrow: { max: '768px' },
    });
    expect(_generateTestVariants(screens)).toMatchSnapshot('vars');

    const unsortedScreens = generateScreens({
      print: { raw: 'print' },
      lg: '1024px',
      sm: '640px',
      narrow: { max: '768px' },
    });
    expect(Object.keys(unsortedScreens)).toEqual([
      'print',
      'narrow',
      'sm',
      '-sm',
      '+sm',
      'lg',
      '-lg',
      '+lg',
    ]);
  });

  it('generate themes with darkMode class', () => {
    const themes = generateThemes('class');
    expect(_generateTestVariants(themes)).toMatchSnapshot('vars');
  });

  it('generate themes with darkMode media', () => {
    const themes = generateThemes('media');
    expect(_generateTestVariants(themes)).toMatchSnapshot('vars');
  });

  it('generate states', () => {
    const allStates = generateStates(baseConfig.variantOrder ?? []);
    expect(Object.keys(allStates)).toEqual(baseConfig.variantOrder ?? []);

    expect(_generateTestVariants(allStates)).toMatchSnapshot('all');

    const someStates = generateStates([
      'focus',
      'hover',
      'before',
      'svg',
      'group-hover',
      'motion-safe',
      'wrong',
    ]);
    expect(_generateTestVariants(someStates)).toMatchSnapshot('some');
  });

  it('resolve variants', () => {
    const variants = resolveVariants(baseConfig);
    expect(Object.keys(variants)).toEqual(['screen', 'theme', 'state']);
    expect(Object.keys(variants.screen)).toEqual([
      'sm',
      '-sm',
      '+sm',
      'md',
      '-md',
      '+md',
      'lg',
      '-lg',
      '+lg',
      'xl',
      '-xl',
      '+xl',
      '2xl',
      '-2xl',
      '+2xl',
    ]);
    expect(Object.keys(variants.theme)).toEqual([
      '@dark',
      '@light',
      '.dark',
      '.light',
      '~dark',
      'dark',
      'light',
    ]);
    expect(Object.keys(variants.state)).toEqual(baseConfig.variantOrder ?? []);

    const emptyVariants = resolveVariants({});
    expect(emptyVariants.screen).toEqual({});
    expect(emptyVariants.theme).toEqual({});
    expect(emptyVariants.state).toEqual({});
  });

  it('should not generate utility when variant is wrong', () => {
    const processor = new Processor();
    expect(processor.interpret('pointer-hover:bg-gray-200 hover:cursor:bg-gray-200').ignored.length).toEqual(2);
  });

  it('directions', () => {
    const processor = new Processor();
    expect(processor.interpret('ltr:text-lg rtl:dark:text-sm').styleSheet.build()).toMatchSnapshot('css');
  });
});
