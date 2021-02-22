import { Processor } from '../../src/lib';

const processor = new Processor();

describe('Compilation Mode', () => {
  it('compile', () => {
    const result = processor.compile(
      'font-bold \n\ttext-green-300 \nsm:dark:hover:text-lg sm:(bg-gray-100 hover:bg-gray-200) abc bg-cool-gray-300 bg-hex-fff'
    );
    expect(result.className).toBe('windi-sarsyj');
    expect(result.ignored).toEqual(['abc']);
    expect(result.success).toEqual([
      'font-bold',
      'text-green-300',
      'sm:dark:hover:text-lg',
      'sm:bg-gray-100',
      'sm:hover:bg-gray-200',
      'bg-cool-gray-300',
      'bg-hex-fff',
    ]);

    expect(result.styleSheet.build()).toMatchSnapshot('css');
    expect(processor.compile('test wrong css').className).toBeUndefined();
  });

  it('should generate same hash', () => {
    expect(
      processor.compile('font-bold text-white').styleSheet.build()
    ).toEqual(
      processor.compile(' font-bold\n\t text-white ').styleSheet.build()
    );
  });

  it('order is important, so classes in different orders should generate different hashes', () => {
    expect(
      processor.compile('font-bold text-white').styleSheet.build() ===
        processor.compile('text-white font-bold').styleSheet.build()
    ).toBeFalse();
  });

  it('compile important', () => {
    // .windi-17we48r {
    //   --tw-text-opacity: 1 !important;
    //   color: rgba(110, 231, 183, var(--tw-text-opacity)) !important;
    //   font-weight: 700 !important;
    // font-weight should not be important here, something went wrong. Will fix later
    // }
    const result = processor.compile('!text-green-300 font-bold !hover:(p-4 bg-red-500) focus:(!border float-right)');
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('important');
  });
});
