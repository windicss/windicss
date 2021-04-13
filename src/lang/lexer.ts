import { isSpace, isDigit } from './utils';
import { Token, TokenType } from './tokens';


export default class Lexer {
  text: string;
  pos: number;
  current_char?: string;

  constructor(text: string) {
    this.text = text;
    this.pos = 0;
    this.current_char = this.text[this.pos];
  }

  error(): never {
    throw Error('Invalid charater');
  }

  advance(): void {
    this.pos ++;
    this.current_char = this.pos > this.text.length - 1 ? undefined : this.text[this.pos];
  }

  jump(step = 1): void {
    this.pos += step;
    this.current_char = this.pos > this.text.length - 1 ? undefined : this.text[this.pos];
  }

  peek(): string | undefined {
    if (this.pos + 1 < this.text.length) {
      return this.text[this.pos + 1];
    }
  }

  skip_whitespace(): void {
    while (this.current_char !== undefined && isSpace(this.current_char)) {
      this.advance();
    }
  }

  string(char: '\'' | '"'): Token {
    let result = '';
    let prev = '';
    while(this.current_char !== undefined && (this.current_char !== char || prev === '\\')) {
      result += this.current_char;
      prev = this.current_char;
      this.advance();
    }
    if (result) this.advance(); // right quote
    return new Token(TokenType.STRING, result);
  }

  ustring(): Token {
    let result = '';
    while (this.current_char !== undefined && !isSpace(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    return new Token(TokenType.USTRING, result);
  }

  numeric(): Token {
    let result = '';
    while (this.current_char !== undefined && isDigit(this.current_char)) {
      // int
      result += this.current_char;
      this.advance();
    }
    if (this.current_char === '.') {
      // float
      result += '.';
      this.advance();
      while (this.current_char !== undefined && isDigit(this.current_char)) {
        result += this.current_char;
        this.advance();
      }
    }
    // size
    const next = this.text.slice(this.pos,);
    if (next.startsWith('rem')) {
      this.jump(3);
      return new Token(TokenType.REM, +result);
    }
    if (next.startsWith('px')) {
      this.jump(2);
      return new Token(TokenType.PIXEL, +result);
    }
    if (next.startsWith('em')) {
      this.jump(2);
      return new Token(TokenType.EM, +result);
    }
    if (next.startsWith('%')) {
      this.advance();
      return new Token(TokenType.PERCENTAGE, +result);
    }
    if (next.startsWith('s')) {
      this.advance();
      return new Token(TokenType.SECOND, +result);
    }
    if (next.startsWith('deg')) {
      this.jump(3);
      return new Token(TokenType.DEGREE, +result);
    }
    return new Token(TokenType.NUMBER, +result);
  }

  color(): Token {
    let result = '';
    while (this.current_char !== undefined && !isSpace(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    return new Token(TokenType.COLOR, result);
  }

  variable(): Token {
    let result = '';
    while (this.current_char !== undefined && /[\w-]/.test(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    return new Token(TokenType.VAR, result);
  }

  get_next_token(): Token {
    while (this.current_char !== undefined) {
      if (isSpace(this.current_char)) {
        this.skip_whitespace();
        continue;
      }

      if (isDigit(this.current_char)) {
        return this.numeric();
      }

      switch (this.current_char) {
      case '\'':
        this.advance();
        return this.string('\'');
      case '"':
        this.advance();
        return this.string('"');
      case '#':
        return this.color();
      case '$':
        this.advance();
        return this.variable();
      case '+':
        this.advance();
        return new Token(TokenType.PLUS, '+');
      case '-':
        this.advance();
        return new Token(TokenType.MINUS, '-');
      case '*':
        this.advance();
        return new Token(TokenType.MUL, '*');
      case '/':
        this.advance();
        return new Token(TokenType.DIV, '/');
      case '(':
        this.advance();
        return new Token(TokenType.LPAREN, '(');
      case ')':
        this.advance();
        return new Token(TokenType.RPAREN, ')');
      default:
        return this.ustring();
      }
    }
    return new Token(TokenType.EOF, undefined);
  }
}
