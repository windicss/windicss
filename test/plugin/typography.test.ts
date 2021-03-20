import { Processor } from '../../src/lib';
import typography from '../../src/plugin/typography';

describe('typography plugin', () => {
  it('interpret test', () => {
    const processor = new Processor();
    processor.loadPluginWithOptions(typography);
    const classes = `
      prose
      prose-sm
      prose-lg
      prose-xl
      prose-2xl
      prose-pink
      prose-fuchsia
      prose-purple
      prose-violet
      prose-indigo
      prose-blue
      prose-cyan
      prose-teal
      prose-emerald
      prose-green
      prose-lime
      prose-yellow
      prose-amber
      prose-orange
      prose-red
      `;
    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);
    const css = result.styleSheet.build();
    expect(css).toMatchSnapshot('css');
  });

  it('with extend', () => {
    const processor = new Processor({
      theme: {
        extend: {
          typography: {
            DEFAULT: {
              css: {
                color: 'red',
              },
            },
          },
        },
      },
    });
    processor.loadPluginWithOptions(typography);
    const result = processor.interpret('prose');
    expect(result.ignored.length).toEqual(0);
    const css = result.styleSheet.build();
    expect(css).toMatchSnapshot('css');
  });

  it('with multi selector', () => {
    const processor = new Processor({
      theme: {
        extend: {
          typography: theme => ({
            DEFAULT: {
              css: {
                color: theme('colors.gray.800'),
              },
            },
            dark: {
              css: {
                'h2 > a, h3 > a': {
                  color: theme('colors.gray.800'),
                  fontWeight: 'inherit',
                },
              },
            },
          }),
        },
      },
    });
    processor.loadPluginWithOptions(typography);
    expect(processor.interpret('prose dark:prose-dark').styleSheet.build()).toMatchSnapshot('css');
  });
});
