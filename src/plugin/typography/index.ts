import { DeepNestObject } from '../../interfaces';
import { uniq, castArray, isUsableColor } from './utils';
import plugin from '../index';
import styles from './styles';
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

export default plugin.withOptions(
  ({
    modifiers,
    className = 'prose',
  }: { modifiers?: string[]; className?: string } = {}) => {
    return function ({ addComponents, theme, variants }) {
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
        [key: string]: Record<string, string>;
      };

      const all: string[] = uniq([
        'DEFAULT',
        ...modifiers,
        ...Object.keys(config).filter(
          (modifier) => !DEFAULT_MODIFIERS.includes(modifier)
        ),
      ]);

      addComponents(
        all.map((modifier) => ({
          [modifier === 'DEFAULT'
            ? `.${className}`
            : `.${className}-${modifier}`]: configToCss(config[modifier]),
        })),
        variants('typography')
      );
    };
  },
  () => ({
    theme: { typography: styles },
    variants: { typography: ['responsive'] },
  })
);
