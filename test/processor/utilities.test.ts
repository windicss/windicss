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
    const utilities = build(classNames, false);
    expect(utilities.ignored).toEqual([]);
    writeFileSync('tailwind.css', processor.preflight().extend(utilities.styleSheet).sort(true).children.map(i => i.build()).join('\n'));
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

  it('animation test', () => {
    const processor = new Processor({ theme: {
      extend: {
        animation: {
          'spin-slow': 'spin 3s linear infinite',
        },
      },
    },
    });
    expect(processor.interpret('animate-spin-slow').styleSheet.build()).toMatchSnapshot('spin-slow');
  });

  it('grid template test', () => {
    const processor = new Processor({
      theme: {
        extend: {
          gridTemplateColumns: {
            list: 'repeat(auto-fit, minmax(16em, 1fr))',
            'layout': '200px minmax(900px, 1fr) 100px',
          },
          gridTemplateRows: {
            list: 'repeat(auto-fit, minmax(16em, 1fr))',
          },
        },
      },
    });
    expect(processor.interpret('grid-cols-list grid-rows-list grid-cols-4 grid-rows-4 grid-cols-layout').styleSheet.build()).toMatchSnapshot('grid template');
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

  it('backgroundImage config test', () => {
    const processor = new Processor({
      theme: {
        extend: {
          backgroundImage: (theme) => {
            return {
              ...theme('backgroudImage') as {[key:string]:string},
              'home-pattern': 'url(\'./src/assets/home.svg\')',
            };
          },
        },
      },
    });
    expect(processor.interpret('bg-home-pattern').styleSheet.build()).toMatchSnapshot('Background Image');
  });

  it('wrap container', () => {
    const processor = new Processor();
    expect(processor.interpret('sm:container').styleSheet.build()).toMatchSnapshot('small container');
  });

  // #251
  it('container padding', () => {
    const processor = new Processor({
      theme: {
        container: {
          padding: '2px',
        },
      },
    });
    expect(processor.interpret('container').styleSheet.build()).toMatchSnapshot('container padding');
  });

  it('container max-width test', () => {
    const processor = new Processor();
    expect(processor.interpret('container max-w-md').styleSheet.build()).toEqual(processor.interpret('max-w-md container').styleSheet.build());
    expect(processor.interpret('container max-w-md').styleSheet.build()).toMatchSnapshot('container');
    expect(processor.interpret('container max-w-md sm:container sm:max-w-md').styleSheet.build()).toMatchSnapshot('reponsive container');
  });

  it('border radius fraction', () => {
    const processor = new Processor();
    expect(processor.interpret('rounded-1/2 rounded-1 rounded-1/4').styleSheet.build()).toMatchSnapshot('css');
  });

  it('border width shouldn\'t infer', () => {
    const processor = new Processor();
    expect(processor.interpret('border-gray-200 border-gray-150 border-4 border-t-4').styleSheet.build()).toMatchSnapshot('css');
  });

  it('shadow color', () => {
    const processor = new Processor();
    expect(processor.interpret('shadow-2xl shadow-red-800').styleSheet.build()).toMatchSnapshot('css');
  });

  it('caret color', () => {
    const processor = new Processor();
    expect(processor.interpret('caret-opacity-80 caret-auto caret-gray-800 caret-transparent').styleSheet.build()).toMatchSnapshot('css');
  });
});
