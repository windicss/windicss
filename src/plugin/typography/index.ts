import { DeepNestObject, ThemeUtil } from '../../interfaces';
import { uniq, castArray, isUsableColor } from './utils';
import plugin from '../index';
import styles from './styles';
import rtlStyles from './rtl';
import darkStyles from './dark';
import combineConfig from '../../utils/algorithm/combineConfig';

const computed: {
  [key: string]: (color: string) => Record<string, unknown>;
} = {
  // Reserved for future "magic properties", for example:
  // bulletColor: (color) => ({ 'ul > li::before': { backgroundColor: color } }),
};

function configToCss(config: Record<string, string> = {}): DeepNestObject {
  return [
    ...Object.keys(config)
      .filter((key) => computed[key])
      .map((key) => computed[key](config[key])),
    ...(castArray(config.css || {}) as Record<string, unknown>[]),
  ].reduce(
    (previous, current) => combineConfig(previous, current),
    {}
  ) as DeepNestObject;
}

export default plugin.withOptions<{
  modifiers?: string[];
  className?: string;
  rtl?: boolean;
  dark?: boolean;
}>(
  ({
    modifiers,
    className = 'prose',
    rtl = false,
    dark = false,
  } = {}) => {
    return function ({ addDynamic, theme, config }) {
      const DEFAULT_MODIFIERS = [
        'DEFAULT',
        'sm',
        'lg',
        'xl',
        '2xl',
        ...Object.entries(
          theme('colors') as {
            [key: string]: string | Record<string, string>;
          }
        )
          .filter(([color, values]) => isUsableColor(color, values))
          .map(([color]) => color),
      ];
      modifiers = modifiers === undefined ? DEFAULT_MODIFIERS : modifiers;
      const pluginConfig = theme('typography') as {
        [key: string]: Record<string, string>
      } & {
        RTL: { [key: string]: Record<string, string> };
      } & {
        DARK: Record<string, string>;
      };

      const darkMode = config('darkMode', 'class') as 'class' | 'media';

      const all: string[] = uniq([
        'DEFAULT',
        ...modifiers,
        ...Object.keys(pluginConfig).filter(
          (modifier) => !DEFAULT_MODIFIERS.includes(modifier)
        ),
      ]).filter(i => !['RTL', 'DARK'].includes(i));

      addDynamic(className, ({ Utility, Style }) => {
        const isDefault = Utility.raw === className;
        const modifier = isDefault? 'DEFAULT' : Utility.body;
        if (!all.includes(modifier)) return;
        return [
          ...Style.generate(isDefault? `.${className}` : `.${className}-${modifier}`, configToCss(pluginConfig[modifier])),
          ...(dark && isDefault? Style.generate(`.${className}`, configToCss(pluginConfig['DARK'])).map(i => darkMode === 'class' ? i.parent('.dark') : i.atRule('@media (prefers-color-scheme: dark)')) : [] ),
          ...(rtl ? Style.generate(isDefault? `.${className}[dir="rtl"]` : `.${className}-${modifier}[dir="rtl"]`,
            configToCss(pluginConfig['RTL'][modifier])).map(i => {
            i.meta.respectSelector = true;
            return i;
          }) : []),
        ];
      }, {
        layer: 'components',
        order: 149,
        group: 'typography',
        completions: all.map(i => i === 'DEFAULT' ? className : `${className}-${i}`),
      });
    };
  },
  () => ({
    theme: { typography: (theme: ThemeUtil) => ({ ...styles(theme), RTL: rtlStyles(theme), DARK: darkStyles(theme) }) },
    variants: { typography: ['responsive'] },
  })
);
