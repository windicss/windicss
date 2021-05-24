export function uniq<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function castArray<T>(value: T): unknown[] {
  if (!arguments.length) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export function isUsableColor(color: string, values: string | {[key:string]:string}): boolean {
  return Boolean(values && typeof values === 'object' && color !== 'gray' && values[600]);
}

export const round = (num: number): string =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '');

export const rem = (px: number): string => `${round(px / 16)}rem`;

export const em = (px: number, base: number): string => `${round(px / base)}em`;
