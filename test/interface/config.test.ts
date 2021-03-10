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
      prose
      bg-red-500
      line-clamp-none
      filter-grayscale
      backdrop-blur
      animate-ping
      blur-20
      aspect-w-4
      container
      aspect-h-6
      sm:container
      md:bg-gray-300
      aspect-9/16
      prose-red
      md:prose-lg
      md:aspect-3/4
      lg:backdrop-filter
    `;
    const result = processor.interpret(classes);
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

});
