import { Processor } from "../../src/lib";

const processor = new Processor();

describe("Plugin Method", () => {
  it("addUtilities", () => {
    const newUtilities = {
      '.skew-10deg': {
        transform: 'skewY(-10deg)',
      },
      '.skew-15deg': {
        transform: 'skewY(-15deg)',
      },
    }
    expect(processor.addUtilities(newUtilities).map(i=>i.build()).join('\n')).toBe('.skew-10deg {\n  transform: skewY(-10deg);\n}\n.skew-15deg {\n  transform: skewY(-15deg);\n}');
  })
})
