declare function snapshotContext(filename: string): void

declare namespace jasmine {
  interface Matchers {
    toEqualDiff(expected: string, reasons?: string);
    toMatchSnapshot(name: string?, filepath?: string);
  }
}
