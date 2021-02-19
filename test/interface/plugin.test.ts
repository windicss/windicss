import plugin from '../../dist/plugin';
import type { PluginUtils } from '../../dist/types/interfaces';

describe('color interface test', () => {
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
});
