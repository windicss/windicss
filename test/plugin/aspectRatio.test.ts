import { Processor } from '../../src/lib';
import aspectRatio from '../../src/plugin/aspect-ratio';

describe('aspect ratio plugin', () => {
  it('interpret test', () => {
    const processor = new Processor();
    processor.loadPlugin(aspectRatio);
    const classes = `
      aspect-none
      aspect-w-16
      aspect-h-9
      aspect-9/16
      `;
    const utility = processor.interpret(classes);
    expect(utility.ignored.length).toEqual(0);
    expect(utility.styleSheet.build()).toMatchSnapshot('aspect-ratio base');
  });

  it('works with prefix', () => {
    const processor = new Processor({ prefix: 'windi-' });
    processor.loadPlugin(aspectRatio);
    const classes = `
      windi-aspect-none
      windi-aspect-w-16
      windi-aspect-h-9
      sm:windi-aspect-9/16
      `;
    const utility = processor.interpret(classes);
    expect(utility.ignored.length).toEqual(0);
    expect(utility.styleSheet.build()).toMatchSnapshot('aspect-ratio with prefix');
  });

  it('add completions', () => {
    const processor = new Processor();
    processor.loadPlugin(aspectRatio);
    expect(processor._plugin.completions).toMatchSnapshot('completions');
  });
});
