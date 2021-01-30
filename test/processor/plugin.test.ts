import { Processor } from "../../src/lib";

const processor = new Processor();

describe("Plugin Method", () => {
  it("addUtilities", () => {
    const newUtilities = {
      '.skew-10deg': {
        transform: 'skewY(-10deg)',
      },
      '.skew-15deg': {
        transform: 'skewY(-15deg)',
      },
    }
    expect(processor.addUtilities(newUtilities).map(i=>i.build()).join('\n')).toBe('.skew-10deg {\n  transform: skewY(-10deg);\n}\n.skew-15deg {\n  transform: skewY(-15deg);\n}');
  })

  it("addComponents", () => {
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
          backgroundColor: '#2779bd'
        },
      },
      '.btn-red': {
        backgroundColor: '#e3342f',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#cc1f1a'
        },
      },
    }

    expect(processor.addComponents(buttons).map(i=>i.build()).join('\n')).toBe(".btn {\n  padding: .5rem 1rem;\n  border-radius: .25rem;\n  font-weight: 600;\n}\n.btn-blue {\n  background-color: #3490dc;\n  color: #fff;\n}\n.btn-blue:hover {\n  background-color: #2779bd;\n}\n.btn-red {\n  background-color: #e3342f;\n  color: #fff;\n}\n.btn-red:hover {\n  background-color: #cc1f1a;\n}");
  })
})
