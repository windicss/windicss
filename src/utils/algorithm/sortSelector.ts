import type { Style } from "../style";

function getWeights(a: string): number {
  const first = a.charAt(0);
  const second = a.charAt(1);
  const map: { [key: string]: number } = {
    ".": 200,
    "#": 201,
  };
  if (first === ":" && second === ":") return 59;
  return first in map ? map[first] : first.charCodeAt(0);
}

export default function sortSelector(a: Style, b: Style): 1 | -1 | 0 {
  if (a.selector && b.selector) {
    return getWeights(a.selector) >= getWeights(b.selector) ? 1 : -1;
  }
  return 0;
}
