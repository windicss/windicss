import { writeFileSync } from 'fs';
import { Processor } from '../../src/lib';
import typography from '../../src/plugin/typography';

describe('aspect ratio plugin', () => {
  it('interpret test', () => {
    const processor = new Processor({
      theme: {
        extend: {
          typography: {
            DEFAULT: {
              css: {
                color: 'red',
              },
            },
          },
        },
      },
    });
    processor.loadPluginWithOptions(typography);
    const classes = `
      prose
      prose-sm
      prose-lg
      prose-xl
      prose-2xl
      prose-pink
      prose-fuchsia
      prose-purple
      prose-violet
      prose-indigo
      prose-blue
      prose-cyan
      prose-teal
      prose-emerald
      prose-green
      prose-lime
      prose-yellow
      prose-amber
      prose-orange
      prose-red
      `;
    const result = processor.interpret(classes);
    expect(result.ignored.length).toEqual(0);
    writeFileSync('typography.css', result.styleSheet.build());
  });
});
