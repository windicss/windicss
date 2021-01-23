import {
    negative,
    breakpoints,
    generateKeyframe,
    generateFontSize,
    expandDirection,
} from '../../src/utils';

import fs from 'fs';

import { Style, StyleSheet } from '../../src/utils/style';

describe('Helpers', () => {
    it('negative', () => {
        expect(negative({
            px: '1px',
            1: '0.25rem',
            2: '0.5rem',
            4: '1rem'
        })).toEqual({
            '-px': '-1px',
            '-1': '-0.25rem',
            '-2': '-0.5rem',
            '-4': '-1rem'
        })
    })

    it('breakpoints', () => {
        expect(breakpoints({
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        })).toEqual({
            'screen-sm': '640px',
            'screen-md': '768px',
            'screen-lg': '1024px',
            'screen-xl': '1280px',
            'screen-2xl': '1536px',
        })
    })

    it('generateKeyframes', () => {
        const bounce = {
            '0%, 100%': {
              transform: 'translateY(-25%)',
              animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
            },
            '50%': {
              transform: 'translateY(0)',
              animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
            },
        };

        const spin = {
            from: {
              transform: 'rotate(0deg)',
            },
            to: {
              transform: 'rotate(360deg)',
            },
        };

        expect(new StyleSheet(generateKeyframe('spin', spin)).build()).toEqual(`@keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}`);
        expect(new StyleSheet(generateKeyframe('bounce', bounce)).build()).toEqual(`@keyframes bounce {
  0%, 100% {
    -webkit-transform: translateY(-25%);
    transform: translateY(-25%);
    -webkit-animation-timing-function: cubic-bezier(0.8,0,1,1);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }
  50% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    -webkit-animation-timing-function: cubic-bezier(0,0,0.2,1);
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
}
@-webkit-keyframes bounce {
  0%, 100% {
    -webkit-transform: translateY(-25%);
    transform: translateY(-25%);
    -webkit-animation-timing-function: cubic-bezier(0.8,0,1,1);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }
  50% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    -webkit-animation-timing-function: cubic-bezier(0,0,0.2,1);
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
}`);
    })

    it('generateFontSize', () => {
        expect(new Style(undefined, generateFontSize(['0.75rem', { lineHeight: '1rem' }])).build(true)).toEqual('font-size:0.75rem;line-height:1rem;');
        expect(new Style(undefined, generateFontSize(['0.75rem'])).build(true)).toEqual('font-size:0.75rem;');
        expect(new Style(undefined, generateFontSize(['0.75rem', { lineHeight: '1rem', letterSpacing: '2px' }])).build(true)).toEqual('font-size:0.75rem;line-height:1rem;letter-spacing:2px;');
    })

    it('expandDirection', () => {
        expect(expandDirection('123')).toBeUndefined();
        expect(expandDirection('')).toEqual(['*']);
        expect(expandDirection('t')).toEqual(['top']);
        expect(expandDirection('t', true)).toEqual(['top-left', 'top-right']);
        expect(expandDirection('l')).toEqual(['left']);
        expect(expandDirection('l', true)).toEqual(['top-left', 'bottom-left']);
        expect(expandDirection('r')).toEqual(['right']);
        expect(expandDirection('r', true)).toEqual(['top-right', 'bottom-right']);
        expect(expandDirection('b')).toEqual(['bottom']);
        expect(expandDirection('b', true)).toEqual(['bottom-right', 'bottom-left']);
        expect(expandDirection('x')).toEqual(['left', 'right']);
        expect(expandDirection('x', true)).toEqual(['left', 'right']);
        expect(expandDirection('y')).toEqual(['top', 'bottom']);
        expect(expandDirection('y', true)).toEqual(['top', 'bottom']);
        expect(expandDirection('tl')).toEqual(['top-left']);
        expect(expandDirection('tr')).toEqual(['top-right']);
        expect(expandDirection('bl')).toEqual(['bottom-left']);
        expect(expandDirection('br')).toEqual(['bottom-right']);
    })
});
