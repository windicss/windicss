import Lexer from './lexer';
import { TokenType, BinOp, UnaryOp, Num, Var, Assign, Compound, NoOp } from './tokens';
import type { Token, Operand } from './tokens';

/* syntax

program : compound_statement DOT

compound_statement : BEGIN statement_list END

statement_list : statement
                | statement SEMI statement_list

statement : compound_statement
          | assignment_statement
          | empty

assignment_statement : variable ASSIGN expr

empty :

expr: term ((PLUS | MINUS) term)*

term: factor ((MUL | DIV) factor)*

factor : PLUS factor
        | MINUS factor
        | INTEGER
        | LPAREN expr RPAREN
        | variable

variable: VAR

*/

export default class Parser {
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
    // factor: (PLUS|MINUS)factor | INTEGER | LPAREN expr RPAREN | varibale
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
    case TokenType.VAR:
      return this.variable();
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

  empty(): NoOp {
    return new NoOp();
  }

  variable(): Var {
    const node = new Var(this.current_token);
    this.eat(TokenType.VAR);
    return node;
  }

  assignment_statement(): Assign {
    // variable ASSIGN expr
    const left = this.variable();
    const token = this.current_token;
    this.eat(TokenType.ASSIGN);
    const right = this.expr();
    return new Assign(left, token, right);
  }

  statement(): Compound | Assign | NoOp {
    /*
      statement : compound_statement
                | assignment_statement
                | empty
    */
    let node;
    switch (this.current_token.type) {
    case TokenType.BEGIN:
      node = this.compound_statement();
      break;
    case TokenType.VAR:
      node = this.assignment_statement();
      break;
    default:
      node = this.empty();
    }
    return node;
  }

  statement_list(): (Compound | Assign | NoOp)[] {
    /*
      statement_list : statement
                     | statement SEMI statement_list
    */
    const node = this.statement();
    const results = [ node ];
    while (this.current_token.type === TokenType.SEMI) {
      this.eat(TokenType.SEMI);
      results.push(this.statement());
    }
    if (this.current_token.type === TokenType.VAR) this.error();
    return results;
  }

  compound_statement(): Compound {
    // compound_statement: BEGIN statement_list END
    this.eat(TokenType.BEGIN);
    const nodes = this.statement_list();
    this.eat(TokenType.END);

    return new Compound(nodes);
  }

  program(): Compound {
    // program: compound_statement
    return this.compound_statement();
  }

  parse(): Compound {
    const node = this.program();
    if (this.current_token.type !== TokenType.EOF) this.error();
    return node;
  }
}
