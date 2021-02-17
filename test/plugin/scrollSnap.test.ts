import { Processor } from "../../src/lib";
import scrollSnap from "../../src/plugin/scroll-snap";

describe("Scroll Snap plugin", () => {
  it("interpret test", () => {
    const processor = new Processor();
    processor.loadPlugin(scrollSnap);
    const classes = `
      scrollbar-hide
      snap
      snap-start
      snap-end
      snap-center
      snap-none
      snap-mandatory
      snap-proximity
      snap-x
      snap-y
      snap-block
      snap-inline
      snap-both
      snap-normal
      snap-always
      snap snap-y snap-proximity
    `;
    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);
  });

  it("dynamic utility test", () => {
    const processor = new Processor();
    processor.loadPlugin(scrollSnap);

    const classes = `
    snap-m-10
    snap-pt-1
    snap-mb-5px
  `;

    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);

    expect(result.styleSheet.build()).toEqual(`.snap-m-10 {
  scroll-margin: 2.5rem;
}
.snap-pt-1 {
  scroll-padding-top: 0.25rem;
}
.snap-mb-5px {
  scroll-margin-bottom: 5px;
}`);
  });
});
