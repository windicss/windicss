import { TOKENS, Token, Lexer, Parser, Interpreter } from '../../src/lang/parse';

describe('Windi Lang', () => {
  it('lexer', () => {
    const lexer = new Lexer('14 + 2 * 3 - 6 / 2');
    expect(lexer.get_next_token()).toEqual(new Token(TOKENS.INTEGER, 14));
    expect(lexer.get_next_token()).toEqual(new Token(TOKENS.PLUS, '+'));
    expect(lexer.get_next_token()).toEqual(new Token(TOKENS.INTEGER, 2));
    expect(lexer.get_next_token()).toEqual(new Token(TOKENS.MUL, '*'));
  });

  it('eval', () => {
    const lexer = new Lexer('7 + 3 * (10 / (12 / (3 + 1) - 1))');
    const parser = new Parser(lexer);
    expect(parser.parse()).toMatchSnapshot('ast');
    const interpreter = new Interpreter(parser);
    expect(interpreter.interpret()).toEqual(22);
  });
});
