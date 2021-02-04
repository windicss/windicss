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
