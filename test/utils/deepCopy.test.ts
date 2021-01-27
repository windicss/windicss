import { deepCopy } from "../../src/utils/algorithm";

describe("deepCopy", () => {
  it("copy array", () => {
    const a = [
      1,
      2,
      3,
      "4",
      "hello",
      new Date(),
      { helllo: "world" },
      () => 123,
    ];
    expect(deepCopy(a)).toEqual(a);
  });

  it("copy regex", () => {
    const a = /[\s\S]+/g;
    expect(deepCopy(a)).toEqual(a);
  });

  it("copy dict", () => {
    const a = {
      darkMode: "class", // or 'media'
      theme: {
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
      },
      copy: () => "hello",
    };

    expect(deepCopy(a)).toEqual(a);
  });
});
