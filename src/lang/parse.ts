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

export class AST {
}

export class BinOp {
  left: Num | BinOp;
  op: Token;
  right: Num | BinOp;
  constructor(left: Num | BinOp, op: Token, right: Num | BinOp) {
    this.left = left;
    this.op = op;
    this.right = right;
  }
}

export class Num {
  token: Token;
  value: number;
  constructor(token: Token) {
    this.token = token;
    this.value = token.value as number;
  }
}

export class Parser {
  lexer: Lexer;
  current_token: Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
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

  factor(): Num | BinOp {
    // factor: INTEGER | LPAREN expr RPAREN
    let node;
    const token = this.current_token;
    switch (token.type) {
    case TOKENS.INTEGER:
      this.eat(TOKENS.INTEGER);
      return new Num(token);
    case TOKENS.LPAREN:
      this.eat(TOKENS.LPAREN);
      node = this.expr();
      this.eat(TOKENS.RPAREN);
      return node;
    default:
      this.error();
    }
  }

  term(): BinOp | Num {
    // term: factor ((MUL | DIV) factor)*
    let node = this.factor();
    while ([TOKENS.MUL, TOKENS.DIV].includes(this.current_token.type)) {
      const token = this.current_token;
      switch (token.type) {
      case TOKENS.MUL:
        this.eat(TOKENS.MUL);
        break;
      case TOKENS.DIV:
        this.eat(TOKENS.DIV);
        break;
      }
      node = new BinOp(node, token, this.factor());
    }
    return node;
  }

  expr(): Num | BinOp {
    // expr   : term ((PLUS | MINUS) term)*
    // term   : factor ((MUL | DIV) factor)*
    // factor : INTEGER | LPAREN expr RPAREN
    let node = this.term();
    while ([TOKENS.PLUS, TOKENS.MINUS].includes(this.current_token.type)) {
      const token = this.current_token;
      switch (token.type) {
      case TOKENS.PLUS:
        this.eat(TOKENS.PLUS);
        break;
      case TOKENS.MINUS:
        this.eat(TOKENS.MINUS);
        break;
      }
      node = new BinOp(node, token, this.term());
    }
    return node;
  }

  parse(): Num | BinOp {
    const result = this.expr();
    // recover state
    this.lexer = new Lexer(this.lexer.text);
    this.current_token = this.lexer.get_next_token();
    return result;
  }
}

export class Interpreter {
  parser: Parser;

  constructor(parser: Parser) {
    this.parser = parser;
  }

  error(): never {
    throw Error('interpret error');
  }

  visit(node: Num | BinOp): number {
    if (node instanceof Num) return this.visit_Num(node);
    if (node instanceof BinOp) return this.visit_BinOp(node);
    this.error();
  }

  visit_BinOp(node: BinOp): number {
    switch (node.op.type) {
    case TOKENS.PLUS:
      return this.visit(node.left) + this.visit(node.right);
    case TOKENS.MINUS:
      return this.visit(node.left) - this.visit(node.right);
    case TOKENS.MUL:
      return this.visit(node.left) * this.visit(node.right);
    case TOKENS.DIV:
      return this.visit(node.left) / this.visit(node.right);
    }
    this.error();
  }

  visit_Num(node: Num): number {
    return node.value;
  }

  interpret(): number {
    return this.visit(this.parser.parse());
  }
}
