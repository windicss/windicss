import { Lexer } from './lexer';
import { Token, TokenType, BinOp, UnaryOp, Num, Var, Assign, Update, Import, Load, JS, NoOp, Str, Block, PropDecl, StyleDecl, Program, Template, Console, Tuple, Params, List, Dict, Bool, None, Func, Lambda, Return, Yield, Raise, Continue, Break, DataType, If, While, With, Try, Apply, Attr, Del, Instance, Await, For } from './tokens';
import type { Operand, Module } from './tokens';

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

style_declaration : ID LCURLY block RCURLY
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

const UNARYOPS = ['+', '-', '!'];
const BINOPS = [['*', '/', '%'], ['+', '-'], ['==', '!=', '>', '>=', '<', '<='], ['in', 'not in'], ['not'], ['and'], ['or']];

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

  list(): List {
    const values = [];
    this.eat(TokenType.LSQUARE);
    while(this.current_token.type !== TokenType.RSQUARE) {
      values.push(this.expr());
      if (this.current_token.type === TokenType.COMMA) this.eat(TokenType.COMMA);
    }
    this.eat(TokenType.RSQUARE);
    return new List(values);
  }

  tuple(): DataType {
    let node;
    const values:DataType[] = [];
    let next = this.eat(TokenType.LPAREN);
    if (this.current_token.type !== TokenType.RPAREN) {
      node = this.expr();
      if (this.current_token.type === TokenType.COMMA) {
        // tuple
        values.push(node);
        this.eat(TokenType.COMMA);
        let current = this.current_token;
        while(current.type !== TokenType.RPAREN) {
          values.push(this.expr());
          current = this.current_token;
          if (current.type === TokenType.COMMA) this.eat(TokenType.COMMA);
        }
      } else {
        // (expr)
        this.eat(TokenType.RPAREN);
        return node;
      }
    }
    next = this.eat(TokenType.RPAREN);

    if (next.type === TokenType.ARROW) {
      next = this.eat(TokenType.ARROW);
      const params = values.map(i => {
        if (i instanceof Var) {
          return i.value;
        }
        this.error();
      });
      if (next.type === TokenType.LCURLY) {
        this.eat(TokenType.LCURLY);
        const func = new Func(params, this.block());
        this.eat(TokenType.RCURLY);
        return func;
      }
      return new Lambda(params, this.expr());
    }
    return new Tuple(values);
  }

  dict(): Dict {
    const pairs:[string|number, (Operand | Str | Template | Tuple | List | Dict)][] = [];
    this.eat(TokenType.LCURLY);
    while(this.current_token.type !== TokenType.RCURLY) {
      const token = this.current_token;
      if (token.value === undefined) this.error();
      if (token.type === TokenType.NUMBER) {
        this.eat(TokenType.NUMBER);
      } else if (token.type === TokenType.STRING) {
        this.eat(TokenType.STRING);
      } else {
        this.error();
      }
      this.eat(TokenType.COLON);
      pairs.push([token.value, this.expr()]);
      if (this.current_token.type === TokenType.COMMA) this.eat(TokenType.COMMA);
    }
    this.eat(TokenType.RCURLY);
    return new Dict(pairs);
  }

  instance(): Instance {
    this.eat(TokenType.NEW);
    const name = this.current_token.value as string;
    this.eat(TokenType.ID);
    let params: DataType[] | undefined;
    let next = this.current_token;
    if (next.type === TokenType.LPAREN) {
      next = this.eat(TokenType.LPAREN);
      if (!params) params = [];
      while(next.type !== TokenType.RPAREN) {
        params.push(this.expr());
        next = this.current_token;
        if (next.type === TokenType.COMMA) this.eat(TokenType.COMMA);
      }
      this.eat(TokenType.RPAREN);
      return new Instance(name, params);
    }
    return new Instance(name);
  }

  data(): DataType {
    // data: NUMBER | TRUE | FALSE | NONE | LPAREN expr RPAREN | variable | arrow function | new object
    const token = this.current_token;
    switch (token.type) {
    case TokenType.NUMBER:
      this.eat(TokenType.NUMBER);
      return new Num(token);
    case TokenType.TRUE:
      this.eat(TokenType.TRUE);
      return new Bool(true);
    case TokenType.FALSE:
      this.eat(TokenType.FALSE);
      return new Bool(false);
    case TokenType.NONE:
      this.eat(TokenType.NONE);
      return new None();
    case TokenType.LPAREN:
      return this.tuple();
    case TokenType.STRING:
      this.eat(TokenType.STRING);
      return new Str(token);
    case TokenType.TEMPLATE:
      this.eat(TokenType.TEMPLATE);
      return new Template(token);
    case TokenType.LSQUARE:
      return this.list();
    case TokenType.LCURLY:
      return this.dict();
    case TokenType.NEW:
      return this.instance();
    case TokenType.AWAIT:
      this.eat(TokenType.AWAIT);
      return new Await(this.expr());
    case TokenType.ID:
      this.eat(TokenType.ID);
      // @var add3 = a => a + 3;
      if (this.current_token.type === TokenType.ARROW) {
        this.eat(TokenType.ARROW);
        return new Lambda([token.value as string], this.expr());
      }
      return new Var(token);
    default:
      this.error();
    }
  }

  sub(): DataType {
    let node = this.data();
    while ([TokenType.LSQUARE, TokenType.DOT, TokenType.LPAREN].includes(this.current_token.type)) {
      const token = this.current_token;
      if (token.type === TokenType.LSQUARE) {
        this.eat(TokenType.LSQUARE);
        node = new BinOp(node, token, this.expr());
        this.eat(TokenType.RSQUARE);
      } else if (token.type === TokenType.LPAREN) {
        this.eat(TokenType.LPAREN);
        const params = [];
        let next = this.current_token;
        while(next.type !== TokenType.RPAREN) {
          params.push(this.expr());
          next = this.current_token;
          if (next.type === TokenType.COMMA) this.eat(TokenType.COMMA);
        }
        node = new BinOp(node, token, new Params(params));
        this.eat(TokenType.RPAREN);
      } else {
        this.eat(TokenType.DOT);
        node = new BinOp(node, token, new Var(this.current_token));
        this.eat(TokenType.ID);
      }
    }
    return node;
  }

  exp(): DataType {
    // exp: sub (** sub)*
    let node = this.sub();
    while (this.current_token.type === TokenType.EXP) {
      const token = this.current_token;
      this.eat(token.type);
      node = new BinOp(node, token, this.sub());
    }
    return node;
  }

  unary(): DataType {
    // unary: (+|-|!)*exp
    let node;
    while (UNARYOPS.includes(this.current_token.type)) {
      const token = this.current_token;
      this.eat(this.current_token.type);
      node = new UnaryOp(token, this.exp());
    }
    return node ?? this.exp();
  }

  binop(index: number): Operand {
    // term: factor ((MUL | DIV) factor)*
    if (index === 4 && this.current_token.type === TokenType.NOT) {
      // 'not' is a special case
      const token = this.current_token;
      this.eat(token.type);
      return new UnaryOp(token, this.binop(3));
    }
    let node = index === 0 ? this.unary() : this.binop(index - 1);
    while (BINOPS[index].includes(this.current_token.type)) {
      const token = this.current_token;
      this.eat(token.type);
      node = new BinOp(node, token, index === 0 ? this.unary(): this.binop(index - 1));
    }
    return node;
  }

  expr(): DataType {
    // dict | list | tuple | expr...
    // if (this.current_token.type === TokenType.LCURLY) return this.dict();
    // if (this.current_token.type === TokenType.LSQUARE) return this.list();
    // if (this.current_token.type === TokenType.LPAREN) return this.tuple();
    return this.binop(BINOPS.length - 1);
  }

  exprs(): DataType {
    // expr, exprs...
    let node = this.expr();
    while (this.current_token.type === TokenType.COMMA) {
      const token = this.current_token;
      this.eat(TokenType.COMMA);
      node = new BinOp(node, token, this.exprs());
    }
    return node;
  }

  empty(): NoOp {
    return new NoOp();
  }

  console_statement(type: TokenType.LOG | TokenType.WARN | TokenType.ERROR | TokenType.ASSERT): Console {
    // @log 3 + 2
    this.eat(type);
    const expr = this.exprs();
    return new Console(type, expr);
  }

  assignment_statement(): Assign {
    // @var name = 3
    this.eat(TokenType.VAR);
    const left = new Var(this.current_token);
    this.eat(TokenType.ID);
    const token = this.current_token;
    this.eat(TokenType.ASSIGN);
    const right = this.exprs();
    return new Assign(left, token, right);
  }

  update_statement(): Update {
    // borderWidth = borderWidth + 4rem;
    const left = this.current_token;
    this.eat(TokenType.ID);
    const op = this.current_token;
    this.eat(TokenType.ASSIGN);
    const right = this.exprs();
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

  function_statement(async = false): Func | Lambda {
    // @func name(id1, id2) {...}
    // @func (id1, id2) {...}
    // @func name(id1, id2) => ...
    // @func (id1, id2) => ...
    let name: string | undefined;
    const params: string[] = [];
    async ? this.eat(TokenType.ASYNC): this.eat(TokenType.FUNC);
    if (this.current_token.type === TokenType.ID) {
      name = this.current_token.value as string;
      this.eat(TokenType.ID);
    }
    // @func name(id1, id2, ...)
    let next_token = this.eat(TokenType.LPAREN);
    while(next_token.type !== TokenType.RPAREN) {
      params.push(next_token.value as string);
      next_token = this.eat(TokenType.ID);
      if (next_token.type === TokenType.COMMA) next_token = this.eat(TokenType.COMMA);
    }
    this.eat(TokenType.RPAREN);
    if (this.current_token.type === TokenType.ARROW) {
      this.eat(TokenType.ARROW);
      return new Lambda(params, this.expr(), name, async);
    }
    if (this.current_token.type === TokenType.LCURLY) {
      this.eat(TokenType.LCURLY);
      const block = this.block();
      this.eat(TokenType.RCURLY);
      return new Func(params, block, name, async);
    }
    this.error();
  }

  if_statement(): If {
    this.eat(TokenType.IF);
    const expr = this.expr();
    this.eat(TokenType.LCURLY);
    const state = new If(expr, this.block());
    this.eat(TokenType.RCURLY);
    while (this.current_token.type === TokenType.ELIF) {
      this.eat(TokenType.ELIF);
      const expr = this.expr();
      this.eat(TokenType.LCURLY);
      state.add_elif(expr, this.block());
      this.eat(TokenType.RCURLY);
    }
    if (this.current_token.type === TokenType.ELSE) {
      this.eat(TokenType.ELSE);
      this.eat(TokenType.LCURLY);
      state.add_else(this.block());
      this.eat(TokenType.RCURLY);
    }
    return state;
  }

  try_statement(): Try {
    this.eat(TokenType.TRY);
    this.eat(TokenType.LCURLY);
    const state = new Try(this.block());
    this.eat(TokenType.RCURLY);
    while (this.current_token.type === TokenType.EXCEPT) {
      const error = this.eat(TokenType.EXCEPT);
      if (error.type === TokenType.LCURLY) {
        this.eat(TokenType.LCURLY);
        state.add_finally_except(this.block());
        this.eat(TokenType.RCURLY);
        break;
      }
      const next = this.eat(TokenType.ID);
      let alias;
      if (next.type === TokenType.AS) {
        alias = this.eat(TokenType.AS).value as string;
        this.eat(TokenType.ID);
      }
      this.eat(TokenType.LCURLY);
      state.add_except(error.value as string, this.block(), alias);
      this.eat(TokenType.RCURLY);
    }
    if (this.current_token.type === TokenType.ELSE) {
      this.eat(TokenType.ELSE);
      this.eat(TokenType.LCURLY);
      state.add_else(this.block());
      this.eat(TokenType.RCURLY);
    }
    if (this.current_token.type === TokenType.FINALLY) {
      this.eat(TokenType.FINALLY);
      this.eat(TokenType.LCURLY);
      state.add_finally(this.block());
      this.eat(TokenType.RCURLY);
    }
    return state;
  }

  while_statement(): While {
    this.eat(TokenType.WHILE);
    const expr = this.expr();
    this.eat(TokenType.LCURLY);
    const state = new While(expr, this.block());
    this.eat(TokenType.RCURLY);
    if (this.current_token.type === TokenType.ELSE) {
      this.eat(TokenType.ELSE);
      this.eat(TokenType.LCURLY);
      state.add_else(this.block());
      this.eat(TokenType.RCURLY);
    }
    return state;
  }

  for_statement(): For {
    this.eat(TokenType.FOR);
    const variables:string[] = [];
    while (this.current_token.type === TokenType.ID) {
      variables.push(this.current_token.value as string);
      const next = this.eat(TokenType.ID);
      if (next.type === TokenType.COMMA) this.eat(TokenType.COMMA);
    }
    this.eat(TokenType.IN);
    const expr = this.expr();
    this.eat(TokenType.LCURLY);
    const state = new For(variables, expr, this.block());
    this.eat(TokenType.RCURLY);
    if (this.current_token.type === TokenType.ELSE) {
      this.eat(TokenType.ELSE);
      this.eat(TokenType.LCURLY);
      state.add_else(this.block());
      this.eat(TokenType.RCURLY);
    }
    return state;
  }

  with_statement(): With {
    this.eat(TokenType.WITH);
    const expr = this.expr();
    const name = this.eat(TokenType.AS).value as string;
    this.eat(TokenType.ID);
    this.eat(TokenType.LCURLY);
    const block = this.block();
    this.eat(TokenType.RCURLY);
    return new With(expr, name, block);
  }

  import_statement(): Import {
    // @import 'a.windi', 'b.windi', 'c.css'
    this.eat(TokenType.IMPORT);
    const urls:string[] = [];
    while (this.current_token.type === TokenType.STRING) {
      urls.push(this.current_token.value as string);
      const next_token = this.eat(TokenType.STRING);
      if (next_token.type === TokenType.COMMA) {
        this.eat(TokenType.COMMA);
      }
    }
    return new Import(urls);
  }

  import_path(): string {
    // from 'module'
    const next_token = this.eat(TokenType.FROM);
    if (next_token.type !== TokenType.STRING) this.error();
    this.eat(TokenType.STRING);
    return next_token.value as string;
  }

  import_all(): Module {
    // * from "module"
    // * as name from "module"
    this.eat(TokenType.MUL);
    if (this.current_token.type === TokenType.FROM) return { url: this.import_path(), exports: { '*': '*' } };
    if (this.current_token.type === TokenType.AS) {
      const next_token = this.eat(TokenType.AS);
      this.eat(TokenType.ID);
      return { url: this.import_path(), exports: { [next_token.value as string]: '*' } };
    }
    this.error();
  }

  import_exports(): Module {
    // { export1 , export2 as alias2 , export3 as alias3 } from 'module-name;
    const exports: {[key:string]:string} = {};
    this.eat(TokenType.LCURLY);
    while (this.current_token.type !== TokenType.RCURLY) {
      const value = this.current_token.value as string;
      const next_token = this.eat(TokenType.ID);
      if (next_token.type === TokenType.COMMA) {
        exports[value] = value;
        this.eat(TokenType.COMMA);
      } else if (next_token.type === TokenType.RCURLY) {
        exports[value] = value;
      } else if (next_token.type === TokenType.AS) {
        this.eat(TokenType.AS);
        exports[this.current_token.value as string] = value;
        this.eat(TokenType.ID);
        if (this.current_token.type === TokenType.COMMA) this.eat(TokenType.COMMA);
      } else {
        this.error();
      }
    }
    this.eat(TokenType.RCURLY);
    return { url: this.import_path(), exports };
  }

  import_default(): Module {
    // defaultExport from "module";
    // defaultExport, { export1, export2 } from "module-name";
    // defaultExport, * as name from 'module-name';
    const _default = this.current_token.value as string;
    let next_token = this.eat(TokenType.ID);
    if (next_token.type === TokenType.FROM) return { url: this.import_path(), default: _default };
    if (next_token.type === TokenType.COMMA) {
      next_token = this.eat(TokenType.COMMA);
      if (next_token.type === TokenType.LCURLY) return { default: _default, ...this.import_exports() };
      if (next_token.type === TokenType.MUL) return { default: _default, ...this.import_all() };
    }
    this.error();
  }

  load_statement(): Load {
    /*
      @load 'module1', 'module2', 'module3';
      @load { export1 } from "module-name";
      @load { export1 as alias1 } from "module-name";
      @load { export1 , export2 } from "module-name";
      @load { export1 , export2 as alias2 , export3 as alias3 } from "module-name";
      @load * from "module";
      @load * as name from "module";
      @load defaultExport from "module";
      @load defaultExport, { export1, export2 } from "module-name";
      @load defaultExport, * as name from 'module-name';
    */
    const modules: Module[] = [];
    this.eat(TokenType.LOAD);
    switch (this.current_token.type) {
    case TokenType.STRING:
      while (this.current_token.type === TokenType.STRING) {
        modules.push({ url: this.current_token.value as string });
        const next_token = this.eat(TokenType.STRING);
        if (next_token.type === TokenType.COMMA) {
          this.eat(TokenType.COMMA);
        }
      }
      break;
    case TokenType.LCURLY:
      modules.push(this.import_exports());
      break;
    case TokenType.MUL:
      modules.push(this.import_all());
      break;
    case TokenType.ID:
      modules.push(this.import_default());
      break;
    default:
      this.error();
    }
    return new Load(modules);
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
    case TokenType.FUNC:
      node = this.function_statement(false);
      break;
    case TokenType.ASYNC:
      node = this.function_statement(true);
      break;
    case TokenType.RETURN:
      this.eat(TokenType.RETURN);
      node = new Return(this.expr());
      break;
    case TokenType.APPLY:
      node = new Apply(this.current_token.value as string);
      this.eat(TokenType.APPLY);
      break;
    case TokenType.ATTR:
      node = new Attr(this.current_token.meta as string, this.current_token.value as string);
      this.eat(TokenType.ATTR);
      break;
    case TokenType.YIELD:
      this.eat(TokenType.YIELD);
      node = new Yield(this.expr());
      break;
    case TokenType.RAISE:
      this.eat(TokenType.RAISE);
      node = new Raise(this.expr());
      break;
    case TokenType.DEL:
      this.eat(TokenType.DEL);
      node = new Del(this.expr());
      break;
    case TokenType.CONTINUE:
      this.eat(TokenType.CONTINUE);
      node = new Continue();
      break;
    case TokenType.BREAK:
      this.eat(TokenType.BREAK);
      node = new Break();
      break;
    case TokenType.IMPORT:
      node = this.import_statement();
      break;
    case TokenType.LOAD:
      node = this.load_statement();
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
    case TokenType.ASSERT:
      node = this.console_statement(TokenType.ASSERT);
      break;
    case TokenType.IF:
      node = this.if_statement();
      break;
    case TokenType.WHILE:
      node = this.while_statement();
      break;
    case TokenType.FOR:
      node = this.for_statement();
      break;
    case TokenType.WITH:
      node = this.with_statement();
      break;
    case TokenType.TRY:
      node = this.try_statement();
      break;
    case TokenType.JS:
      node = this.javascript_statement();
      break;
    case TokenType.LPAREN:
    case TokenType.LCURLY:
    case TokenType.LSQUARE:
      node = this.exprs();
      break;
    case TokenType.ID:
      next_type = this.lexer.peek_next_token().type;
      if (next_type === TokenType.ASSIGN) {
        // update statement
        node = this.update_statement();
      } else if ([TokenType.LCURLY, TokenType.STRING, TokenType.TEMPLATE].includes(next_type)) {
        // style
        node = this.empty();
      } else {
        // expression statement
        node = this.exprs();
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
      style_declaration : ID LCURLY block RCURLY
                        | ID Template | Str
                        | prop_list
                        | empty
    */
    let node;
    const name = this.current_token.value?.toString() ?? '';
    if (this.current_token.type === TokenType.ID) {
      const next_token = this.eat(TokenType.ID);
      if (next_token.type === TokenType.LCURLY) {
        // style
        this.eat(TokenType.LCURLY);
        node = new StyleDecl(name, this.block());
        this.eat(TokenType.RCURLY);
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
