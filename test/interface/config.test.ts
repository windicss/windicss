import { resolve } from 'path';
import { Processor } from '../../src/lib';

const configPath = resolve('./test/assets/tailwind.plugin.config.js');

describe('Load Plugin', () => {
  const processor = new Processor(require(resolve(configPath)));
  it('should load all plugins correctly', () => {
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
      aspect-9/16
      prose-red
    `;
    const result = processor.interpret(classes);
    expect(result.styleSheet.build()).toEqual(
      String.raw`.skew-10deg {
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
}
.aspect-w-4 {
  --tw-aspect-w: 4;
  position: relative;
  padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%);
}
.aspect-w-4 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.aspect-h-6 {
  --tw-aspect-h: 6;
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
}
.prose-red a {
  color: #dc2626;
}
.prose-red a code {
  color: #dc2626;
}`);
  });

});
