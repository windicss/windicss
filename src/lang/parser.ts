import Lexer from './lexer';
import { Token, TokenType, BinOp, UnaryOp, Num, Operand } from './tokens';

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

  factor(): Operand {
    // factor: (PLUS|MINUS)factor | INTEGER | LPAREN expr RPAREN
    let node;
    const token = this.current_token;
    switch (token.type) {
    case TokenType.PLUS:
      this.eat(TokenType.PLUS);
      return new UnaryOp(token, this.factor());
    case TokenType.MINUS:
      this.eat(TokenType.MINUS);
      return new UnaryOp(token, this.factor());
    case TokenType.NUMBER:
      this.eat(TokenType.NUMBER);
      return new Num(token);
    case TokenType.LPAREN:
      this.eat(TokenType.LPAREN);
      node = this.expr();
      this.eat(TokenType.RPAREN);
      return node;
    default:
      this.error();
    }
  }

  term(): Operand {
    // term: factor ((MUL | DIV) factor)*
    let node = this.factor();
    while ([TokenType.MUL, TokenType.DIV].includes(this.current_token.type)) {
      const token = this.current_token;
      switch (token.type) {
      case TokenType.MUL:
        this.eat(TokenType.MUL);
        break;
      case TokenType.DIV:
        this.eat(TokenType.DIV);
        break;
      }
      node = new BinOp(node, token, this.factor());
    }
    return node;
  }

  expr(): Operand {
    // expr   : term ((PLUS | MINUS) term)*
    // term   : factor ((MUL | DIV) factor)*
    // factor : (PLUS|MINUS)factor | INTEGER | LPAREN expr RPAREN
    let node = this.term();
    while ([TokenType.PLUS, TokenType.MINUS].includes(this.current_token.type)) {
      const token = this.current_token;
      switch (token.type) {
      case TokenType.PLUS:
        this.eat(TokenType.PLUS);
        break;
      case TokenType.MINUS:
        this.eat(TokenType.MINUS);
        break;
      }
      node = new BinOp(node, token, this.term());
    }
    return node;
  }

  parse(): Operand {
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

  visit(node: Operand): number {
    if (node instanceof UnaryOp) return this.visit_UnaryOp(node);
    if (node instanceof Num) return this.visit_Num(node);
    if (node instanceof BinOp) return this.visit_BinOp(node);
    this.error();
  }

  visit_BinOp(node: BinOp): number {
    switch (node.op.type) {
    case TokenType.PLUS:
      return this.visit(node.left) + this.visit(node.right);
    case TokenType.MINUS:
      return this.visit(node.left) - this.visit(node.right);
    case TokenType.MUL:
      return this.visit(node.left) * this.visit(node.right);
    case TokenType.DIV:
      return this.visit(node.left) / this.visit(node.right);
    }
    this.error();
  }

  visit_UnaryOp(node: UnaryOp): number {
    switch (node.op.type) {
    case TokenType.PLUS:
      return +this.visit(node.expr);
    case TokenType.MINUS:
      return -this.visit(node.expr);
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
