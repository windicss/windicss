import { FontSize } from '../../dist/types/interfaces';
import { Property, Style } from '../../src/utils/style';
import { Processor } from '../../src/lib';

const processor = new Processor();

describe('Plugin Method', () => {
  it('addUtilities', () => {
    const utilities = {
      '.skew-10deg': {
        transform: 'skewY(-10deg)',
      },
      '.skew-15deg': {
        transform: 'skewY(-15deg)',
      },
    };
    expect(processor.addUtilities(utilities).map(i=>i.build()).join('\n')).toBe('.skew-10deg {\n  transform: skewY(-10deg);\n}\n.skew-15deg {\n  transform: skewY(-15deg);\n}');
  });

  it('addUtilities with non-class styles', () => {
    const utilities = {
      '.skew-10deg': {
        transform: 'skewY(-10deg)',
      },
      '.skew-15deg': {
        transform: 'skewY(-15deg)',
      },
      '[data-theme]': { '--active': '#0099FF' },
    };
    processor.addUtilities(utilities);
    expect(processor.interpret('skew-10deg').styleSheet.build()).toEqual('.skew-10deg {\n  transform: skewY(-10deg);\n}');
    expect(processor.preflight('test', false, false, true).build()).toEqual(
      `[data-theme] {
  --active: #0099FF;
}`);
  });

  it('addComponents', () => {
    const buttons = {
      '.btn': {
        padding: '.5rem 1rem',
        borderRadius: '.25rem',
        fontWeight: '600',
      },
      '.btn-blue': {
        backgroundColor: '#3490dc',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#2779bd',
        },
      },
      '.btn-red': {
        backgroundColor: '#e3342f',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#cc1f1a',
        },
      },
    };

    expect(processor.addComponents(buttons).map(i=>i.build()).join('\n')).toBe('.btn {\n  padding: .5rem 1rem;\n  border-radius: .25rem;\n  font-weight: 600;\n}\n.btn-blue {\n  background-color: #3490dc;\n  color: #fff;\n}\n.btn-blue:hover {\n  background-color: #2779bd;\n}\n.btn-red {\n  background-color: #e3342f;\n  color: #fff;\n}\n.btn-red:hover {\n  background-color: #cc1f1a;\n}');
  });

  it('addComponents with non-class styles ', () => {
    const processor = new Processor();
    const components = {
      '[data-theme]': { '--active': '#0099FF' },
      '[data-theme="dark"]': {
        '--primary': '#111111',
        '--on-primary': '#B4B4B4',
        '--on-primary-active': '#F2F2F2',
        '--frame': '#1E1E1E',
        '--on-frame': '#808080',
        '--on-frame-active': 'var(--on-primary)',
      },
      '[data-theme="light"]': {
        '--primary': '#FFFFFF',
        '--on-primary': '#888888',
        '--on-primary-active': '#333333',
        '--frame': '#EFEFEF',
        '--on-frame': '#808080',
        '--on-frame-active': 'var(--on-primary)',
      },
    };
    processor.addComponents(components);
    const css = processor.preflight('test', false, false, true).build();
    expect(css).toMatchSnapshot('css');
  });

  it('addBase', () => {
    expect(processor.addBase({
      'h1': { fontSize: (processor.theme('fontSize.2xl') as FontSize)[0] ?? '1.5rem' },
      'h2': { fontSize: (processor.theme('fontSize.xl') as FontSize)[0] ?? '1.25rem' },
      'h3': { fontSize: (processor.theme('fontSize.lg') as FontSize)[0] ?? '1.125rem' },
    }).map(i=>i.build()).join('\n')).toBe('h1 {\n  font-size: 1.5rem;\n}\nh2 {\n  font-size: 1.25rem;\n}\nh3 {\n  font-size: 1.125rem;\n}');
  });

  it('add static base styles', () => {
    const processor = new Processor();
    processor.addBase({
      'h1': { fontSize: (processor.theme('fontSize.2xl') as FontSize)[0] ?? '1.5rem' },
      'h2': { fontSize: (processor.theme('fontSize.xl') as FontSize)[0] ?? '1.25rem' },
    }, false);

    expect(processor.preflight('<h1>Hello World</h1>', false, false, true).build()).toEqual('h1 {\n  font-size: 1.5rem;\n}\nh2 {\n  font-size: 1.25rem;\n}');
  });

  it('addVariant pseudoClass', () => {
    const test = new Style('.float-right', new Property('float', 'right'));
    const style = processor.addVariant('disable', ({ pseudoClass }) => {
      return pseudoClass('disabled');
    });
    expect(Array.isArray(style) || style.extend(test).build()).toMatchSnapshot('extend');
    expect(processor.interpret('disable:float-right').styleSheet.build()).toMatchSnapshot('float');
  });

  it('addVariant modifySelectors', () => {
    const test = new Style('.float-right', new Property('float', 'right'));
    const style = processor.addVariant('disabled', ({ modifySelectors, separator }) => {
      return modifySelectors(({ className }) => {
        return `.${processor.e(`disabled${separator}${className}`)}:disabled`;
      });
    });
    const css = Array.isArray(style) || style.extend(test).build();
    expect(css).toMatchSnapshot('css');
  });

  it('#72 plugin test', () => {
    const processor = new Processor({
      plugins: [
        {
          handler: ({ addUtilities }) => {
            addUtilities({});
          },
          config: {
            theme: {
              extend: {
                colors: {
                  active: 'var(--active)',
                  primary: 'var(--primary)',
                  'on-primary': 'var(--on-primary)',
                  'on-primary-active': 'var(--on-primary-active)',
                  frame: 'var(--frame)',
                  'on-frame': 'var(--on-frame)',
                  'on-frame-active': 'var(--on-frame-active)',
                },
              },
            },
          },
        },
      ],
    });
    expect(processor.theme('colors.white')).toEqual('#fff');
    expect(processor.theme('colors.active')).toEqual('var(--active)');
    expect(processor.interpret('bg-active bg-on-primary-active').styleSheet.build()).toEqual(`.bg-active {
  background-color: var(--active);
}
.bg-on-primary-active {
  background-color: var(--on-primary-active);
}`);
  });
});
