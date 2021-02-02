import { Processor } from "../../src/lib";
import filters from "../../src/plugin/filters";

describe("filter plugin", () => {
  it("interpret test", () => {
    const processor = new Processor();
    processor.loadPlugin(filters);
    const classes = `
      filter-none
      filter-grayscale
      hover:filter-none
      hover:filter-grayscale
      backdrop-none
      backdrop-blur
      sm:filter-none
      sm:filter-grayscale
    `;
    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toEqual(
`.filter-none {
  -webkit-filter: none;
  filter: none;
}
.filter-grayscale {
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
}
.hover\\:filter-none:hover {
  -webkit-filter: none;
  filter: none;
}
.hover\\:filter-grayscale:hover {
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
}
.backdrop-none {
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}
.backdrop-blur {
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
}
@media (min-width: 640px) {
  .sm\\:filter-none {
    -webkit-filter: none;
    filter: none;
  }
  .sm\\:filter-grayscale {
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
  }
}`);
  })

  it("customize test", () => {
    const processor = new Processor({ theme: {
      filter: {
        'none': 'none',
        'grayscale': 'grayscale(1)',
        'invert': 'invert(2)',
        'sepia': 'sepia(1)',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(40px)',
      },
      blur: {
        'none': 'none',
      }
    }});
    processor.loadPlugin(filters);
    const classes = `filter-invert backdrop-blur blur-none`;
    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toEqual(
`.filter-invert {
  -webkit-filter: invert(2);
  filter: invert(2);
}
.backdrop-blur {
  -webkit-backdrop-filter: blur(40px);
  backdrop-filter: blur(40px);
}
.blur-none {
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}`);
  })

  it("dynamic utility test", () => {
    const processor = new Processor();
    processor.loadPlugin(filters);
    const classes = `blur-none blur-12 blur-3rem blur-6px`;
    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toEqual(
`.blur-none {
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}
.blur-12 {
  -webkit-backdrop-filter: 12px;
  backdrop-filter: 12px;
}
.blur-3rem {
  -webkit-backdrop-filter: 3rem;
  backdrop-filter: 3rem;
}
.blur-6px {
  -webkit-backdrop-filter: 6px;
  backdrop-filter: 6px;
}`);
  })
})
