import { negateValue } from './tools';
import { Property, Keyframes } from './style';
import type { FontSize } from '../interfaces';

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function negative(scale: {
  [key: string]: string;
}): { [key: string]: string } {
  return Object.keys(scale)
    .filter((key) => scale[key] !== '0')
    .reduce(
      (negativeScale, key) => ({
        ...negativeScale,
        [`-${key}`]: negateValue(scale[key]),
      }),
      {}
    );
}

export function breakpoints(
  screens: { [key: string]: string } = {}
): { [key: string]: string } {
  return Object.keys(screens)
    .filter((key) => typeof screens[key] === 'string')
    .reduce(
      (breakpoints, key) => ({
        ...breakpoints,
        [`screen-${key}`]: screens[key],
      }),
      {}
    );
}

export function generateKeyframe(
  name: string,
  children: { [key: string]: { [key: string]: string } }
): Keyframes[] {
  const output: Keyframes[] = [];
  for (const [key, value] of Object.entries(children)) {
    const style = new Keyframes(key).atRule(`@keyframes ${name}`);
    const webkitStyle = new Keyframes(key).atRule(
      `@-webkit-keyframes ${name}`
    );
    for (const [pkey, pvalue] of Object.entries(value)) {
      let prop: string | string[] = pkey;
      if (pkey === 'transform') {
        prop = ['-webkit-transform', 'transform'];
      } else if (
        ['animationTimingFunction', 'animation-timing-function'].includes(pkey)
      ) {
        prop = [
          '-webkit-animation-timing-function',
          'animation-timing-function',
        ];
      }
      style.add(new Property(prop, pvalue));
      webkitStyle.add(new Property(prop, pvalue));
    }
    output.push(style);
    output.push(webkitStyle);
  }
  return output;
}

export function generateFontSize(font: FontSize): Property[] {
  if (typeof font === 'string') return [ new Property('font-size', font) ];
  const properties: Property[] = [];
  if (font[0]) properties.push(new Property('font-size', font[0]));
  if (typeof font[1] === 'string') {
    properties.push(new Property('line-height', font[1]));
  } else if (font[1]){
    if (font[1].lineHeight) properties.push(new Property('line-height', font[1].lineHeight));
    if (font[1].letterSpacing) properties.push(new Property('letter-spacing', font[1].letterSpacing));
  }
  return properties;
}

export function expandDirection(
  value: string,
  divide = false
): [a: string, b?: string] | undefined {
  const map: { [key: string]: [a: string, b?: string] } = {
    '': ['*'],
    y: ['top', 'bottom'],
    x: ['left', 'right'],
    t: divide ? ['top-left', 'top-right'] : ['top'],
    r: divide ? ['top-right', 'bottom-right'] : ['right'],
    b: divide ? ['bottom-right', 'bottom-left'] : ['bottom'],
    l: divide ? ['top-left', 'bottom-left'] : ['left'],
    tl: ['top-left'],
    tr: ['top-right'],
    br: ['bottom-right'],
    bl: ['bottom-left'],
  };
  if (value in map) return map[value];
}
