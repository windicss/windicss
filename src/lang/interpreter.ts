import { Parser } from './parser';
import { TokenType, BinOp, UnaryOp, Num, Var, Assign, NoOp } from './tokens';
import type { Operand } from './tokens';

export default class Interpreter {
  parser: Parser;
  GLOBAL_SCOPE: {[key:string]: unknown} = {};

  constructor(parser: Parser) {
    this.parser = parser;
  }

  error(msg = 'Interpreter Error'): never {
    throw Error(msg);
  }

  visit(node: Operand): unknown {
    if (node instanceof Var) return this.visit_Var(node);
    if (node instanceof Assign) return this.visit_Assign(node);
    if (node instanceof Num) return this.visit_Num(node);
    if (node instanceof UnaryOp) return this.visit_UnaryOp(node);
    if (node instanceof BinOp) return this.visit_BinOp(node);
    if (node instanceof NoOp) return this.visit_NoOp();
    this.error();
  }

  visit_Num(node: Num): number {
    return node.value;
  }

  visit_BinOp(node: BinOp): number {
    const left_value = this.visit(node.left);
    const right_value = this.visit(node.right);
    if (typeof left_value === 'number' && typeof right_value === 'number') {
      switch (node.op.type) {
      case TokenType.PLUS:
        return left_value + right_value;
      case TokenType.MINUS:
        return left_value - right_value;
      case TokenType.MUL:
        return left_value * right_value;
      case TokenType.DIV:
        return left_value / right_value;
      }
    }
    this.error();
  }

  visit_UnaryOp(node: UnaryOp): number {
    const value = this.visit(node.expr);
    if (typeof value === 'number') {
      switch (node.op.type) {
      case TokenType.PLUS:
        return +value;
      case TokenType.MINUS:
        return -value;
      }
    }
    this.error();
  }

  visit_Assign(node: Assign): void {
    this.GLOBAL_SCOPE[node.left.value] = this.visit(node.right);
  }

  visit_Var(node: Var): unknown {
    const var_name = node.value;
    if (var_name in this.GLOBAL_SCOPE) {
      return this.GLOBAL_SCOPE[var_name];
    }
    this.error(`unknown variable '${var_name}'`);
  }

  visit_NoOp():void {
    return;
  }

  interpret(): unknown {
    return this.visit(this.parser.parse());
  }
}
