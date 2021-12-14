import plugin from '../index';
import { dashToCamel, expandDirection } from '../../utils';

// TODO: tsconfig -> ES2019 (node 12+)
// https://node.green/#ES2019-features--Object-fromEntries
// https://github.com/microsoft/TypeScript/issues/30933#issuecomment-591682635
function fromEntries<T>(entries: [keyof T, T[keyof T]][]): T {
  return entries.reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    <T>{}
  );
}

// docs
// https://www.w3.org/TR/css-scroll-snap-1/#scroll-snap-position

export default plugin(
  function ({ addUtilities, addDynamic, theme, variants }) {
    addUtilities({
      // visual hide scrollbar
      '.scrollbar-hide': {
        /* Firefox */
        'scrollbar-width': 'none',

        /* Safari and Chrome */
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },

      // scroll-snap-align,
      ...fromEntries(
        ['start', 'end', 'center'].map((align) => [
          `.snap-${align}`,
          { 'scroll-snap-align': align },
        ])
      ),

      '.snap-align-none': {
        'scroll-snap-align': 'none',
      },

      // scroll-snap-type
      '.snap': {
        'scroll-snap-type':
          'var(--scroll-snap-axis, both) var(--scroll-snap-strictness, mandatory)',
      },

      // strictness
      // https://www.w3.org/TR/css-scroll-snap-1/#snap-strictness
      ...fromEntries(
        ['none', 'mandatory', 'proximity'].map((strictness) => [
          `.snap-${strictness}`,
          { '--scroll-snap-strictness': strictness },
        ])
      ),

      // axis
      ...fromEntries(
        ['x', 'y', 'block', 'inline', 'both'].map((axis) => [
          `.snap-${axis}`,
          { '--scroll-snap-axis': axis },
        ])
      ),

      // stop limits
      ...fromEntries(
        ['normal', 'always'].map((limit) => [
          `.snap-${limit}`,
          { 'scroll-snap-stop': limit },
        ])
      ),
    });

    ['margin', 'padding'].forEach((name) => {
      const n = name.charAt(0);
      const tn = dashToCamel(`snap-${name}`);

      addDynamic(
        `snap-${n}`,
        ({ Utility, Property }) => {
          const value = Utility.handler
            .handleStatic(theme(tn))
            .handleSquareBrackets()
            .handleSpacing()
            .handleSize()
            .handleNegative()
            .handleVariable().value;

          if (!value) return;

          const suf = Utility.raw.split('-');

          const directions = expandDirection(
            suf.length ? suf[1].substring(1) : '',
            false
          );

          if (directions) {
            if (directions[0] === '*') return Property(`scroll-${name}`, value);
            return Property(
              directions.map((i) => `scroll-${name}-${i}`),
              value
            );
          }
        },
        {
          variants: variants(tn),
          group: tn,
          completions: [
            ...['{static}', '{float}', '{size}', '${var}', '[7px]']
              .map(type => ['', 'y', 'x', 't', 'l', 'b', 'r']
                .map(i => `snap-${n}${i}-${type}`))
              .reduce((a, b) => a.concat(b), []),
          ],
        }
      );
    });
  },
  {
    theme: {
      snapMargin: (theme) => ({
        auto: 'auto',
        ...(theme('spacing') ?? {}),
      }),
      snapPadding: (theme) => theme('spacing'),
    },
    variants: {
      snapMargin: ['responsive'],
      snapPadding: ['responsive'],
    },
  }
);
