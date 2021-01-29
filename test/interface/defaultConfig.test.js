const defaultConfig = require("../../dist/defaultConfig");

describe("defaultConfig interface test", () => {
  it("import", () => {
    expect(defaultConfig.darkMode).toEqual("class");
  });

  it("extend", () => {
    expect(Object.keys(defaultConfig.theme.borderColor).length).toEqual(Object.keys(defaultConfig.theme.colors).length+1);
  })
})
