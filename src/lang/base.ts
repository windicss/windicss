export function isClass(obj: Record<string, unknown>): boolean {
  const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === 'class';
  if(obj.prototype === undefined) return isCtorClass;
  const proptotype = obj.prototype as Record<string, unknown>;
  const isPrototypeCtorClass = proptotype.constructor && proptotype.constructor.toString && proptotype.constructor.toString().substring(0, 5) === 'class';
  return isCtorClass || isPrototypeCtorClass;
}

export function __call__(obj: Record<string, unknown>, args: unknown[]): unknown {
  // @ts-expect-error types are unnecessary
  return isClass(obj) ? new obj(...args) : obj(...args);
}
