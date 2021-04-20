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

      @func func(a, b) {
        @var f = 3;
        @func nest(c, d) {
          @return c * d;
        };
        @return a + b / f - nest(a, b);
      };
      @func add(a, b) => a + b;
      @func (a, b) => a + b;
      @func (a, b) {
        @return a + b;
      };
      @func (x) {
        @return x + 2;
      };

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
      @var h = True;
      @var i = False * 3;
      @var j = None;

      @var h = func(1, 2) + (4 / 3);

      @var e = a.c(1, 2)('5').hello()(123)['test'].def;

      @log d;

      @log b;

      @if a > 0 and b > 0 {
        @log "The numbers are greater than 0";
      };

      @if a > 0 and b > 0 and c > 0 {
        @log "The numbers are greater than 0";
      } @else {
        @log "Atleast one number is not greater than 0";
      };

      @if a > 0 {
        @log "a";
      } @elif b > 0 {
        @log "b";
      } @elif c > 0 {
        @log "c";
      } @else {
        @log "unknown";
      };

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
