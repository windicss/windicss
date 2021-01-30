import { SelectorParser } from "../../src/utils/parser";

const parser = new SelectorParser();

describe("SelectorParser", () => {
  it("parse", () => {
    expect(parser.parse(".btn-blue .w-1\\/4 > h1.text-xl + a .bar")).toEqual([
      [
        {
          type: "attribute",
          name: "class",
          action: "element",
          value: "btn-blue",
          ignoreCase: false,
          namespace: null,
        },
        { type: "descendant" },
        {
          type: "attribute",
          name: "class",
          action: "element",
          value: "w-1/4",
          ignoreCase: false,
          namespace: null,
        },
        { type: "child" },
        { type: "tag", name: "h1", namespace: null },
        {
          type: "attribute",
          name: "class",
          action: "element",
          value: "text-xl",
          ignoreCase: false,
          namespace: null,
        },
        { type: "adjacent" },
        { type: "tag", name: "a", namespace: null },
        { type: "descendant" },
        {
          type: "attribute",
          name: "class",
          action: "element",
          value: "bar",
          ignoreCase: false,
          namespace: null,
        },
      ],
    ]);
  });

  it("stringify", () => {
    expect(
      parser.stringify(parser.parse(".btn-blue .w-1/4 > h1.text-xl + a .bar"))
    ).toBe(".btn-blue .w-1/4 > h1.text-xl + a .bar");
  });

  it("isTraversal", () => {
    expect(
      parser
        .parse(".btn-blue .w-1\\/4 > h1.text-xl + a .bar")[0]
        .map((i) => parser.isTraversal(i))
    ).toEqual([
      false,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
    ]);
  });
});
