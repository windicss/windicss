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
    const result = processor.interpret('!text-green-300 font-bold !hover:(p-4 bg-red-500) focus:(!border float-right) !hover:m-2');
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('important');
  });

  it('interpret duplicated important', () => {
    const result = processor.interpret('!text-green-300 !text-green-300 !p-0 !p-0 !hover:(p-4 bg-red-500) !hover:(p-4 bg-red-500) focus:(!border float-right)');
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('duplicated important');
  });

  it('interpret square brackets', () => {
    const result = processor.interpret(`
      p-[30em] !mt-[10px] w-[51vw] m-[-11rem] gap-[4rem]
      border-[2px] border-[#232] border-l-[#342]
      ring-[#34123250] ring-[4px]
      bg-[#234]
      text-[1.5rem] text-[#9254d2] text-[rgb(123,123,23)] text-[rgba(132,2,193,0.5)] text-[hsl(360,100%,50%)]
      backdrop-blur-[11px] backdrop-brightness-[1.23] backdrop-contrast-[0.87] backdrop-grayscale-[0.42] backdrop-hue-rotate-[1.57rad] backdrop-invert-[0.66] backdrop-opacity-[22%] backdrop-saturate-[144%] backdrop-sepia-[0.38]
      blur-[11px] brightness-[1.23] contrast-[0.87] grayscale-[0.42] hue-rotate-[1.57rad] invert-[0.66] saturate-[144%] sepia-[0.38]
    `);
    expect(result.ignored).toEqual([]);
    expect(result.styleSheet.build()).toMatchSnapshot('square brackets');
  });

  it('interpret square brackets grid', () => {
    const result = processor.interpret(`
      grid-cols-[1fr,700px,2fr]
      grid-cols-[auto]
      grid-rows-[auto,max-content,10px]
    `);
    expect(result.ignored).toEqual([]);
    expect(result.styleSheet.build()).toMatchSnapshot('square brackets grids');
  });

  // #240
  it('interpret square brackets grids with function', () => {
    const result = processor.interpret(`
      grid-cols-[minmax(200px,2fr),minmax(300px,3fr),minmax(100px,1fr)]
    `);
    expect(result.ignored).toEqual([]);
    expect(result.styleSheet.build()).toMatchSnapshot('square brackets grids');
  });

  it('interpret square brackets ignored', () => {
    const result = processor.interpret(`
      p-[30 em] p-[] text] border-[ text-[[
    `);
    expect(result.success).toEqual([]);
  });

  it('interpret false positive with "constructor"', () => {
    const result = processor.interpret('./constructor');
    expect(result.ignored.length).toEqual(1);
  });

  it('generated correct css for space-x-reverse', () => {
    const result = processor.interpret('space-x-reverse space-y-4');
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('interpret screen variants', () => {
    const result = processor.interpret('md:p-1 <lg:p-2 @xl:p-3');
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('screen variants');
  });

  // #222
  it('interpret outline', () => {
    const result = processor.interpret('outline-black outline-none outline-solid-black outline-dotted-white outline-solid-red-200 outline-dotted-red-200');
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('outline');
  });

  // #234
  it('interpret constructor', () => {
    const result = processor.interpret('constructor');
    expect(result.ignored.length).toEqual(1);
  });

  it('interpret alias', () => {
    const processor = new Processor({
      alias: {
        hstack: 'flex items-center hover:bg-white',
        vstack: 'flex flex-col',
      },
    });
    const result = processor.interpret('bg-blue-400 *vstack md:(bg-red-500 *hstack)');
    expect(result.success).toEqual(['bg-blue-400', 'flex', 'flex-col', 'md:bg-red-500', 'md:flex', 'md:items-center', 'md:hover:bg-white']);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('interpert order', () => {
    expect(processor.interpret('relative fixed').styleSheet.build()).toMatchSnapshot('css');
  });
});
