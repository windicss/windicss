import { defaultColors as colors } from '../../config/base';
import { em } from './utils';
import type { ThemeUtil } from '../../interfaces';

const styles: (
  theme: ThemeUtil
) => { [key: string]: { css: { [key: string]: unknown }[] } } = (
  theme: ThemeUtil
) => ({
  DEFAULT: {
    css: [
      {
        'ol > li': {
          paddingLeft: 'initial',
          paddingRight: em(28, 16),
        },
        'ol > li::before': {
          left: 'initial',
          right: '0',
        },
        'ul > li': {
          paddingLeft: 'initial',
          paddingRight: em(28, 16),
        },
        'ul > li::before': {
          left: 'initial',
          right: em(4, 16),
        },
        blockquote: {
          borderLeftWidth: '0',
          borderRightWidth: '0.25rem',
          paddingLeft: 'initial',
          paddingRight: em(20, 20),
        },
        table: {
          textAlign: 'right',
        },
        'thead th:first-child': {
          paddingLeft: 'initial',
          paddingRight: '0',
        },
        'thead th:last-child': {
          paddingRight: 'initial',
          paddingLeft: '0',
        },
        'tbody td:first-child': {
          paddingLeft: 'initial',
          paddingRight: '0',
        },
        'tbody td:last-child': {
          paddingRight: 'initial',
          paddingLeft: '0',
        },
      },
    ],
  },
  sm: {
    css: [
      {
        blockquote: {
          paddingLeft: 'initial',
          paddingRight: em(20, 18),
        },
        'ol > li': {
          paddingLeft: 'initial',
          paddingRight: em(22, 14),
        },
        'ol > li::before': {
          left: 'initial',
          right: '0',
        },
        'ul > li': {
          paddingLeft: 'initial',
          paddingRight: em(22, 14),
        },
        'ul > li::before': {
          left: 'initial',
          right: em(3, 14),
        },
        'thead th:first-child': {
          paddingLeft: 'initial',
          paddingRight: '0',
        },
        'thead th:last-child': {
          paddingRight: 'initial',
          paddingLeft: '0',
        },
        'tbody td:first-child': {
          paddingLeft: 'initial',
          paddingRight: '0',
        },
        'tbody td:last-child': {
          paddingRight: 'initial',
          paddingLeft: '0',
        },
      },
    ],
  },
  lg: {
    css: [
      {
        blockquote: {
          paddingLeft: 'initial',
          paddingRight: em(24, 24),
        },
        'ol > li': {
          paddingLeft: 'initial',
          paddingRight: em(30, 18),
        },
        'ol > li::before': {
          left: 'initial',
          right: '0',
        },
        'ul > li': {
          paddingLeft: 'initial',
          paddingRight: em(30, 18),
        },
        'ul > li::before': {
          left: 'initial',
          right: em(4, 18),
        },
        'thead th:first-child': {
          paddingLeft: 'initial',
          paddingRight: '0',
        },
        'thead th:last-child': {
          paddingRight: 'initial',
          paddingLeft: '0',
        },
        'tbody td:first-child': {
          paddingLeft: 'initial',
          paddingRight: '0',
        },
        'tbody td:last-child': {
          paddingRight: 'initial',
          paddingLeft: '0',
        },
      },
    ],
  },
  xl: {
    css: [
      {
        blockquote: {
          paddingLeft: 'initial',
          paddingRight: em(32, 30),
        },
        'ol > li': {
          paddingLeft: 'initial',
          paddingRight: em(36, 20),
        },
        'ol > li::before': {
          left: 'initial',
          right: '0',
        },
        'ul > li': {
          paddingLeft: 'initial',
          paddingRight: em(36, 20),
        },
        'ul > li::before': {
          left: 'initial',
          right: em(5, 20),
        },
        'thead th:first-child': {
          paddingLeft: 'initial',
          paddingRight: '0',
        },
        'thead th:last-child': {
          paddingRight: 'initial',
          paddingLeft: '0',
        },
        'tbody td:first-child': {
          paddingLeft: 'initial',
          paddingRight: '0',
        },
        'tbody td:last-child': {
          paddingRight: 'initial',
          paddingLeft: '0',
        },
      },
    ],
  },
  '2xl': {
    css: [
      {
        blockquote: {
          paddingLeft: 'initial',
          paddingRight: em(40, 36),
        },
        'ol > li': {
          paddingLeft: 'initial',
          paddingRight: em(40, 24),
        },
        'ol > li::before': {
          left: 'initial',
          right: '0',
        },
        'ul > li': {
          paddingLeft: 'initial',
          paddingRight: em(40, 24),
        },
        'ul > li::before': {
          left: 'initial',
          right: em(6, 24),
        },
        'thead th:first-child': {
          paddingLeft: 'initial',
          paddingRight: '0',
        },
        'thead th:last-child': {
          paddingRight: 'initial',
          paddingLeft: '0',
        },
        'tbody td:first-child': {
          paddingLeft: 'initial',
          paddingRight: '0',
        },
        'tbody td:last-child': {
          paddingRight: 'initial',
          paddingLeft: '0',
        },
      },
    ],
  },
});

export default styles;



