export default function combineConfig(
  a: { [key: string]: unknown },
  b: { [key: string]: unknown },
  arrayMergeDepth = Infinity,
): { [key: string]: unknown } {
  const output = { ...a };
  for (const [key_of_b, value_of_b] of Object.entries(b)) {
    if (key_of_b in a) {
      const value_of_a = a[key_of_b];
      if (value_of_a !== value_of_b) {
        if (value_of_b !== null && (value_of_b as string).constructor !== Object) {
          if (arrayMergeDepth > 0 && Array.isArray(value_of_a) && Array.isArray(value_of_b)) {
            output[key_of_b] = [...value_of_a, ...value_of_b];
          } else {
            output[key_of_b] = value_of_b;
          }
        } else if (value_of_a !== null && (value_of_a as { [key: string]: unknown }).constructor === Object) {
          output[key_of_b] = combineConfig(
            value_of_a as { [key: string]: unknown },
            value_of_b as { [key: string]: unknown },
            arrayMergeDepth - 1
          );
        } else if (Array.isArray(value_of_a)){
          output[key_of_b] = [
            ...value_of_a,
            ...Array.isArray(value_of_b) ? value_of_b : [value_of_b],
          ];
        } else {
          output[key_of_b] = {
            DEFAULT: value_of_a,
            ...value_of_b as { [key: string]: unknown },
          };
        }
      }
    } else {
      output[key_of_b] = value_of_b;
    }
  }
  return output;
}
