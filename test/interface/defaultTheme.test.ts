import defaultTheme from "../../dist/defaultTheme";

describe("defaultTheme interface test", () => {
  it("import", () => {
    expect(defaultTheme.colors.black).toEqual("#000");
  });

  it("extend", () => {
    expect(Object.keys(defaultTheme.borderColor).length).toEqual(Object.keys(defaultTheme.colors).length+1);
  })
})
