import { Token, TokenType } from '../../src/lang/tokens';
import { Lexer } from '../../src/lang';

describe('Lexer', () => {
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

  it('lexer with color', () => {
    const lexer = new Lexer('#1c1c1e');
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.COLOR, '#1c1c1e'));
  });

  it('lexer with variable', () => {
    const lexer = new Lexer('${testVariable + 3} test color');
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.DOLLAR, '$'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.LBRACKET, '{'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, 'testVariable'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PLUS, '+'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.NUMBER, 3));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.RBRACKET, '}'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, 'test'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, 'color'));
  });

  it('lexer with keyword', () => {
    const lexer = new Lexer('{ @var width = 2px; }');
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.LBRACKET, '{'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.VAR, '@var'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, 'width'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ASSIGN, '='));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PIXEL, 2));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.SEMI, ';'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.RBRACKET, '}'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.EOF, undefined));
  });

  it('lexer with lang', () => {
    const lexer = new Lexer(`
    @var width = 3px;
    @var baseColor = #c6538c;
    @var abc = 'test';
    @var def = \`\${width + 4px} hello world\`;
    width = width + 4px;

    .test .abc {
      width: \${width + 4px} hello world;
      &:hover {
        color: \${baseColor};
      }
    }`);
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.VAR, '@var'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, 'width'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ASSIGN, '='));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PIXEL, 3));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.SEMI, ';'));

    expect(lexer.get_next_token()).toEqual(new Token(TokenType.VAR, '@var'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, 'baseColor'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ASSIGN, '='));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.COLOR, '#c6538c'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.SEMI, ';'));

    expect(lexer.get_next_token()).toEqual(new Token(TokenType.VAR, '@var'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, 'abc'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ASSIGN, '='));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.STRING, 'test'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.SEMI, ';'));

    expect(lexer.get_next_token()).toEqual(new Token(TokenType.VAR, '@var'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, 'def'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ASSIGN, '='));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.TEMPLATE, '${width + 4px} hello world'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.SEMI, ';'));

    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, 'width'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ASSIGN, '='));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, 'width'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PLUS, '+'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.PIXEL, 4));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.SEMI, ';'));

    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, '.test .abc'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.LBRACKET, '{'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, 'width'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.TEMPLATE, '${width + 4px} hello world'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.SEMI, ';'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, '&:hover'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.LBRACKET, '{'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.ID, 'color'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.TEMPLATE, '${baseColor}'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.SEMI, ';'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.RBRACKET, '}'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.RBRACKET, '}'));
    expect(lexer.get_next_token()).toEqual(new Token(TokenType.EOF, undefined));
  });
});
