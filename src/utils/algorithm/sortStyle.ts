import type { Style } from '../style';
import sortMediaQuery from './sortMediaQuery';

function getWeights(a: string): number {
  const first = a.charAt(0);
  const second = a.charAt(1);
  if (first === ':' && second === ':') return 59; // ::moz ...
  if (first === '#') return 500; // #id ...
  if (first !== '.') return first.charCodeAt(0); // html, body ...
  return 499;
}

export function sortMeta(a: Style, b: Style): number {
  if (a.meta.type === 'base' && b.meta.type === 'base') return getWeights(a.selector ?? '') - getWeights(b.selector ?? '');
  return sortMediaQuery(a.meta.variants?.[0] || '', b.meta.variants?.[0] || '') || (a.meta.order - b.meta.order) || (a.meta.offset - b.meta.offset) || +b.meta.corePlugin - +a.meta.corePlugin;
}

export function sortHead(a: Style, b: Style): number {
  return getWeights(a.selector ?? '') - getWeights(b.selector ?? '');
}

export function sortGroup(a: Style, b: Style): number {
  return sortMediaQuery(a.meta.variants?.[0] || '', b.meta.variants?.[0] || '') || (a.meta.order - b.meta.order);
}
