import { resolve } from "path";
import { toType } from "../../src/utils/tools";
import { Processor } from "../../src/lib";

const configPath = resolve("./test/assets/tailwind.config.js");
const userConfig = require(configPath);

describe("Config", () => {
  const baseConfig = new Processor();

  it("file input", () => {
    const processor = new Processor(configPath);
    expect(processor.config("theme.screens")).toEqual(
      processor.theme("screens")
    );
    expect(processor.theme("screens")).toEqual(userConfig.theme.screens);
    expect(processor.theme("colors")).toEqual(userConfig.theme.colors);
    expect(processor.theme("colors.pink")).toEqual(
      userConfig.theme.colors.pink
    );
    expect(processor.theme("fontFamily")).toEqual(userConfig.theme.fontFamily);
    expect(processor.theme("spacing")).toEqual({
      ...(toType(baseConfig.theme("spacing"), "object") ?? {}),
      ...userConfig.theme.extend.spacing,
    });
    expect(processor.theme("borderRadius")).toEqual({
      ...(toType(baseConfig.theme("borderRadius"), "object") ?? {}),
      ...userConfig.theme.extend.borderRadius,
    });
  });

  it("dict input", () => {
    const processor = new Processor(userConfig);
    expect(processor.config("theme.screens")).toEqual(
      processor.theme("screens")
    );
    expect(processor.theme("screens")).toEqual(userConfig.theme.screens);
    expect(processor.theme("colors")).toEqual(userConfig.theme.colors);
    expect(processor.theme("colors.pink")).toEqual(
      userConfig.theme.colors.pink
    );
    expect(processor.theme("fontFamily")).toEqual(userConfig.theme.fontFamily);
    expect(processor.theme("spacing")).toEqual({
      ...(toType(baseConfig.theme("spacing"), "object") ?? {}),
      ...userConfig.theme.extend.spacing,
    });
    expect(processor.theme("borderRadius")).toEqual({
      ...(toType(baseConfig.theme("borderRadius"), "object") ?? {}),
      ...userConfig.theme.extend.borderRadius,
    });
  });
});
