import { Processor } from '../../src/lib';
import { Style, StyleSheet } from '../../src/utils/style';
import classNames from '../assets/testClasses';
import { writeFileSync } from 'fs';

const processor = new Processor();

function build(classNames: string[], addComment = false) {
  const success: string[] = [];
  const ignored: string[] = [];
  const styleSheet = new StyleSheet();
  classNames.forEach((className) => {
    const result = processor.extract(className, addComment);
    if (result) {
      success.push(className);
      styleSheet.add(result);
    } else {
      ignored.push(className);
    }
  });

  return {
    success,
    ignored,
    styleSheet,
  };
}

describe('Utilities', () => {
  it('build', () => {
    const utilities = build(classNames, true);
    expect(utilities.ignored).toEqual([]);
    writeFileSync('tailwind.css', [processor.preflight().build(), utilities.styleSheet.build()].join('\n'));
  });

  it('extract', () => {
    const a = processor.extract('font-bold');
    expect(!(a instanceof Style) || a.build()).toBe(
      '.font-bold {\n  font-weight: 700;\n}'
    );
    expect(!(a instanceof Style) || a.build(true)).toBe(
      '.font-bold{font-weight:700}'
    );
    expect(processor.extract('*?')).toBeUndefined();

    const b = processor.extract('font-bold', true);
    expect(b instanceof Style).toBeTrue();

    const c = processor.extract('container');
    expect(Array.isArray(c)).toBeTrue();

    const d = processor.extract('container', true);
    expect(Array.isArray(d)).toBeTrue();

    const e = processor.extract('sticky');
    expect(Array.isArray(e)).toBeFalse();

    const f = processor.extract('static');
    expect(f instanceof Style);

    const g = processor.extract('bg-wrong-color');
    expect(g).toBeUndefined();
  });

  it('ring opacity', () => {
    const result = processor.interpret('ring-transparent focus:ring-purple-800');
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });

  it('animation test', () => {
    expect(processor.interpret('animate-ping').styleSheet.build()).toMatchSnapshot('animate-ping');
    expect(processor.interpret('sm:animate-ping').styleSheet.build()).toMatchSnapshot('sm:animate-ping');
  });

  it('grid template test', () => {
    const processor = new Processor({
      theme: {
        extend: {
          gridTemplateColumns: {
            list: 'repeat(auto-fit, minmax(16em, 1fr))',
          },
        },
      },
    });
    expect(processor.interpret('grid-cols-list').styleSheet.build()).toMatchSnapshot('grid-cols-list');
  });

  it('fontsize config test', () => {
    const processor = new Processor({
      theme: {
        fontSize: {
          main: '1.25rem',
          array: ['1.25rem', '2rem'],
          object: ['1.25rem', { 'lineHeight': '2rem' }],
        },
      },
    });
    expect(processor.interpret('text-main text-array text-object').styleSheet.build()).toMatchSnapshot('fontSize');
  });
});
