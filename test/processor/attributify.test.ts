import { Processor } from '../../src/lib';

const processor = new Processor();

describe('Attributify Mode', () => {
  it('attributify', () => {
    expect(processor.attributify({
      font: 'bold',
      p: ['x-4', 'y-2'],
      bg: ['green-400', 'opacity-50'],
      'hover:text': ['red-500', 'lg'],
    }).styleSheet.build()).toMatchSnapshot('css');
  });
  it('with variants', () => {
    expect(processor.attributify({
      sm: ['bg-red-500', 'bg-opacity-50'],
      'sm:hover': ['text-red-500', 'text-lg'],
      'sm:hover:text': ['red-500', 'text-lg'],
      'sm-hover': ['text-red-500', 'text-lg'],
      'sm-hover-text': ['red-500', 'text-lg'],
    }));
  });
  it('all test', () => {
    expect(processor.attributify({

    }));
  });
});
