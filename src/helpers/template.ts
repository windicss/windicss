export function windi(strings: TemplateStringsArray, ...values: unknown[]): string {
  // windi template literal
  return strings.reduce((query, queryPart, i) => {
    const valueExists = i < values.length;
    const text = query + queryPart;

    return valueExists ? text + values[i] : text;
  }, '');
}
