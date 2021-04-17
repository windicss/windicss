import { Lexer, Parser, Transformer } from '../../src/lang';

describe('Transformer', () => {
  it('simple syntax', () => {
    const code = `
      @import 'typo.css', 'style.css';

      @var number = 2;
      @var a = number;
      @var b = 10 * a + 10 * number / 4;
      @var c = a - - b;
      @var d = 'green';

      c = c + 2;

      a + 4;

      @log d;

      @log b;

      @warn a + 12;

      @js {
        import { eval, rgba, get, set } from 'windi/lang';

        const a = get('width');
        set('width', eval('4px'));
        const width = eval('3px');
        export function add(a, b) {
          return a + b;
        }
      }

      .test {
        @var testNest = 123;
        color: red;
        .abc .def {
          color: \${d};
        }
      }

      .def {
        @var testNest = "green";
        color: red;
        &:hover > nest {
          background: \${testNest};
        }
      }
    `;
    const lexer = new Lexer(code);
    const parser = new Parser(lexer);
    const transformer = new Transformer(parser);
    expect(transformer.transform()).toMatchSnapshot('js');
  });
});
