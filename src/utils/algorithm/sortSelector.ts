import type { Style } from "../style";

function getWeights(a: string): number {
  const first = a.charAt(0);
  const second = a.charAt(1);
  const map: { [key: string]: number } = {
    ".": 200,
    "#": 201,
  };
  if (first === ":" && second === ":")
    return 59;
  // utilities with more general prefix should be as lighter weight
  // e.g. `m-8` < `mt-4`
  const dashIndex = a.indexOf('-') || 0
  return first in map
    ? map[first] + dashIndex
    : first.charCodeAt(0) + dashIndex;
}

export default function sortSelector(a: Style, b: Style): number {
  if (a.selector && b.selector) {
    return getWeights(a.selector) - getWeights(b.selector)
  }
  return 0;
}
