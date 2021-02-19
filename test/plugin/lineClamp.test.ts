import { Processor } from '../../src/lib';
import lineClamp from '../../src/plugin/line-clamp';

describe('line clamp plugin', () => {
  it('interpret test', () => {
    const processor = new Processor();
    processor.loadPlugin(lineClamp);
    const classes = `
      line-clamp-1
      line-clamp-4
      line-clamp-none
      hover:line-clamp-none
      sm:line-clamp-none
    `;
    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toEqual(
      `.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.line-clamp-4 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.line-clamp-none {
  -webkit-line-clamp: unset;
}
.hover\\:line-clamp-none:hover {
  -webkit-line-clamp: unset;
}
@media (min-width: 640px) {
  .sm\\:line-clamp-none {
    -webkit-line-clamp: unset;
  }
}`);
  });
  it('customize test', () => {
    const processor = new Processor({
      theme: { extend: { lineClamp: { sm: '4', md: '6' } } },
    });
    processor.loadPlugin(lineClamp);
    const classes = `
      line-clamp-1
      line-clamp-4
      line-clamp-sm
      line-clamp-md
    `;
    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);
    expect(result.styleSheet.build()).toEqual(
      `.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.line-clamp-4 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.line-clamp-sm {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.line-clamp-md {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
}`);
  });
});
