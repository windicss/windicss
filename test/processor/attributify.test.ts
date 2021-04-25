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

  it('with align utility', () => {
    const result = processor.attributify({
      'align': [
        'content-center', 'content-end', // align-content
        'items-start', 'items-center', // align-items
        'self-auto', 'self-end', // align-self
      ],
    });
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });
});
