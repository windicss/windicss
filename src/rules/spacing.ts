import type { CSSEntries,DynamicMatcher, Rule } from '@unocss/core'
import { directionSize } from '@unocss/preset-mini/utils'

export const paddings: Rule[] = [
  [/^p()-(.+)$/, directionSize('padding')],
  [/^p([xytlbr])-(.+)$/, directionSize('padding')],
]

export const margins: Rule[] = [
  [/^m()-(.+)$/, directionSize('margin')],
  [/^-m()-(.+)$/, directionSize('margin')],
  [/^m([xyrltb])-(.+)$/, directionSize('margin')],
  [/^-m([xyrltb])-(.+)$/, directionSize('margin')],
]

// // fixme: error
// export const spaces: Rule[] = [
//   [/^space-?([xy])-?(-?.+)$/, ([_, direction, size]) => {
//     if (size === 'reverse')
//       return { [`--windi-space-${direction}-reverse`]: 1 }

//     const results = directionSize('margin')(match)?.map((item) => {
//       const value = item[0].endsWith('right') || item[0].endsWith('bottom')
//         ? `calc(${item[1]} * var(--windi-space-${direction}-reverse))`
//         : `calc(${item[1]} * calc(1 - var(--windi-space-${direction}-reverse)))`
//       return [item[0], value] as typeof item
//     })
//     if (results) {
//       return [
//         [`--windi-space-${direction}-reverse`, 0],
//         ...results,
//       ]
//     }
//   }],
// ]