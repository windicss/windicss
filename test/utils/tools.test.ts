import {
  hash,
  type,
  indent,
  escape,
  wrapit,
  isNumber,
  isFraction,
  isSize,
  isSpace,
  roundUp,
  fracToPercent,
  hex2RGB,
  camelToDash,
  dashToCamel,
  getNestedValue,
  negateValue,
  searchFrom,
} from "../../src/utils";

describe("Tools", () => {
  it("hash", () => {
    const a = hash("123456");
    const b = hash("123457");
    expect(a === b).toBeFalse;
    expect(a).toEqual("232ebm");
    expect(b).toEqual("2ht3ft");
  });

  it("type", () => {
    expect(type(null)).toEqual("Null");
    expect(type(undefined)).toEqual("Undefined");
    expect(type("hello")).toEqual("String");
    expect(type(123)).toEqual("Number");
    expect(type({})).toEqual("Object");
    expect(type([])).toEqual("Array");
    expect(type(() => 132)).toEqual("Function");
    expect(type(/\s/g)).toEqual("RegExp");
  });

  it("indent", () => {
    const str = "hello\nworld";
    expect(indent(str)).toEqual("  hello\n  world");
    expect(indent(str, 4)).toEqual("    hello\n    world");
  });

  it("escape", () => {
    expect(escape(".test")).toEqual(".test");
    expect(escape("sm:bg-red-500")).toEqual(String.raw`sm\:bg-red-500`);
    expect(escape("p-1.5")).toEqual(String.raw`p-1\.5`);
    expect(escape("@dark:p-1.5")).toEqual(String.raw`\@dark\:p-1\.5`);
    expect(escape("+sm:p-1.5")).toEqual(String.raw`\+sm\:p-1\.5`);
    expect(escape("-sm:p-1.5")).toEqual(String.raw`-sm\:p-1\.5`);
    expect(escape("p-1/3")).toEqual(String.raw`p-1\/3`);
    expect(escape("p-$v")).toEqual(String.raw`p-\$v`);
  });

  it("wrapit", () => {
    const str = "hello\nworld";
    expect(wrapit(str)).toEqual("{\n  hello\n  world\n}");
    expect(wrapit(str, "[", "]", 4)).toEqual("[\n    hello\n    world\n]");
    expect(wrapit(str, undefined, undefined, undefined, true)).toEqual(
      "{hello\nworld}"
    );
  });

  it("isNumber", () => {
    expect(isNumber("3")).toBeTrue();
    expect(isNumber("3px")).toBeFalse();
    expect(isNumber("-4")).toBeTrue();
    expect(isNumber("3.2", 0, 99, "float")).toBeTrue();
    expect(isNumber("99.2", 0, 99, "float")).toBeFalse();
    expect(isNumber("-3.2", -99, 99, "float")).toBeTrue();
  });

  it("isFraction", () => {
    expect(isFraction("-32/4")).toBeFalse();
    expect(isFraction("3/2")).toBeTrue();
    expect(isFraction("3/2/4")).toBeFalse();
    expect(isFraction("4")).toBeFalse();
  });

  it("isSize", () => {
    expect(isSize("3px")).toBeTrue();
    expect(isSize("4rem")).toBeTrue();
    expect(isSize("4pp")).toBeFalse();
    expect(isSize("1em")).toBeTrue();
    expect(isSize("50vh")).toBeTrue();
    expect(isSize("30vw")).toBeTrue();
    expect(isSize("30ch")).toBeTrue();
    expect(isSize("30ex")).toBeTrue();
  });

  it("isSpace", () => {
    expect(isSpace(" ")).toBeTrue();
    expect(isSpace("")).toBeTrue();
    expect(isSpace("\n  \t")).toBeTrue();
    expect(isSpace(" 23 ")).toBeFalse();
  });

  it("roundUp", () => {
    expect(roundUp(-3.9)).toBe(-4);
    expect(roundUp(-3.4)).toBe(-3);
    expect(roundUp(4.4)).toBe(4);
    expect(roundUp(4.5)).toBe(5);
    expect(roundUp(1 / 3, 6)).toBe(0.333333);
    expect(roundUp(2 / 3, 6)).toBe(0.666667);
  });

  it("fracToPercent", () => {
    expect(fracToPercent("2/3")).toBe("66.666667%");
    expect(fracToPercent("2/5")).toBe("40%");
    expect(fracToPercent("0/2")).toBe("0%");
    expect(fracToPercent("1/10")).toBe("10%");
    expect(fracToPercent("5/2")).toBe("250%");
  });

  it("hex2RGB", () => {
    expect(hex2RGB("#fff")).toEqual([255, 255, 255]);
    expect(hex2RGB("#ffffff")).toEqual([255, 255, 255]);
    expect(hex2RGB("#1c1c1e")).toEqual([28, 28, 30]);
  });

  it("camelToDash", () => {
    expect(camelToDash("backgroundOpacity")).toBe("background-opacity");
    expect(camelToDash("camelToDash")).toBe("camel-to-dash");
  });

  it("dashToCamel", () => {
    expect(dashToCamel("bg-transparent")).toBe("bgTransparent");
    expect(dashToCamel("dash-to-camel")).toBe("dashToCamel");
  });

  it("getNestedValue", () => {
    expect(getNestedValue({ test: "hello" }, "hello")).toBeUndefined();
    expect(getNestedValue({ test: "hello" }, "test")).toBe("hello");
    expect(getNestedValue({ test: { wrap: "hello" } }, "test.wrap")).toBe(
      "hello"
    );
    expect(
      getNestedValue({ test: { wrap: "hello" } }, "test.c")
    ).toBeUndefined();
  });

  it("negateValue", () => {
    expect(negateValue("12px")).toBe("-12px");
    expect(negateValue("4rem")).toBe("-4rem");
    expect(negateValue("0rem")).toBe("0rem");
    expect(negateValue("-4rem")).toBe("-4rem");
  });

  it("searchFrom", () => {
    const str = "hello world this is a test";
    expect(searchFrom(str, /\s/)).toBe(5);
    expect(searchFrom(str, /\s/, 8)).toBe(11);
    expect(searchFrom(str, /\s/, 8, 10)).toBe(-1);
  });
});
