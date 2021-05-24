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

  it('rtl interpret test', () => {
    const processor = new Processor({
      plugins: [
        typography({ rtl: true }),
      ],
    });
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
    expect(css).toMatchSnapshot('rtl');
  });

  it('dark class interpret test', () => {
    const processor = new Processor({
      darkMode: 'class',
      plugins: [
        typography({ dark: true }),
      ],
    });
    const result = processor.interpret('prose');
    expect(result.ignored.length).toEqual(0);
    const css = result.styleSheet.build();
    expect(css).toMatchSnapshot('class');
  });

  it('dark media interpret test', () => {
    const processor = new Processor({
      darkMode: 'media',
      plugins: [
        typography({ dark: true }),
      ],
    });
    const result = processor.interpret('prose');
    expect(result.ignored.length).toEqual(0);
    const css = result.styleSheet.build();
    expect(css).toMatchSnapshot('media');
  });

  it('customize dark mode', () => {
    const processor = new Processor({
      theme: {
        extend: {
          typography: {
            DARK: {
              css: {
                backgroundColor: 'red',
              },
            },
          },
        },
      },
      plugins: [
        typography({ dark: true }),
      ],
    });
    expect(processor.interpret('prose').styleSheet.build()).toMatchSnapshot('media');
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

  it('add completions', () => {
    const processor = new Processor();
    processor.loadPluginWithOptions(typography);
    expect(processor._plugin.completions).toMatchSnapshot('completions');
  });

  it('prose with customize colors', () => {
    const processor = new Processor({
      theme: {
        extend: {
          colors: {
            'deep-blush': {
              '50': '#fef8fa',
              '100': '#fdf1f6',
              '200': '#fadce8',
              '300': '#f7c6d9',
              '400': '#f29cbd',
              '500': '#ec71a1',
              '600': '#d46691',
              '700': '#b15579',
              '800': '#8e4461',
              '900': '#74374f',
            },
          },
        },
      },
    });
    processor.loadPluginWithOptions(typography);
    expect(processor.interpret('prose-deep-blush').styleSheet.build()).toMatchSnapshot('css');
  });
});
