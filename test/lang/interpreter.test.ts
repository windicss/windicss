import { Lexer, Parser, Interpreter } from '../../src/lang';

describe('Parser', () => {
  it('simple syntax', () => {
    const code = `
    BEGIN
        BEGIN
            $number: 2;
            $a: $number;
            $b: 10 * $a + 10 * $number / 4;
            $c: $a - - $b
        END;
        $x: 11
    END`;
    const lexer = new Lexer(code);
    const parser = new Parser(lexer);
    const interpreter = new Interpreter(parser);
    interpreter.interpret();
    expect(interpreter.GLOBAL_SCOPE).toEqual({ number: 2, a: 2, b: 25, c: 27, x: 11 });
  });
});
