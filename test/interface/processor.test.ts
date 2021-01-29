import Processor from "../../dist";

describe("Processor interface test", () => {
  it("import", () => {
    const processor = new Processor();
    expect(processor.interpret('bg-white').styleSheet.build()).toEqual(".bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));\n}");
  });

  it("require", () => {
    const Processor = require("../../dist");
    const processor = new Processor();
    expect(processor.interpret('bg-white').styleSheet.build()).toEqual(".bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));\n}");
  })
})
