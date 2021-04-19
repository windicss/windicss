import { isSpace, isDigit, isAlpha, findGroupEnd } from './utils';
import { Token, TokenType, REVERSED_KEYWORDS } from './tokens';


export class Lexer {
  text: string;
  pos: number;
  _isID = false; // solve dict pairs setup and prop value setup, cause number|string: value and id: value
  current_char?: string;

  constructor(text: string) {
    this.text = text;
    this.pos = 0;
    this.current_char = this.text[this.pos];
  }

  error(msg = 'Invalid charater'): never {
    throw Error(msg);
  }

  advance(step = 1): string | undefined {
    this.pos += step;
    this.current_char = this.pos > this.text.length - 1 ? undefined : this.text[this.pos];
    return this.current_char;
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

  string(char: '\'' | '"' | '`'): Token {
    let result = '';
    let prev = '';
    while(this.current_char !== undefined && (this.current_char !== char || prev === '\\')) {
      result += this.current_char;
      prev = this.current_char;
      this.advance();
    }
    if (result) this.advance(); // right quote
    if (char === '`') {
      return new Token(TokenType.TEMPLATE, result);
    }
    this._isID = false;
    return new Token(TokenType.STRING, result);
  }

  keyword(): Token {
    // handle reversed keywords
    let result = '';
    while (this.current_char !== undefined && isAlpha(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    if (result in REVERSED_KEYWORDS) {
      const token = REVERSED_KEYWORDS[result];
      if (result === 'js') {
        this.skip_whitespace();
        this.advance();
        const end = findGroupEnd(this.text, this.pos);
        token.value = this.text.slice(this.pos, end);
        this.pos = end + 1;
        this.current_char = this.text[end + 1];
      }
      return token;
    }
    this.error();
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
      this.advance(3);
      return new Token(TokenType.REM, +result);
    }
    if (next.startsWith('px')) {
      this.advance(2);
      return new Token(TokenType.PIXEL, +result);
    }
    if (next.startsWith('em')) {
      this.advance(2);
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
      this.advance(3);
      return new Token(TokenType.DEGREE, +result);
    }
    this._isID = false;
    return new Token(TokenType.NUMBER, +result);
  }

  color(): Token {
    let result = '';
    while (this.current_char !== undefined && isAlpha(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    return new Token(TokenType.COLOR, '#' + result);
  }

  id(): Token {
    let result = '';
    while (this.current_char !== undefined && isAlpha(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    this._isID = true;
    switch (result) {
    case 'and':
      return new Token(TokenType.AND, result);
    case 'or':
      return new Token(TokenType.OR, result);
    case 'not':
      if (this.peek_next_token().type === TokenType.IN) return new Token(TokenType.NOTIN, 'not in');
      return new Token(TokenType.NOT, result);
    case 'from':
      return new Token(TokenType.FROM, result);
    case 'as':
      return new Token(TokenType.AS, result);
    case 'in':
      return new Token(TokenType.IN, result);
    case 'True':
      return new Token(TokenType.TRUE, 1);
    case 'False':
      return new Token(TokenType.FALSE, 0);
    case 'None':
      return new Token(TokenType.NONE, undefined);
    default:
      return new Token(TokenType.ID, result);
    }
  }

  property(): Token {
    let result = '';
    let prev = '';
    while (this.current_char !== undefined && (this.current_char !== ';' || prev === '\\')) {
      result += this.current_char;
      prev = this.current_char;
      this.advance();
    }
    return new Token(/\${.*}/.test(result)? TokenType.TEMPLATE : TokenType.STRING, result);
  }

  unknown(): Token {
    let result = '';
    let prev = '';
    while (this.current_char !== undefined && (!['{', ';'].includes(this.current_char) || prev === '\\')) {
      result += this.current_char;
      prev = this.current_char;
      this.advance();
    }
    this._isID = true;
    return new Token(TokenType.ID, result.trimEnd());
  }

  peek_next_token(count = 1): Token {
    const pos = this.pos;
    const char = this.current_char;
    let token = this.get_next_token();
    while (count > 1) {
      token = this.get_next_token();
      count--;
    }
    this.pos = pos;
    this.current_char = char;
    return token;
  }

  get_next_token(): Token {
    let next: string | undefined;
    while (this.current_char !== undefined) {
      if (isSpace(this.current_char)) {
        this.skip_whitespace();
        continue;
      }

      if (isDigit(this.current_char)) {
        return this.numeric();
      }

      if (isAlpha(this.current_char)) {
        return this.id();
      }

      switch (this.current_char) {
      case '@':
        this.advance();
        return this.keyword();
      case '$':
        this.advance();
        return new Token(TokenType.DOLLAR, '$');
      case '=':
        this.advance();
        if (this.current_char === '=') {
          this.advance();
          return new Token(TokenType.EQUAL, '==');
        }
        return new Token(TokenType.ASSIGN, '=');
      case '!':
        next = this.advance();
        if (next === '=') {
          this.advance();
          return new Token(TokenType.NOTEQUAL, '!=');
        }
        return new Token(TokenType.NO, '!');
      case ':':
        this.advance();
        if (!this._isID) return new Token(TokenType.COLON, ':'); // dict pairs assign
        this.skip_whitespace(); // prop assign
        return this.property();
      case ';':
        this.advance();
        return new Token(TokenType.SEMI, ';');
      case '\'':
        this.advance();
        return this.string('\'');
      case '"':
        this.advance();
        return this.string('"');
      case '`':
        this.advance();
        return this.string('`');
      case '#':
        this.advance();
        return this.color();
      case '{':
        this.advance();
        return new Token(TokenType.LCURLY, '{');
      case '}':
        this.advance();
        return new Token(TokenType.RCURLY, '}');
      case '+':
        next = this.advance();
        switch(next) {
        case '=':
          this.advance();
          return new Token(TokenType.ADDEQUAL, '+=');
        case '+':
          this.advance();
          return new Token(TokenType.INCREASE, '++');
        }
        return new Token(TokenType.PLUS, '+');
      case '-':
        next = this.advance();
        switch(next) {
        case '=':
          this.advance();
          return new Token(TokenType.MINUSEQUAL, '-=');
        case '-':
          this.advance();
          return new Token(TokenType.DECREASE, '--');
        }
        return new Token(TokenType.MINUS, '-');
      case '%':
        next = this.advance();
        if (next === '=') {
          this.advance();
          return new Token(TokenType.MODEQUAL, '%=');
        }
        return new Token(TokenType.MOD, '%');
      case '*':
        next = this.advance();
        switch(next) {
        case '=':
          this.advance();
          return new Token(TokenType.MULEQUAL, '*=');
        case '*':
          next = this.advance();
          if (next === '=') {
            this.advance();
            return new Token(TokenType.EXPEQUAL, '**=');
          }
          return new Token(TokenType.EXP, '**');
        }
        return new Token(TokenType.MUL, '*');
      case '/':
        this.advance();
        return new Token(TokenType.DIV, '/');
      case '>':
        next = this.advance();
        if (next === '=') {
          this.advance();
          return new Token(TokenType.GERATEREQUAL, '>=');
        }
        return new Token(TokenType.GERATER, '>');
      case '<':
        next = this.advance();
        if (next === '=') {
          this.advance();
          return new Token(TokenType.LESSEQUAL, '<=');
        }
        return new Token(TokenType.LESS, '<');
      case '?':
        this.advance();
        return new Token(TokenType.TERNARY, '?');
      case '(':
        this.advance();
        return new Token(TokenType.LPAREN, '(');
      case ')':
        this.advance();
        return new Token(TokenType.RPAREN, ')');
      case '[':
        this.advance();
        return new Token(TokenType.LSQUARE, '[');
      case ']':
        this.advance();
        return new Token(TokenType.RSQUARE, ']');
      case ',':
        this.advance();
        return new Token(TokenType.COMMA, ',');
      case '.':
        if (!/^\.[^;]+{/.test(this.text.slice(this.pos))) {
          // not a selector
          this.advance();
          return new Token(TokenType.DOT, '.');
        }
        return this.unknown();
      default:
        return this.unknown();
      }
    }
    return new Token(TokenType.EOF, undefined);
  }
}
