import { Processor } from '../../src/lib';
import plugin from '../../src/plugin';
import type { PluginFunction, PluginUtils } from '../../src/interfaces';

describe('plugin interface test', () => {
  it('import', () => {
    plugin(function({ addUtilities }) {
      const newUtilities = {
        '.skew-10deg': {
          transform: 'skewY(-10deg)',
        },
        '.skew-15deg': {
          transform: 'skewY(-15deg)',
        },
      };

      addUtilities(newUtilities);
    });
  });

  it('require', () => {
    const plugin = require('../../dist/plugin');
    plugin(function({ addUtilities }: PluginUtils) {
      const newUtilities = {
        '.skew-10deg': {
          transform: 'skewY(-10deg)',
        },
        '.skew-15deg': {
          transform: 'skewY(-15deg)',
        },
      };

      addUtilities(newUtilities);
    });
    expect(plugin.withOptions).toBeDefined();
  });

  // #232
  it('addComponents with attribute selectors', () => {
    const plugin: PluginFunction = (utils) => {
      utils.addComponents({
        '.btn-disabled,.btn[disabled]': {
          '-TwBgOpacity':['1', '0.2'],
          'backgroundColor':'hsla(var(--n,219 14% 28%)/var(--tw-bg-opacity))',
          '-TwBorderOpacity':'0',
          '-TwTextOpacity':['1', '0.2'],
          'color':'hsla(var(--bc,215 28% 17%)/var(--tw-text-opacity))',
        },
      });
    };
    const processor = new Processor({
      plugins: [plugin],
    });

    expect(processor.preflight(' ', false, false, true).build()).toMatchSnapshot('css');
  });

  // #238
  it('addComponents nested selectors', () => {
    const plugin: PluginFunction = (utils) => {
      utils.addComponents({
        '.card.compact .card-body': {
          fontSize: '.875rem',
          lineHeight: '1.25rem',
          padding: '1rem' },
      });
    };
    const processor = new Processor({
      plugins: [plugin],
    });

    expect(processor.preflight(' ', false, false, true).build()).toMatchSnapshot('css');
  });
});
