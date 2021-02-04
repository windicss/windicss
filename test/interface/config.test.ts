import { resolve } from "path";
import { Processor } from "../../src/lib";

const configPath = resolve("./test/assets/tailwind.plugin.config.js");

describe("Load Plugin", () => {
  const processor = new Processor(configPath);
  it("should load all plugins correctly", () => {
    const classes = `
      skew-10deg
      skew-15deg
      btn
      btn-blue
      btn-red
      line-clamp-1
      line-clamp-none
      filter-grayscale
      backdrop-blur
      blur-20
      aspect-w-4
      aspect-h-6
      prose
      prose-large
    `;
    const result = processor.interpret(classes);
    expect(result.styleSheet.build()).toEqual(
`.skew-10deg {
  transform: skewY(-10deg);
}
.skew-15deg {
  transform: skewY(-15deg);
}
.btn {
  padding: .5rem 1rem;
  border-radius: .25rem;
  font-weight: 600;
}
.btn-blue {
  background-color: #3490dc;
  color: #fff;
}
.btn-blue:hover {
  background-color: #2779bd;
}
.btn-red {
  background-color: #e3342f;
  color: #fff;
}
.btn-red:hover {
  background-color: #cc1f1a;
}
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.line-clamp-none {
  -webkit-line-clamp: unset;
}
.filter-grayscale {
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
}
.backdrop-blur {
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
}
.blur-20 {
  -webkit-backdrop-filter: 20px;
  backdrop-filter: 20px;
}`);
  });

});
