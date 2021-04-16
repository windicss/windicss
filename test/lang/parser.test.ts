import { Lexer, Parser } from '../../src/lang';

describe('Parser', () => {
  it('simple syntax', () => {
    const code = `
      @var number = 2;
      @var a = number;
      @var b = 10 * a + 10 * number / 4;
      @var c = a - - b;
      @var d = 'green';
      .test {
        @var testNest = 123;
        color: red;
        .abc .def {
          color: \${d};
        }
      }

      .def {
        @var testNest = 123;
        color: red;
        &:hover > nest {
          background: green;
        }
      }
    `;
    const lexer = new Lexer(code);
    const parser = new Parser(lexer);
    expect(parser.parse()).toMatchSnapshot('ast');
  });
});
