import { TOKENS, Token, Lexer, Interpreter } from '../../src/lang/parse';

describe('Windi Lang', () => {
  it('lexer', () => {
    const lexer = new Lexer('14 + 2 * 3 - 6 / 2');
    expect(lexer.get_next_token()).toEqual(new Token(TOKENS.INTEGER, 14));
    expect(lexer.get_next_token()).toEqual(new Token(TOKENS.PLUS, '+'));
    expect(lexer.get_next_token()).toEqual(new Token(TOKENS.INTEGER, 2));
    expect(lexer.get_next_token()).toEqual(new Token(TOKENS.MUL, '*'));
  });

  it('eval', () => {
    let lexer = new Lexer('7 + 3 * (10 / (12 / (3 + 1) - 1))');
    let interpreter = new Interpreter(lexer);
    expect(interpreter.expr()).toEqual(22);

    lexer = new Lexer('7 + 3 * (10 / (12 / (3 + 1) - 1)) / (2 + 3) - 5 - 3 + (8)');
    interpreter = new Interpreter(lexer);
    expect(interpreter.expr()).toEqual(10);
  });
});
