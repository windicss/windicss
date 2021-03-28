import { Processor } from '../../src/lib';

const processor = new Processor();

describe('Interpretation Mode', () => {
  it('interpret', () => {
    const result = processor.interpret('font-bold \n\ttext-green-300 \nsm:dark:hover:text-lg sm:(bg-gray-100 hover:bg-gray-200) abc bg-cool-gray-300 bg-hex-fff');
    expect(result.ignored).toEqual(['abc']);

    expect(result.success).toMatchSnapshot('success');
    expect(result.styleSheet.build()).toMatchSnapshot('css');

    expect(processor.interpret('test wrong css').success).toEqual([]);
    expect(processor.interpret('test wrong css').ignored).toEqual([
      'test',
      'wrong',
      'css',
    ]);
  });

  it('interpret important', () => {
    const result = processor.interpret('!text-green-300 font-bold !hover:(p-4 bg-red-500) focus:(!border float-right)');
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('important');
  });

  it('interpret duplicated important', () => {
    const result = processor.interpret('!text-green-300 !text-green-300 !p-0 !p-0 !hover:(p-4 bg-red-500) !hover:(p-4 bg-red-500) focus:(!border float-right)');
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('duplicated important');
  });

  it('interpret square brackets', () => {
    const result = processor.interpret('p-[30em] !mt-[10px] w-[51vw] m-[-11rem] border-[2px] border-[#232] text-[#9254d2]');
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('square brackets');
  });

  it('interpret false positive with "constructor"', () => {
    const result = processor.interpret('./constructor');
    expect(result.ignored.length).toEqual(1);
  });
});
