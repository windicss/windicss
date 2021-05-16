import { Processor } from '../../src/lib';

const processor = new Processor();

describe('Validate Utilities', () => {
  it('test', () => {
    expect(processor.test('bg-red-500')).toBeTrue();
    expect(processor.test('font-bold')).toBeTrue();
    expect(processor.test('abc')).toBeFalse();
  });
  it('validate', () => {
    const result = processor.validate('font-bold \n\ttext-green-300 \nsm:dark:hover:text-lg ac:font-bold sm:(bg-gray-100 hover:bg-gray-200) abc bg-cool-gray-300 bg-hex-fff');
    expect(result.ignored).toMatchSnapshot('ignored');
    expect(result.success).toMatchSnapshot('success');
  });
});
