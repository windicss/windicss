import { Processor } from "../../src/lib";
import { readFileSync } from "fs";

const processor = new Processor();

describe("Preflight", () => {
  it("some tags", () => {
    expect(
      processor
        .preflight([
          "div",
          "img",
          "p",
          "ul",
          "li",
          "span",
          "svg",
          "path",
          "code",
          "a",
        ])
        .build()
    ).toEqual(readFileSync("./test/assets/examplePreflight.css").toString());

    expect(
      processor
        .preflight(
          ["div", "img", "p", "ul", "li", "span", "svg", "path", "code", "a"],
          false
        )
        .build()
    ).toEqual(
      `a {
  color: inherit;
  text-decoration: inherit;
}
code {
  font-size: 1em;
  font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
}
img {
  border-style: solid;
  max-width: 100%;
  height: auto;
}
img, svg {
  display: block;
}
p {
  margin: 0;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}`
    );

    expect(
      processor
        .preflight(
          ["div", "img", "p", "ul", "li", "span", "svg", "path", "code", "a"],
          false,
          true
        )
        .build()
    ).toEqual("");
  });

  it("all tags", () => {
    expect(processor.preflight().build()).toEqual(
      readFileSync("./test/assets/preflight.css").toString()
    );
  });
});
