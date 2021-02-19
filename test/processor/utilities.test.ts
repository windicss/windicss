import { Processor } from '../../src/lib';
import { Style, StyleSheet } from '../../src/utils/style';
import classNames from '../assets/testClasses';

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
    const result = build(classNames, true);
    expect(result.ignored.length).toBe(0);
    // expect(result)
    // writeFileSync('output.css', result.styleSheet.build());
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

    // expect(!(Array.isArray(c)) || e.build()).toBe(".font-bold {\n  font-weight: 700;\n}");
    // expect(!(c instanceof Style) || e.build(true)).toBe(".font-bold{font-weight:700}");
    // expect(processor.extract('*?')).toBeUndefined();
  });

  it('ring opacity', () => {
    const result = processor.interpret('ring-transparent focus:ring-purple-800');
    expect(result.styleSheet.build()).toMatchSnapshot('css');
  });
});
