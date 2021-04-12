import { isSpace, isDigit } from './utils';

export const TOKENS = {
  INTEGER: 'INTEGER',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MUL: 'MUL',
  DIV: 'DIV',
  LPAREN: '(',
  RPAREN: ')',
  EOF: 'EOF',
};

export class Token {
  type: string;
  value?: string | number;

  constructor(type: string, value?: string | number) {
    this.type = type;
    this.value = value;
  }
}

export class Lexer {
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

  skip_whitespace(): void {
    while (this.current_char !== undefined && isSpace(this.current_char)) {
      this.advance();
    }
  }

  integer(): number {
    let result = '';
    while (this.current_char !== undefined && isDigit(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    return +result;
  }

  get_next_token(): Token {
    while (this.current_char !== undefined) {
      if (isSpace(this.current_char)) {
        this.skip_whitespace();
        continue;
      }

      if (isDigit(this.current_char)) {
        return new Token(TOKENS.INTEGER, this.integer());
      }

      switch (this.current_char) {
      case '+':
        this.advance();
        return new Token(TOKENS.PLUS, '+');
      case '-':
        this.advance();
        return new Token(TOKENS.MINUS, '+');
      case '*':
        this.advance();
        return new Token(TOKENS.MUL, '*');
      case '/':
        this.advance();
        return new Token(TOKENS.DIV, '/');
      case '(':
        this.advance();
        return new Token(TOKENS.LPAREN, '(');
      case ')':
        this.advance();
        return new Token(TOKENS.RPAREN, ')');
      }

    }
    return new Token(TOKENS.EOF, undefined);
  }

}

export class Interpreter {
  lexer: Lexer;
  current_token: Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    // get first token
    this.current_token = lexer.get_next_token();
  }

  error(): never {
    throw Error('Invalid syntax');
  }

  eat(token_type: string): void {
    if (this.current_token.type === token_type) {
      this.current_token = this.lexer.get_next_token();
    } else {
      this.error();
    }
  }

  factor(): number {
    // factor: INTEGER | LPAREN expr RPAREN
    let result;
    const token = this.current_token;
    switch (token.type) {
    case TOKENS.INTEGER:
      this.eat(TOKENS.INTEGER);
      return token.value as number;
    case TOKENS.LPAREN:
      this.eat(TOKENS.LPAREN);
      result = this.expr();
      this.eat(TOKENS.RPAREN);
      return result;
    default:
      this.error();
    }
  }

  term():number {
    // term: factor ((MUL | DIV) factor)*
    let result = this.factor() as number;
    while ([TOKENS.MUL, TOKENS.DIV].includes(this.current_token.type)) {
      switch (this.current_token.type) {
      case TOKENS.MUL:
        this.eat(TOKENS.MUL);
        result = result * (this.factor() as number);
        break;
      case TOKENS.DIV:
        this.eat(TOKENS.DIV);
        result = result / (this.factor() as number);
        break;
      }
    }
    return result;
  }

  expr():number {
    let result:number = this.term();
    while ([TOKENS.PLUS, TOKENS.MINUS].includes(this.current_token.type)) {
      switch (this.current_token.type) {
      case TOKENS.PLUS:
        this.eat(TOKENS.PLUS);
        result = result + this.term();
        break;
      case TOKENS.MINUS:
        this.eat(TOKENS.MINUS);
        result = result - this.term();
        break;
      }
    }
    return result;
  }
}
