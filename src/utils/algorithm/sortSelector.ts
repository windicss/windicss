import type { Style } from '../style';
import { keyOrder } from '../../config/order';
import sortMediaQuery from './sortMediaQuery';

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

export function sortMeta(a: Style, b: Style): number {
  return sortMediaQuery(a.meta.variants?.[0] || '', b.meta.variants?.[0] || '') || (a.meta.order - b.meta.order) || (a.meta.offset - b.meta.offset) || +b.meta.corePlugin - +a.meta.corePlugin;
}

export default function sortSelector(a: Style, b: Style): number {
  if (a.selector && b.selector) {
    return getWeights(a.selector) - getWeights(b.selector);
  }
  return 0;
}
