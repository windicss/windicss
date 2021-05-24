import { colors } from '../../config';
import type { ThemeUtil } from '../../interfaces';

const styles: (
  theme: ThemeUtil
) => { css: { [key: string]: unknown }[] } = (
  theme: ThemeUtil
) => ({
  css: [
    {
      color: theme('colors.warm-gray.300', colors.warmGray[300]),
      '[class~="lead"]': {
        color: theme('colors.warm-gray.200', colors.warmGray[200]),
      },
      a: {
        color: theme('colors.warm-gray.200', colors.warmGray[200]),
      },
      strong: {
        color: theme('colors.warm-gray.200', colors.warmGray[200]),
      },
      'ol > li::before': {
        color: theme('colors.warm-gray.500', colors.warmGray[500]),
      },
      'ul > li::before': {
        backgroundColor: theme('colors.warm-gray.500', colors.warmGray[500]),
      },
      hr: {
        borderColor: theme('colors.warm-gray.800', colors.warmGray[800]),
      },
      blockquote: {
        color: theme('colors.warm-gray.500', colors.warmGray[500]),
        borderLeftColor: theme('colors.warm-gray.700', colors.warmGray[700]),
      },
      h1: {
        color: theme('colors.warm-gray.200', colors.warmGray[200]),
      },
      h2: {
        color: theme('colors.warm-gray.200', colors.warmGray[200]),
      },
      h3: {
        color: theme('colors.warm-gray.200', colors.warmGray[200]),
      },
      h4: {
        color: theme('colors.warm-gray.200', colors.warmGray[200]),
      },
      'figure figcaption': {
        color: theme('colors.warm-gray.400', colors.warmGray[400]),
      },
      code: {
        color: theme('colors.warm-gray.300', colors.warmGray[300]),
      },
      'a code': {
        color: theme('colors.warm-gray.100', colors.warmGray[100]),
      },
      pre: {
        color: theme('colors.warm-gray.100', colors.warmGray[100]),
        backgroundColor: theme('colors.warm-gray.900', colors.warmGray[900]),
      },
      'pre code': {
        backgroundColor: 'transparent',
        color: 'inherit',
      },
      thead: {
        color: theme('colors.warm-gray.100', colors.warmGray[100]),
        borderBottomColor: theme('colors.warm-gray.700', colors.warmGray[700]),
      },
      'tbody tr': {
        borderBottomColor: theme('colors.warm-gray.800', colors.warmGray[800]),
      },
    },
  ],
});

export default styles;



