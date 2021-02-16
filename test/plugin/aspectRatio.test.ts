import { Processor } from "../../src/lib";
import aspectRatio from "../../src/plugin/aspect-ratio";

describe("aspect ratio plugin", () => {
  it("interpret test", () => {
    const processor = new Processor();
    processor.loadPlugin(aspectRatio);
    const classes = `
      aspect-none
      aspect-w-16
      aspect-h-9
      aspect-9/16
      `;
    const utility = processor.interpret(classes);
    expect(utility.ignored.length).toEqual(0);
    expect(utility.styleSheet.build()).toEqual(
String.raw`.aspect-none {
  position: static;
  padding-bottom: 0;
}
.aspect-none > * {
  position: static;
  height: auto;
  width: auto;
  top: auto;
  right: auto;
  bottom: auto;
  left: auto;
}
.aspect-w-16 {
  --tw-aspect-w: 16;
  position: relative;
  padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%);
}
.aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.aspect-h-9 {
  --tw-aspect-h: 9;
}
.aspect-9\/16 {
  position: relative;
  padding-bottom: 56.25%;
}
.aspect-9\/16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}`);
  })
});
