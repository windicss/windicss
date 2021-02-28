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
      ...(toType(baseConfig.theme('spacing'), 'object') ?? {}),
      ...userConfig.theme.extend.spacing,
    });
    expect(processor.theme('borderRadius')).toEqual({
      ...(toType(baseConfig.theme('borderRadius'), 'object') ?? {}),
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
    expect(processor.theme('order')).toEqual({
      first: '-9999',
      last: '9999',
      none: '0',
      lg: '44',
    });
    expect(processor.theme('lineClamp')).toEqual({ sm: '4', lg: '9' });
  });

  it('resolveConfig should not overwrite theme function', () => {
    const processor = new Processor({
      theme: {
        extend: {
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
    expect(processor.theme('width')).toEqual({
      auto: 'auto',
      px: '1px',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      prose: '65ch',
      screen: '100vw',
      'screen-sm': '640px',
      'screen-md': '768px',
      'screen-lg': '1024px',
      'screen-xl': '1280px',
      'screen-2xl': '1536px',
      '1/7': '14%',
      '2/7': '28%',
      '3/7': '42%',
      '4/7': '57%',
      '5/7': '71%',
      '6/7': '85%',
    });
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

  it('important test', () => {
    const processor = new Processor({ important: true });
    expect(processor.interpret('sm:bg-black').styleSheet.build()).toBe(
      '@media (min-width: 640px) {\n  .sm\\:bg-black {\n    --tw-bg-opacity: 1 !important;\n    background-color: rgba(0, 0, 0, var(--tw-bg-opacity)) !important;\n  }\n}'
    );
  });

  it('important string test', () => {
    const processor = new Processor({ important: '#app' });
    expect(processor.interpret('sm:bg-black').styleSheet.build()).toBe(
      '@media (min-width: 640px) {\n  #app .sm\\:bg-black {\n    --tw-bg-opacity: 1;\n    background-color: rgba(0, 0, 0, var(--tw-bg-opacity));\n  }\n}'
    );
    expect(processor.interpret('dark:bg-white').styleSheet.build()).toBe(
      '.dark #app .dark\\:bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));\n}'
    );
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
          hwba: 'hwb(280, 40%, 60%, 0)',
          srgb: 'rgb(69.99%, 32%, 32%)',
        },
      },
    });
    expect(processor.interpret('bg-name bg-hex bg-hexa bg-rgb bg-rgba bg-hsl bg-hsla bg-hwb bg-hwba bg-srgb').styleSheet.build()).toMatchSnapshot('colors');
  });
});
