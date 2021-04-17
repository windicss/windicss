import { Lexer, Parser } from '../../src/lang';

describe('Parser', () => {
  it('simple syntax', () => {
    const code = `
      @import 'typo.css', 'style.css', 'test.windi';

      @load 'module1', 'module2', 'module3';
      @load { export1 } from "module-name";
      @load { export1 , export2 } from "module-name";
      @load { export1 , export2 as alias2 , export3 as alias3 } from "module-name";
      @load * from "module";
      @load * as name from "module";
      @load defaultExport from "module";
      @load defaultExport, { export1, export2 } from "module-name";
      @load defaultExport, * as name from 'module-name';

      @var number = 2;
      @var a = number;
      @var b = 10 * a + 10 * number / 4;
      @var c = a - - b;
      @var d = 'green';
      @var e = [ 10, 'green' , a - b ];
      @var f = ( 10, 'green' , a - b );
      @var g = {
        1: 'hello',
        'a': 1,
        'b': 2,
        'c': a - b,
      };

      @log d;

      @log b;

      @warn a + 12;

      @js {123}

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
