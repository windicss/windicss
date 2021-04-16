import { Lexer } from './lexer';
import { TokenType, BinOp, UnaryOp, Num, Var, Assign, Update, JS, NoOp, Str, Block, PropDecl, StyleDecl, Program, Template, Console } from './tokens';
import type { Token, Operand } from './tokens';

/* syntax

program : import_list? block

import_list : import SEMI import_list

block : statement_list style_list

statement_list : statement
               | statement SEMI statement_list

statement : assignment_statement
          | empty

assignment_statement : variable ASSIGN expr

style_list : style_declaration
           | style_declaration style_list

style_declaration : ID LBRACKET block RBRACKET
                  | empty

statement_list : statement
               | statement SEMI statement_list

empty :

expr: term ((PLUS | MINUS) term)*

term: factor ((MUL | DIV) factor)*

factor : PLUS factor
        | MINUS factor
        | INTEGER
        | LPAREN expr RPAREN
        | variable

variable: ID

*/
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

  eat(token_type: string): Token {
    if (this.current_token.type === token_type) {
      const next_token = this.lexer.get_next_token();
      this.current_token = next_token;
      return next_token;
    } else {
      this.error();
    }
  }

  factor(): Operand {
    // factor: (PLUS|MINUS)factor | INTEGER | LPAREN expr RPAREN | variable
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
    case TokenType.ID:
      this.eat(TokenType.ID);
      return new Var(token);
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

  expr(): Operand | Str | Template {
    // expr   : term ((PLUS | MINUS) term)* | STRING | TEMPLATE
    // term   : factor ((MUL | DIV) factor)*
    // factor : (PLUS|MINUS)factor | INTEGER | LPAREN expr RPAREN | variable

    if (this.current_token.type === TokenType.STRING) {
      const token = new Str(this.current_token);
      this.eat(TokenType.STRING);
      return token;
    } else if (this.current_token.type === TokenType.TEMPLATE) {
      const token = new Template(this.current_token);
      this.eat(TokenType.TEMPLATE);
      return token;
    } else {
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

  }

  empty(): NoOp {
    return new NoOp();
  }

  console_statement(type: TokenType.LOG | TokenType.WARN | TokenType.ERROR): Console {
    // @log 3 + 2
    this.eat(type);
    const expr = this.expr();
    return new Console(type, expr);
  }

  assignment_statement(): Assign {
    // @var name = 3
    this.eat(TokenType.VAR);
    const left = new Var(this.current_token);
    this.eat(TokenType.ID);
    const token = this.current_token;
    this.eat(TokenType.ASSIGN);
    const right = this.expr();
    return new Assign(left, token, right);
  }

  update_statement(): Update {
    // borderWidth = borderWidth + 4rem;
    const left = this.current_token;
    this.eat(TokenType.ID);
    const op = this.current_token;
    this.eat(TokenType.ASSIGN);
    const right = this.expr();
    return new Update(new Var(left), op, right);
  }

  javascript_statement(): JS {
    // @js {
    //   ...
    // }
    const code = this.current_token.value;
    this.eat(TokenType.JS);
    return new JS(code as string);
  }

  statement(): Assign | NoOp {
    /*
      statement : assignment_statement
                | update_statement
                | expression_statement
                | console_statement
                | empty
    */
    let node;
    let next_type;
    switch (this.current_token.type) {
    case TokenType.VAR:
      node = this.assignment_statement();
      break;
    case TokenType.LOG:
      node = this.console_statement(TokenType.LOG);
      break;
    case TokenType.WARN:
      node = this.console_statement(TokenType.WARN);
      break;
    case TokenType.ERROR:
      node = this.console_statement(TokenType.ERROR);
      break;
    case TokenType.JS:
      node = this.javascript_statement();
      break;
    case TokenType.ID:
      next_type = this.lexer.peek_next_token().type;
      if (next_type === TokenType.ASSIGN) {
        // update statement
        node = this.update_statement();
      } else if ([TokenType.LBRACKET, TokenType.STRING, TokenType.TEMPLATE].includes(next_type)) {
        // style
        node = this.empty();
      } else {
        // expression statement
        node = this.expr();
      }
      break;
    default:
      node = this.empty();
    }
    return node;
  }

  statement_list(): ( Assign | NoOp )[] {
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

  style_declaration(): StyleDecl | PropDecl | NoOp {
    /*
      style_declaration : ID LBRACKET block RBRACKET
                        | ID Template | Str
                        | prop_list
                        | empty
    */
    let node;
    const name = this.current_token.value?.toString() ?? '';
    if (this.current_token.type === TokenType.ID) {
      const next_token = this.eat(TokenType.ID);
      if (next_token.type === TokenType.LBRACKET) {
        // style
        this.eat(TokenType.LBRACKET);
        node = new StyleDecl(name, this.block());
        this.eat(TokenType.RBRACKET);
      } else if (next_token.type === TokenType.STRING) {
        // prop
        this.eat(TokenType.STRING);
        node = new PropDecl(name, new Str(next_token));
        this.eat(TokenType.SEMI);
      } else if (next_token.type === TokenType.TEMPLATE) {
        // prop
        this.eat(TokenType.TEMPLATE);
        node = new PropDecl(name, new Template(next_token));
        this.eat(TokenType.SEMI);
      } else {
        this.error();
      }
    } else {
      node = this.empty();
    }
    return node;
  }

  style_list(): (StyleDecl | PropDecl | NoOp)[] {
    /*
      style_list : style_declaration
                 | prop_declaration
                 | style_declaration style_list
    */
    const node = this.style_declaration();
    const results = [ node ];
    while (this.current_token.type === TokenType.ID) {
      results.push(this.style_declaration());
    }
    return results;
  }

  block(): Block {
    return new Block(this.statement_list(), this.style_list());
  }

  program(): Program {
    return new Program(this.block());
  }

  parse(): Program {
    const node = this.program();
    if (this.current_token.type !== TokenType.EOF) this.error();
    return node;
  }
}
