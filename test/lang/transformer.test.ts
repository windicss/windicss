import { Lexer, Parser, Transformer } from '../../src/lang';

describe('Transformer', () => {
  it('simple syntax', () => {
    const code = `
      @import 'typo.css', 'style.css';

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

      @try {
        @var x = 1;
      } @except TypeError {
        @log 'TypeError: Failed to set x';
      } @except RangeError {
        @log 'RangeError: Failed to set x';
      } @except Exception as error {
        @log \`Other exceptions \${error.message}\`;
      } @else {
        @log 'No exception occured';
      } @finally {
        @log 'We always do this';
      };

      @try {
        fail();
      } @except {
        @log 'Exception occured';
      };

      @try {
        result = 10 / x;
      } @except TypeError as error1 {
        @log \`Type Error \${error1.message}\`;
      };

      @try {
        result = 10 / x;
      } @except Exception as error {
        @log 'Exceptions';
      };

      @var add3 = a => a + 3;

      @var add = (a, b) => a + b;

      @var c = ((a, b) => a + b)(1,2) * 4;

      @var d = ((a, b) => {
        @return a + b;
      })(1, 2) / 3;

      @var number = 2;
      @var a = number;
      @var b = 10 * a + 10 * number / 4;
      @var c = a - - b;
      @var d = 'green';
      @var e = [ 10, 'green' , a - b ];
      @var f = ( 10, 'green' , a - b );
      @var g = {
        1: 2,
        'a': 1,
        'b': 2,
        'c': a - b,
      };

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

      @var i = 3;
      @while i > 0 {
        @log i;
        i = i - 1;
      } @else {
        @log i;
      };

      @with add(1,2) as c {
        c = c + 3;
        @log c;
      };

      @break;
      @continue;
      @yield 123;
      @raise Error('msg');

      @assert not 1 == 2 and 5 > 3;

      @assert !1 == 2 and 5 > 3;

      @var e = a.c(1, 2)('5').hello()(123)['test'].def;

      @assert 4 in [1, 2, 4];

      @var h = func2(func(1, 2) + (4 / 3));

      @var h = True;
      @var i = False * 3;
      @var j = None;

      c = - 4 ** 4;

      a + 4;

      @log d;

      @log b;

      @warn a + 12;

      @apply bg-red-500 text-white sm:bg-gray-200;
      @attr[bg] red-500 opacity-50 sm:red-200;
      @attr[sm:text] red-500 opacity-30;

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
          @apply font-bold text-lg;
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
