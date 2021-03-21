type unknownObject = {[key:string]:unknown};

export default function diffConfig(
  a: unknown,
  b: unknown,
): unknown {
  if (typeof a !== typeof b) return b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (JSON.stringify(a) !== JSON.stringify(b)) return b;
    return;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const output: unknownObject = {};
    for (const [key, value] of Object.entries(b)) {
      if (key in a) {
        const diff = diffConfig((a as unknownObject)[key], (b as unknownObject)[key]);
        if (diff) output[key] = diff;
      } else {
        output[key] = value;
      }
    }
    if (Object.keys(output).length === 0) return;
    return output;
  }
  if (a !== b) return b;
}
