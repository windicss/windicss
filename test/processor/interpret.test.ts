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
      w-[3.23rem] w-[calc(100%+1rem)] w-[var(--width)]
      h-[3.23rem] h-[calc(100%+1rem)] h-[var(--width)]
      border-[2px] border-[#232] border-l-[#342]
      rounded-[11px] rounded-t-[var(--radius)] rounded-r-[var(--radius)] rounded-b-[var(--radius)] rounded-l-[var(--radius)] rounded-tr-[var(--radius)] rounded-br-[var(--radius)] rounded-bl-[var(--radius)] rounded-tl-[var(--radius)]
      ring-[#34123250] ring-[4px]
      bg-[#234]
      inset-[11px]
      tracking-[var(--tracking)]
      leading-[var(--leading)]
      m-[7px] my-[7px] mx-[7px] mt-[7px] mr-[7px] mb-[7px] ml-[7px] mt-[clamp(30px,100px)]
      p-[var(--app-padding)]
      max-w-[3.23rem] max-w-[calc(100%+1rem)] max-w-[var(--width)] max-h-[3.23rem] max-h-[calc(100%+1rem)] max-h-[var(--width)]
      min-h-[3.23rem] min-h-[calc(100%+1rem)] min-h-[var(--width)]
      min-w-[3.23rem] min-w-[calc(100%+1rem)] min-w-[var(--width)]
      w-[calc(var(--10-10px,calc(-20px-(-30px--40px)))-50px)]
      w-[calc(var(--10-10px)+20px)]
      w-[calc(var(--test)+1px)]
      opacity-[var(--opacity)]
      outline-[var(--outline)]
      placeholder-[var(--placeholder)] placeholder-opacity-[var(--placeholder)]
      ring-[#76ad65] ring-offset-[#76ad65] ring-opacity-[var(--ring-opacity)] ring-[10px]
      rotate-[23deg] rotate-[2.3rad] rotate-[401grad] rotate-[1.5turn]
      skew-x-[3px] skew-y-[3px]
      space-x-[20cm] space-x-[calc(20%-1cm)]
      stroke-[#da5b66]
      duration-[2s] duration-[var(--app-duration)]
      delay-[var(--delay)]
      bg-opacity-[0.11] bg-opacity-[var(--value)]
      from-[#da5b66] from-[var(--color)]
      via-[#da5b66] via-[var(--color)]
      to-[#da5b66] to-[var(--color)]
      col-[7] col-end-[7] col-start-[7]
      row-[7] row-end-[7] row-start-[7]
      text-[1.5rem] text-[#9254d2] text-[rgb(123,123,23)] text-[rgba(132,2,193,0.5)] text-[hsl(360,100%,50%)]
      fill-[#1c1c1e] fill-[var(--color)]
      flex-[var(--flex)] flex-grow-[var(--grow)] flex-shrink-[var(--shrink)]
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
