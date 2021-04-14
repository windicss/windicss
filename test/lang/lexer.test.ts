import { Token, TokenType } from '../../src/lang/tokens';
import Lexer from '../../src/lang/lexer';

describe('Windi Lang', () => {
  it('lexer with number', () => {
    const lexer = new Lexer('14 + 2.3px * 3 - 6 / 2');
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.NUMBER, 14));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PLUS, '+'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PIXEL, 2.3));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.MUL, '*'));
  });

  it('lexer with numberic', () => {
    const lexer = new Lexer('14px + 2rem * 3 - 0.6 / 2s * 30deg / 24em * 100%');
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PIXEL, 14));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PLUS, '+'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.REM, 2));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.MUL, '*'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.NUMBER, 3));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.MINUS, '-'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.NUMBER, 0.6));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.DIV, '/'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.SECOND, 2));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.MUL, '*'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.DEGREE, 30));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.DIV, '/'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.EM, 24));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.MUL, '*'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PERCENTAGE, 100));
  });

  it('lexer with string', () => {
    const lexer = new Lexer('"hello" + "world"');
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.STRING, 'hello'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PLUS, '+'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.STRING, 'world'));
    const lexer2 = new Lexer('\'hel\\\'lo\'');
    expect(lexer2.get_next_token()).toEqual(new Token(TokenType.STRING, 'hel\\\'lo'));
  });

  it('lexer with unquote string', () => {
    const lexer = new Lexer('\\.widget 123 test');
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.USTRING, '\\.widget'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.NUMBER, 123));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.USTRING, 'test'));
  });

  it('lexer with color', () => {
    const lexer = new Lexer('#1c1c1e');
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.COLOR, '#1c1c1e'));
  });

  it('lexer with variable', () => {
    const lexer = new Lexer('$test-variable + \'hello\'');
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.VAR, 'test-variable'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PLUS, '+'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.STRING, 'hello'));
  });

  it('lexer with keyword', () => {
    const lexer = new Lexer('BEGIN $width: 2px; END');
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.BEGIN, 'BEGIN'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.VAR, 'width'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ASSIGN, ':'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PIXEL, 2));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.SEMI, ';'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.END, 'END'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.EOF, undefined));
  });
});
