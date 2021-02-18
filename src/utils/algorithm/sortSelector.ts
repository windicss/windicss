import type { Style } from '../style';
import { keyOrder } from '../../config/order';

function getWeights(a: string): number {
  const first = a.charAt(0);
  const second = a.charAt(1);
  if (first === ':' && second === ':') return 59; // ::moz ...
  if (first === '#') return 500; // #id ...
  if (first !== '.') return first.charCodeAt(0); // html, body ...
  const matches = a.match(/\w+/);
  const key = matches ? matches[0] : undefined;
  if (key && keyOrder[key]) return keyOrder[key];
  return 499;
}

export default function sortSelector(a: Style, b: Style): number {
  if (a.selector && b.selector) {
    return getWeights(a.selector) - getWeights(b.selector);
  }
  return 0;
}
