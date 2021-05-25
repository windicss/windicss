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
    writeFileSync('windi.css', processor.preflight().extend(utilities.styleSheet).sort().children.map(i => i.build()).join('\n'));
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
    expect(processor.interpret('container max-w-md').styleSheet.build()).toEqual(processor.interpret('max-w-md container').styleSheet.build());
    expect(processor.interpret('container max-w-md').styleSheet.build()).toMatchSnapshot('container');
    expect(processor.interpret('container max-w-md sm:container sm:max-w-md').styleSheet.build()).toMatchSnapshot('reponsive container');
  });

  it('border radius fraction', () => {
    expect(processor.interpret('rounded-1/2 rounded-1 rounded-1/4').styleSheet.build()).toMatchSnapshot('css');
  });

  it('border width shouldn\'t infer', () => {
    expect(processor.interpret('border-gray-200 border-gray-150 border-4 border-t-4').styleSheet.build()).toMatchSnapshot('css');
  });

  it('shadow color', () => {
    expect(processor.interpret('shadow-2xl shadow-red-800').styleSheet.build()).toMatchSnapshot('css');
  });

  it('caret color', () => {
    expect(processor.interpret('caret-opacity-80 caret-auto caret-gray-800 caret-transparent').styleSheet.build()).toMatchSnapshot('css');
  });

  it('text decoration color & opacity & length & offset', () => {
    expect(processor.interpret('underline line-through no-underline underline-solid underline-dashed underline-dotted underline-double underline-opacity-90 underline-gray-200 underline-2 underline-3px underline-1rem underline-auto underline-transparent underline-offset-2 underline-offset-auto underline-offset-3px').styleSheet.build()).toMatchSnapshot('css');
  });

  it('list style type', () => {
    expect(processor.interpret('list-disc list-square list-lower-greek list-zero-decimal').styleSheet.build()).toMatchSnapshot('css');
  });

  it('tab size', () => {
    expect(processor.interpret('tab tab-2 tab-4 tab-12 tab-13px').styleSheet.build()).toMatchSnapshot('css');
  });

  it('text indent', () => {
    expect(processor.interpret('indent indent-sm indent-lg indent-2xl indent-2em -indent-2em indent-1/2').styleSheet.build()).toMatchSnapshot('css');
  });

  it('transform rotateY', () => {
    expect(processor.interpret('transform rotate-y-180 -rotate-y-45 rotate-45').styleSheet.build()).toMatchSnapshot('css');
  });

  it('text shadow', () => {
    expect(processor.interpret('text-shadow text-shadow-none text-shadow-sm text-shadow-lg').styleSheet.build()).toMatchSnapshot('css');
  });

  it('text stroke width & stroke color', () => {
    expect(processor.interpret('text-stroke text-stroke-sm text-stroke-md text-stroke-lg text-stroke-2 text-stroke-3px text-stroke-gray-200').styleSheet.build()).toMatchSnapshot('css');
  });

  it('stroke svg', () => {
    expect(processor.interpret('stroke-2 stroke-gray-200 stroke-offset-2 stroke-cap-round stroke-join-bevel stroke-dash-4').styleSheet.build()).toMatchSnapshot('css');
  });

  it('transform 3d', () => {
    expect(processor.interpret('transform transform-gpu transform-none rotate-45 rotate-x-45 rotate-y-45 rotate-z-45 -rotate-90 -rotate-y-90 -rotate-z-180 translate-x-6 translate-y-6 translate-z-6 -translate-z-6 scale-x-90 scale-y-90 scale-z-120').styleSheet.build()).toMatchSnapshot('css');
  });

  it('prespective and perspective origin', () => {
    expect(processor.interpret('perspect-none perspect-800px perspect-lg perspect-[4rem] perspect-23rem perspect-origin-center perspect-origin-bottom-right perspect-origin-[250%_250%] perspect-origin-[-170%]').styleSheet.build()).toMatchSnapshot('css');
  });

  it('content utilities', () => {
    expect(processor.interpret('content-👍 before:content-["👍"] content-open-quote after:content-[attr(value)] content').styleSheet.build()).toMatchSnapshot('css');
  });

  it('color opacity group utilities', () => {
    expect(processor.interpret(`bg-green-500/50 bg-blue-600/32
    bg-indigo-500/$primary-opacity bg-[var(--background-color)]
    bg-teal-500/[var(--primary-opacity)] bg-green-500/[0.17]
    text-green-500/50
    underline-green-500/50
    placeholder-green-500/50
    caret-green-500/50
    border-green-500/50
    divide-green-500/50
    ring-green-500/50
    outlint-green-500/50
    `).styleSheet.build()).toMatchSnapshot('css');
  });

  it('more color opacity group utilities', () => {
    expect(processor.interpret(`from-green-500/50
    via-green-500/50
    to-green-500/50
    ring-offset-green-500/50
    fill-green-500/50
    stroke-green-500/50
    text-stroke-green-500/50
    outline-solid-green-500/50
    outline-dashed-green-500/50
`).styleSheet.build()).toMatchSnapshot('css');
  });
});
