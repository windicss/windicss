import { Processor } from '../../src/lib';
import lineClamp from '../../src/plugin/line-clamp';

describe('line clamp plugin', () => {
  it('interpret test', () => {
    const processor = new Processor();
    processor.loadPlugin(lineClamp);
    const classes = `
      line-clamp-1
      line-clamp-4
      line-clamp-none
      hover:line-clamp-none
      sm:line-clamp-none
    `;
    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('line-clamp');
  });
  it('customize test', () => {
    const processor = new Processor({
      theme: { extend: { lineClamp: { sm: '4', md: '6' } } },
    });
    processor.loadPlugin(lineClamp);
    const classes = `
      line-clamp-1
      line-clamp-4
      line-clamp-sm
      line-clamp-md
    `;
    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('line-clamp customized');
  });
  it('works with prefix', () => {
    const processor = new Processor({ prefix: 'windi-' });
    processor.loadPlugin(lineClamp);
    const classes = `
      windi-line-clamp-1
      windi-line-clamp-4
      windi-line-clamp-none
      sm:windi-line-clamp-none
      md:windi-line-clamp-4
    `;
    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('line-clamp with prefix');
  });
});
