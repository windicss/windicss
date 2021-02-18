declare function expectToMatchSnapshot(
  value: unknown,
  name: string,
  path: string
): void;

declare namespace jasmine {
  interface Matchers<T> {
    toEqualDiff(expected:string, reasons?:string)
  }
}
