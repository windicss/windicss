import { FontSize } from '../../dist/types/interfaces';
import { Property, Style } from '../../src/utils/style';
import { Processor } from '../../src/lib';
import { hex2RGB } from '../../src/utils';
import plugin from '../../src/plugin';

const processor = new Processor();

describe('Plugin Method', () => {
  it('addUtilities', () => {
    const utilities = {
      '.skew-10deg': {
        transform: 'skewY(-10deg)',
      },
      '.skew-15deg': {
        transform: 'skewY(-15deg)',
      },
    };
    expect(processor.addUtilities(utilities).map(i => i.build()).join('\n')).toBe('.skew-10deg {\n  transform: skewY(-10deg);\n}\n.skew-15deg {\n  transform: skewY(-15deg);\n}');
  });

  it('addUtilities with non-class styles', () => {
    const utilities = {
      '.skew-10deg': {
        transform: 'skewY(-10deg)',
      },
      '.skew-15deg': {
        transform: 'skewY(-15deg)',
      },
      '[data-theme]': { '--active': '#0099FF' },
    };
    processor.addUtilities(utilities);
    expect(processor.interpret('skew-10deg').styleSheet.build()).toEqual('.skew-10deg {\n  transform: skewY(-10deg);\n}');
    expect(processor.preflight(undefined, false, false, true).build()).toEqual(
      `[data-theme] {
  --active: #0099FF;
}`);
  });

  it('add duplicated utilities', () => {
    const a = {
      '.btn': {
        padding: '.5rem 1rem',
      },
    };

    const b = {
      '.btn': {
        borderRadius: '.25rem',
        fontWeight: '600',
      },
    };

    const processor = new Processor();
    processor.addUtilities(a);
    processor.addUtilities(b);
    expect(processor.interpret('btn').styleSheet.build()).toMatchSnapshot('css');
  });

  it('add pseudo utilities', () => {
    const utilities = {
      '.btn': {
        padding: '.5rem 1rem',
        borderRadius: '.25rem',
      },
      '.btn:hover': {
        color: '#fff',
      },
      '.hover\\:abc:hover': {
        color: '#1c1c1e',
      },
      '@media (min-width: 640px)': {
        '.hover\\:abc:hover': {
          color: '#fff',
        },
      },
      '@media (min-width: 768px)': {
        '@keyframes ping': {
          '.test': {
            color: 'red',
          },
          '.btn': {
            fontWeight: '600',
          },
        },
      },
    };
    const processor = new Processor();
    processor.addUtilities(utilities);
    expect(processor.interpret('btn hover:abc test').styleSheet.build()).toMatchSnapshot('css');
  });

  it('add multi utilities', () => {
    const utilities = {
      '.a, .b:hover, [type=\'button\']': {
        padding: '.5rem 1rem',
        borderRadius: '.25rem',
      },
    };
    const processor = new Processor();
    processor.addUtilities(utilities);
    expect(processor.preflight(undefined, false, false, true).build()).toMatchSnapshot('preflight');
    expect(processor.interpret('a').styleSheet.build()).toMatchSnapshot('a');
    expect(processor.interpret('b').styleSheet.build()).toMatchSnapshot('b');
  });

  it('addComponents', () => {
    const buttons = {
      '.btn': {
        padding: '.5rem 1rem',
        borderRadius: '.25rem',
        fontWeight: '600',
      },
      '.btn-blue': {
        backgroundColor: '#3490dc',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#2779bd',
        },
      },
      '.btn-red': {
        backgroundColor: '#e3342f',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#cc1f1a',
        },
      },
    };

    expect(processor.addComponents(buttons).map(i => i.build()).join('\n')).toBe('.btn {\n  padding: .5rem 1rem;\n  border-radius: .25rem;\n  font-weight: 600;\n}\n.btn-blue {\n  background-color: #3490dc;\n  color: #fff;\n}\n.btn-blue:hover {\n  background-color: #2779bd;\n}\n.btn-red {\n  background-color: #e3342f;\n  color: #fff;\n}\n.btn-red:hover {\n  background-color: #cc1f1a;\n}');
  });

  it('addComponents #242', () => {
    const processor = new Processor();
    processor.addComponents({
      '.avatar>div': { display: 'block', overflow: 'hidden' },
      '.avatar+div': { display: 'block', overflow: 'hidden' },
      '.avatar div': { display: 'block', overflow: 'hidden' },
      '.avatar~div': { display: 'block', overflow: 'hidden' },
    });
    const css = processor.preflight(undefined, false, false, true).build();
    expect(css).toMatchSnapshot('css');
  });

  it('addComponents with non-class styles ', () => {
    const processor = new Processor();
    const components = {
      '[data-theme]': { '--active': '#0099FF' },
      '[data-theme="dark"]': {
        '--primary': '#111111',
        '--on-primary': '#B4B4B4',
        '--on-primary-active': '#F2F2F2',
        '--frame': '#1E1E1E',
        '--on-frame': '#808080',
        '--on-frame-active': 'var(--on-primary)',
      },
      '[data-theme="light"]': {
        '--primary': '#FFFFFF',
        '--on-primary': '#888888',
        '--on-primary-active': '#333333',
        '--frame': '#EFEFEF',
        '--on-frame': '#808080',
        '--on-frame-active': 'var(--on-primary)',
      },
    };
    processor.addComponents(components);
    const css = processor.preflight('test', false, false, true).build();
    expect(css).toMatchSnapshot('css');
  });

  it('add duplicated components', () => {
    const a = {
      '.btn': {
        padding: '.5rem 1rem',
      },
    };

    const b = {
      '.btn': {
        borderRadius: '.25rem',
        fontWeight: '600',
      },
    };

    const processor = new Processor();
    processor.addComponents(a);
    processor.addComponents(b);
    expect(processor.interpret('btn').styleSheet.build()).toMatchSnapshot('css');
  });

  it('add pseudo components', () => {
    const utilities = {
      '.btn': {
        padding: '.5rem 1rem',
        borderRadius: '.25rem',
      },
      '.btn:hover': {
        color: '#fff',
      },
      '.hover\\:abc:hover': {
        color: '#1c1c1e',
      },
      '@media (min-width: 640px)': {
        '.hover\\:abc:hover': {
          color: '#fff',
        },
      },
      '@media (min-width: 768px)': {
        '@keyframes ping': {
          '.test': {
            color: 'red',
          },
          '.btn': {
            fontWeight: '600',
          },
        },
      },
    };
    const processor = new Processor();
    processor.addComponents(utilities);
    expect(processor.interpret('btn').styleSheet.build()).toMatchSnapshot('css');
  });

  it('interpret order should follow add components order', () => {
    const a = {
      '.btn': {
        padding: '.5rem 1rem',
      },
    };

    const b = {
      '.btn-sm': {
        borderRadius: '.25rem',
        fontWeight: '600',
      },
      '.btn-lg': {
        borderRadius: '.5rem',
        fontWeight: '700',
      },
    };

    const processor = new Processor();
    processor.addComponents(a);
    processor.addComponents(b);
    expect(processor.interpret('btn-lg btn-sm btn').styleSheet.build()).toMatchSnapshot('css');
    expect(processor.interpret('btn-lg btn-sm btn').styleSheet.build()).toEqual(processor.interpret('btn btn-sm btn-lg').styleSheet.build());
  });

  it('addBase', () => {
    const processor = new Processor();
    expect(processor.addBase({
      'h1': { fontSize: (processor.theme('fontSize.2xl') as FontSize)[0] ?? '1.5rem' },
      'h2': { fontSize: (processor.theme('fontSize.xl') as FontSize)[0] ?? '1.25rem' },
      'h3': { fontSize: (processor.theme('fontSize.lg') as FontSize)[0] ?? '1.125rem' },
    }).map(i => i.build()).join('\n')).toBe('h1 {\n  font-size: 1.5rem;\n}\nh2 {\n  font-size: 1.25rem;\n}\nh3 {\n  font-size: 1.125rem;\n}');
  });

  it('add static base styles', () => {
    const processor = new Processor();
    processor.addBase({
      'h1': { fontSize: (processor.theme('fontSize.2xl') as FontSize)[0] ?? '1.5rem' },
      'h2': { fontSize: (processor.theme('fontSize.xl') as FontSize)[0] ?? '1.25rem' },
    });

    expect(processor.preflight(undefined, false, false, true).build()).toEqual('h1 {\n  font-size: 1.5rem;\n}\nh2 {\n  font-size: 1.25rem;\n}');
  });

  it('addVariant pseudoClass', () => {
    const test = new Style('.float-right', new Property('float', 'right'));
    const style = processor.addVariant('hocus', ({ pseudoClass }) => {
      return pseudoClass('hover:focus');
    });
    expect(Array.isArray(style) || style.extend(test).build()).toMatchSnapshot('extend');
    expect(processor.interpret('hocus:float-right').styleSheet.build()).toMatchSnapshot('css');
  });

  it('addVariant modifySelectors', () => {
    const test = new Style('.float-right', new Property('float', 'right'));
    const style = processor.addVariant('disabled', ({ modifySelectors, separator }) => {
      return modifySelectors(({ className }) => {
        return `.${processor.e(`disabled${separator}${className}`)}:disabled`;
      });
    });
    const css = Array.isArray(style) || style.extend(test).build();
    expect(css).toMatchSnapshot('css');
  });

  it('#72 plugin test', () => {
    const processor = new Processor({
      plugins: [
        {
          handler: ({ addUtilities }) => {
            addUtilities({});
          },
          config: {
            theme: {
              extend: {
                colors: {
                  active: 'var(--active)',
                  primary: 'var(--primary)',
                  'on-primary': 'var(--on-primary)',
                  'on-primary-active': 'var(--on-primary-active)',
                  frame: 'var(--frame)',
                  'on-frame': 'var(--on-frame)',
                  'on-frame-active': 'var(--on-frame-active)',
                },
              },
            },
          },
        },
      ],
    });
    expect(processor.theme('colors.white')).toEqual('#fff');
    expect(processor.theme('colors.active')).toEqual('var(--active)');
    expect(processor.interpret('bg-active bg-on-primary-active').styleSheet.build()).toEqual(`.bg-active {
  background-color: var(--active);
}
.bg-on-primary-active {
  background-color: var(--on-primary-active);
}`);
  });

  it('css vars inside css fns stay intact', () => {
    const processor = new Processor({
      plugins: [
        {
          handler: ({ addUtilities }) => {
            addUtilities({});
          },
          config: {
            theme: {
              extend: {
                colors: {
                  primary: 'var(--testvar)',
                  'secondary': 'hsla(145, 40%, 90%, 1)',
                  'secondaryvar': 'hsla(var(--testvar / 1))',
                },
              },
            },
          },
        },
      ],
    });
    expect(processor.theme('colors.primary')).toEqual('var(--testvar)');
    expect(processor.theme('colors.secondary')).toEqual('hsla(145, 40%, 90%, 1)');
    expect(processor.theme('colors.secondaryvar')).toEqual('hsla(var(--testvar / 1))');

    const ssPrimary = processor.interpret('bg-primary').styleSheet.build();
    expect(ssPrimary).toEqual('.bg-primary {\n  background-color: var(--testvar);\n}');

    const ssSecondary = processor.interpret('bg-secondary').styleSheet.build();
    expect(ssSecondary).toEqual('.bg-secondary {\n  --tw-bg-opacity: 1;\n  background-color: rgba(219, 240, 228, var(--tw-bg-opacity));\n}');

    const ssSecondVar = processor.interpret('bg-secondaryvar').styleSheet.build();
    expect(ssSecondVar).toEqual('.bg-secondaryvar {\n  background-color: hsla(var(--testvar / 1));\n}');
  });

  it('syntax for hex colors', () => {
    const processor = new Processor({
      plugins: [
        plugin(function ({ addDynamic }) {
          addDynamic('bg', ({ Utility, Style, Property }) => {
            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(Utility.body)) {
              return Style(Utility.class, [
                Property('--tw-bg-opacity', '1'),
                Property(
                  'background-color',
                  `rgba(${hex2RGB(Utility.body)?.join(', ')}, var(--tw-bg-opacity))`
                ),
              ]);
            }
          });
        }),
      ],
    });
    expect(processor.interpret('bg-#1c1c1e').styleSheet.build()).toEqual(
      `.bg-\\#1c1c1e {
  --tw-bg-opacity: 1;
  background-color: rgba(28, 28, 30, var(--tw-bg-opacity));
}`);

  });

  it('plugin extend function', () => {
    const processor = new Processor({
      plugins: [
        plugin(function() {
          return;
        }, {
          theme: {
            extend: {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              colors: theme => ({
                'nord0': '#2E3440',
              }),
            },
          },
        }),
      ],
    });
    expect(processor.theme('colors.nord0')).toEqual('#2E3440');
  });

  it('dump config', () => {
    const processor = new Processor({
      plugins: [
        plugin(function() {
          return;
        }, {
          theme: {
            extend: {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              colors: theme => ({
                'nord0': '#2E3440',
              }),
            },
          },
        }),
      ],
    });
    const js = processor.dumpConfig();
    const config = eval(js);
    const newProcessor = new Processor(config);
    expect(newProcessor.interpret('bg-nord0').styleSheet.build()).toMatchSnapshot('css');
  });

  it('add nest class name', () => {
    const a = {
      '.btn.loading:before': {
        'borderRadius': '9999px',
        'borderWidth': '2px',
        'height': '1rem',
        'marginRight': '.5rem',
        'width': '1rem',
        'WebkitAnimation': 'spin 2s linear infinite',
        'animation': 'spin 2s linear infinite',
        'content': '""',
        'borderColor': 'transparent currentColor currentColor transparent',
      },
    };

    const processor = new Processor();
    processor.addComponents(a);
    expect(processor.preflight(undefined, false, false, true).build()).toMatchSnapshot('css');
  });
});
