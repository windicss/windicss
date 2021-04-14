import { Lexer, Parser } from '../../src/lang';

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
    expect(parser.parse()).toMatchSnapshot('ast');
  });
});
