import defaultTheme from "../../dist/defaultTheme";

describe("defaultTheme interface test", () => {
  it("import", () => {
    expect(defaultTheme.colors.black).toEqual("#000");
  });

  it("extend", () => {
    expect(Object.keys(defaultTheme.borderColor).length).toEqual(
      Object.keys(defaultTheme.colors).length + 1
    );
  });

  it("require", () => {
    const defaultTheme = require("../../dist/defaultTheme");
    expect(defaultTheme.colors.black).toEqual("#000");
  });

  it("require extend", () => {
    const defaultTheme = require("../../dist/defaultTheme");
    expect(Object.keys(defaultTheme.borderColor).length).toEqual(
      Object.keys(defaultTheme.colors).length + 1
    );
  });
});
