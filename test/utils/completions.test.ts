import { Processor } from '../../src/lib';
import { generateCompletions } from '../../src/utils/completions';

describe('generate completions', () => {
  it('completions', () => {
    const processor = new Processor();
    const completions = generateCompletions(processor);
    expect(completions.static).toMatchSnapshot('static');
    expect(completions.dynamic).toMatchSnapshot('dynamic');
    expect(completions.color).toMatchSnapshot('color');
  });

  it('custom theme properties #226', () => {
    const processor = new Processor({
      theme: {
        extend: {
          'spacing-minus': {
            'screen-px': 'calc(100vh - 1px)',
            'screen-0': 'calc(100vh - 0px)',
            'screen-abc': 'calc(100vh - 0px)',
          },
        },
        height: theme => ({
          ...theme('spacing-minus'),
        }),
        maxHeight: theme => ({
          ...theme('spacing-minus'),
        }),
      },
    });
    expect(processor.theme('spacing-minus')).toMatchSnapshot('theme');
    expect(processor.theme('height[\'screen-px\']')).toEqual('calc(100vh - 1px)');
    expect(processor.theme('maxHeight[\'screen-0\']')).toEqual('calc(100vh - 0px)');
    expect(processor.interpret('h-screen-px h-screen-0 max-h-screen-px max-h-screen-0').styleSheet.build()).toMatchSnapshot('css');
    const completions = generateCompletions(processor);
    expect(completions.static.includes('h-screen-abc')).toBeTrue();
    expect(completions.static.includes('max-h-screen-abc')).toBeTrue();
  });
});
