import { DeepNestObject, ThemeUtil } from '../../interfaces';
import { uniq, castArray, isUsableColor } from './utils';
import plugin from '../index';
import styles from './styles';
import rtlStyles from './rtl';
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
}>(
  ({
    modifiers,
    className = 'prose',
    rtl = false,
  } = {}) => {
    return function ({ addDynamic, theme }) {
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
      const config = theme('typography') as {
        [key: string]: Record<string, string>
      } & {
        rtl: { [key: string]: Record<string, string> };
      };

      const all: string[] = uniq([
        'DEFAULT',
        ...modifiers,
        ...Object.keys(config).filter(
          (modifier) => !DEFAULT_MODIFIERS.includes(modifier)
        ),
      ]);

      addDynamic(className, ({ Utility, Style }) => {
        const isDefault = Utility.raw === className;
        const modifier = isDefault? 'DEFAULT' : Utility.body;
        if (!all.includes(modifier)) return;
        return [
          ...Style.generate(isDefault? `.${className}` : `.${className}-${modifier}`, configToCss(config[modifier])),
          ...(rtl ? Style.generate(isDefault? `.${className}[dir="rtl"]` : `.${className}-${modifier}[dir="rtl"]`,
            configToCss(config['rtl'][modifier])) : []),
        ];
      });
    };
  },
  () => ({
    theme: { typography: (theme: ThemeUtil) => ({ ...styles(theme), rtl: rtlStyles(theme) }) },
    variants: { typography: ['responsive'] },
  })
);
