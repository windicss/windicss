const colors = require("../../dist/colors");

describe("color interface test", () => {
  it("import", () => {
    expect(colors.black).toEqual("#000");
  });
})
