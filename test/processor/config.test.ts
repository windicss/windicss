import { resolve } from 'path';
import { toType } from '../../src/utils/tools';
import { Processor } from '../../src/lib';
import { twExclude } from '../../src/config';

const configPath = resolve('./test/assets/tailwind.config.js');
const userConfig = require(configPath);

describe('Config', () => {
  const baseConfig = new Processor();

  it('dict input', () => {
    const processor = new Processor(userConfig);
    expect(processor.config('theme.screens')).toEqual(
      processor.theme('screens')
    );
    expect(processor.theme('screens')).toEqual(userConfig.theme.screens);
    expect(processor.theme('colors')).toEqual(userConfig.theme.colors);
    expect(processor.theme('colors.pink')).toEqual(
      userConfig.theme.colors.pink
    );
    expect(processor.theme('fontFamily')).toEqual(userConfig.theme.fontFamily);
    expect(processor.theme('spacing')).toEqual({
      ...toType(baseConfig.theme('spacing'), 'object'),
      ...userConfig.theme.extend.spacing,
    });
    expect(processor.theme('borderRadius')).toEqual({
      ...toType(baseConfig.theme('borderRadius'), 'object'),
      ...userConfig.theme.extend.borderRadius,
    });
  });

  it('resolveConfig should extend correctly', () => {
    const processor = new Processor({
      theme: {
        extend: {
          order: {
            lg: '44',
          },
          lineClamp: {
            sm: '4',
            lg: '9',
          },
        },
      },
    });
    expect(processor.theme('order')).toMatchSnapshot('order');
    expect(processor.theme('lineClamp')).toEqual({ sm: '4', lg: '9' });
  });

  it('resolveConfig should not overwrite theme function', () => {
    const processor = new Processor({
      theme: {
        extend: {
          colors: {
            red: {
              custom: '#ea1851',
            },
          },
          width: {
            '1/7': '14%',
            '2/7': '28%',
            '3/7': '42%',
            '4/7': '57%',
            '5/7': '71%',
            '6/7': '85%',
          },
        },
      },
    });
    expect(processor.theme('width')).toMatchSnapshot('extend-width');
    // theme.extend.colors overwrites defaults #141
    expect(processor.theme('colors.red')).toMatchSnapshot('extend-colors-red');
  });

  it('user theme should overwrite default theme', () => {
    const processor = new Processor({
      theme: {
        colors: {
          white: '#ffffff',
        },
      },
    });
    expect(processor.theme('colors')).toEqual({
      white: '#ffffff',
    });
  });

  it('change separator test', () => {
    const processor = new Processor({ separator: '_' });
    expect(processor.interpret('sm_bg-black').styleSheet.build()).toBe(
      '@media (min-width: 640px) {\n  .sm_bg-black {\n    --tw-bg-opacity: 1;\n    background-color: rgba(0, 0, 0, var(--tw-bg-opacity));\n  }\n}'
    );
  });

  it('add prefix test', () => {
    const processor = new Processor({ prefix: 'tw-' });
    expect(processor.interpret('sm:tw-bg-black').styleSheet.build()).toBe(
      '@media (min-width: 640px) {\n  .sm\\:tw-bg-black {\n    --tw-bg-opacity: 1;\n    background-color: rgba(0, 0, 0, var(--tw-bg-opacity));\n  }\n}'
    );
  });

  it('does not generate non-prefixed classes when using prefix', () => {
    const processor = new Processor({ prefix: 'windi-' });
    const classes = 'items-center justify-center flex-wrap block flex windi-block';
    // it should not compile the standard classes (items-center, justify-center) because they are not prefixed
    expect(processor.interpret(classes).styleSheet.build()).toBe(
      '.windi-block {\n  display: block;\n}'
    );
  });


  it('important test', () => {
    const processor = new Processor({ important: true });
    expect(processor.interpret('sm:bg-black').styleSheet.build()).toBe(
      '@media (min-width: 640px) {\n  .sm\\:bg-black {\n    --tw-bg-opacity: 1 !important;\n    background-color: rgba(0, 0, 0, var(--tw-bg-opacity)) !important;\n  }\n}'
    );
  });

  it('important string test', () => {
    const processor = new Processor({ important: '#app' });
    expect(processor.interpret('sm:bg-black').styleSheet.build()).toMatchSnapshot('css');
    expect(processor.interpret('dark:bg-white').styleSheet.build()).toMatchSnapshot('css');
  });

  it('animation config test', () => {
    const processor = new Processor({
      theme: {
        extend: {
          animation: {
            skbounce: 'skbounce 2.0s infinite ease-in-out',
          },
          keyframes: {
            skbounce: {
              '0%, 100%': { transform: 'scale(0.0)' },
              '50%': { transform: 'scale(1.0)' },
            },
          },
        },
      },
    });
    expect(processor.interpret('animate-skbounce').styleSheet.build()).toMatchSnapshot('animate');
  });

  it('color config test', () => {
    const processor = new Processor({
      darkMode: 'media', // or 'media' or 'class'
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
            darkTheme: {
              600: '#262A34',
              700: '#181A20',
              800: '#1A1B20',
            },
          },
        },
      },
    });
    expect(processor.theme('colors.darkTheme')).toEqual({
      600: '#262A34',
      700: '#181A20',
      800: '#1A1B20',
    });

    expect(processor.theme('colors.frame')).toEqual('var(--frame)');

    const styleSheet = processor.interpret('bg-darkTheme-600 bg-active bg-on-primary bg-on-frame-active').styleSheet;
    expect(styleSheet.build()).toMatchSnapshot('css');
  });

  it('handle colors test', () => {
    const processor = new Processor({
      theme: {
        extend: {
          colors: {
            discord: {
              DEFAULT: '#7289da',
              '100': '#7289da',
            },
            'primary-color-red': '#FF0000',
          },
        },
      },
    });
    const styleSheet = processor.interpret(
      'bg-discord bg-discord-100 bg-hex-7289da ring-offset-hex-1c1c1e ring-offset-gray-200 text-primary-color-red'
    ).styleSheet;
    expect(styleSheet.build()).toMatchSnapshot('css');
  });

  it('handle nest colors', () => {
    const processor = new Processor({
      theme: {
        extend: {
          colors: {
            my: {
              DEFAULT: '#000',
              custom: {
                red: '#ff0000',
                DEFAULT: '#fff',
              },
            },
          },
        },
      },
    });

    const styleSheet = processor.interpret('bg-my-custom-red bg-my bg-my-custom text-my-custom').styleSheet;
    expect(styleSheet.build()).toMatchSnapshot('colors');
  });

  it('exclude config', () => {
    const processor = new Processor({
      theme: {
        extend: {
          colors: {
            discord: {
              DEFAULT: '#7289da',
              '100': '#7289da',
            },
          },
        },
      },
      exclude: twExclude,
    });
    expect(processor.interpret('bg-hex-1c1c1e bg-$test-variable p-1rem p-4px p-3 p-4.2 sm:p-4.5').ignored.length).toEqual(7);
  });

  it('shortcuts config string', () => {
    const processor = new Processor({
      shortcuts: {
        'btn': 'py-2 px-4 font-semibold rounded-lg shadow-md',
        'btn-green': 'text-white bg-green-500 hover:bg-green-700',
      },
    });
    expect(processor.interpret('btn btn-green lg:btn').styleSheet.build()).toMatchSnapshot('shortcuts string');
  });

  it('shortcuts config object', () => {
    const processor = new Processor({
      shortcuts: {
        'btn': {
          'color': 'white',
          '@apply': 'py-2 px-4 font-semibold rounded-lg',
          '&:hover': {
            '@apply': 'bg-green-700',
            'color': 'black',
          },
        },
      },
    });
    expect(processor.interpret('btn').styleSheet.build()).toMatchSnapshot('shortcuts object');
  });

  it('allows to use prefix with shortcuts', () => {
    const processor = new Processor({
      prefix: 'windi-',
      shortcuts: {
        'btn': 'py-2 px-4 font-semibold rounded-lg shadow-md',
        'btn-green': {
          '@apply': 'text-white bg-green-500 hover:bg-green-700',
        },
      },
    });
    const result = processor.interpret('windi-btn windi-btn-green');
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toMatchSnapshot('shortcuts with prefix');
  });

  it('different colors', () => {
    const processor = new Processor({
      theme: {
        colors: {
          name: 'blue',
          hex: '#1c1c1e',
          hexa: '#0000ff00',
          rgb: 'rgb(23, 23, 24)',
          rgba: 'rgba(23, 23, 25, 0.5)',
          hsl: 'hsl(120, 100%, 50%)',
          hsla: 'hsla(120, 100%, 75%, 0.3)',
          hwb: 'hwb(280, 40%, 60%)',
          hwba: 'hwb(280, 40%, 60%, 0.7)',
          srgb: 'rgb(69.99%, 32%, 32%)',
        },
      },
    });
    expect(processor.interpret('bg-name bg-hex bg-hexa bg-rgb bg-rgba bg-hsl bg-hsla bg-hwb bg-hwba bg-srgb').styleSheet.build()).toMatchSnapshot('colors');
  });

  it('close corePlugins', () => {
    const processor = new Processor({
      corePlugins: {
        container: false,
        animation: false,
      },
    });
    expect(processor.interpret('container sm:container animate-ping bg-red-200').ignored.length).toEqual(3);
    expect(processor.interpret('bg-red-500').success.length).toEqual(1);
  });

  it('set corePlugins', () => {
    const processor = new Processor({
      corePlugins: [
        'cursor',
        'backgroundColor',
      ],
    });
    expect(processor.interpret('cursor-pointer bg-red-200 bg-green-300 font-bold container').success.length).toEqual(3);
  });

  it('variables theme config', () => {
    const processor = new Processor({
      theme: {
        vars: {
          primary: '#6366f1',
        },
      },
    });
    expect(processor.preflight(undefined, false, false, true).build()).toMatchSnapshot('css');
  });

  it('config for alpha channel', () => {
    const processor = new Processor({
      theme: {
        extend: {
          colors: {
            background: 'rgba(255, 0, 0, 0.5)',
          },
        },
      },
    });
    expect(processor.interpret('bg-background').styleSheet.build()).toEqual(`.bg-background {
  --tw-bg-opacity: 0.5;
  background-color: rgba(255, 0, 0, var(--tw-bg-opacity));
}`);
  });

  it('presets test', () => {
    const processor = new Processor({
      presets: [
        {
          theme: {
            colors: {
              blue: {
                light: '#85d7ff',
                DEFAULT: '#1fb6ff',
                dark: '#009eeb',
              },
              pink: {
                light: '#ff7ce5',
                DEFAULT: '#ff49db',
                dark: '#ff16d1',
              },
            },
            extend: {
              flexGrow: {
                2: '20',
              },
            },
          },
        },
        {
          theme: {
            colors: {
              pink: {
                light: '#ff7ce5',
                DEFAULT: '#ff49db',
                dark: '#ff16d1',
              },
            },
          },
        },
      ],
      theme: {
        extend: {
          minHeight: {
            48: '12rem',
          },
        },
      },
    });
    expect(processor.theme('colors.blue.light')).toEqual('#85d7ff');
    expect(processor.theme('colors.blue.400')).toBeUndefined();
    expect(processor.theme('minHeight.48')).toEqual('12rem');
    expect(processor.theme('colors.pink.light')).toEqual('#ff7ce5');
    expect(processor.theme('colors.pink.500')).toBeUndefined();
    expect(processor.theme('flexGrow.0')).toEqual('0');
    expect(processor.theme('flexGrow.2')).toEqual('20');
  });

  it('darkColor test', () => {
    const processor = new Processor({
      darkMode: 'media',
      prefixer: false,
      theme: {
        extend: {
          colors: {
            gray: {
              200: '#1c1c1e',
            },
            blue: {
              400: ['#339AF0', '#A5D8FF'],
            },
          },
        },
      },
    });
    expect(processor.interpret('~dark:text-red-500').styleSheet.build()).toMatchSnapshot('css');
    expect(processor.interpret('~dark:(text-blue-400 placeholder-gray-200 bg-green-300 divide-red-200)').styleSheet.build()).toMatchSnapshot('css');
  });

  it('extend black', () => {
    const processor = new Processor({
      theme: {
        extend: {
          colors: {
            black : {
              300: '#1c1c1e',
              400: '#200',
            },
          },
        },
      },
    });
    expect(processor.interpret('bg-black-300 bg-black bg-black-400').styleSheet.build()).toMatchSnapshot('css');
  });

  it('config with brackets', () => {
    const processor = new Processor({
      theme: {
        extend: {
          height: theme => ({
            '(custom)': `calc(100% - ${theme('spacing.16')})`,
          }),
        },
      },
    });
    expect(processor.interpret('h-(custom) text-lg font-bold').styleSheet.build()).toMatchSnapshot('css');
  });

  // #218
  it('dashify', () => {
    const processor = new Processor({
      shortcuts: {
        foo: {
          '-TwBgOpacity': '1',
        },
        bar: {
          'TwBgOpacity': '1',
        },
        caps: {
          'TestCSS': '1',
        },
      },
    });
    expect(processor.interpret('foo bar caps').styleSheet.build()).toMatchSnapshot('css');
  });
});
