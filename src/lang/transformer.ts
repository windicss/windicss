import { Lexer } from './lexer';
import { Parser } from './parser';
import { TokenType, BinOp, UnaryOp, Num, Var, Assign, Compound, NoOp, Str, Template } from './tokens';
import type { Operand } from './tokens';

export default class Transformer {
  parser: Parser;
  code: string[] = [];

  constructor(parser: Parser) {
    this.parser = parser;
  }

  error(msg = 'Interpreter Error'): never {
    throw Error(msg);
  }

  visit(node: Operand): unknown {
    if (node instanceof Compound) return this.visit_Compound(node);
    if (node instanceof Var) return this.visit_Var(node);
    if (node instanceof Assign) return this.visit_Assign(node);
    if (node instanceof Str) return this.visit_Str(node);
    if (node instanceof Template) return this.visit_Template(node);
    if (node instanceof Num) return this.visit_Num(node);
    if (node instanceof UnaryOp) return this.visit_UnaryOp(node);
    if (node instanceof BinOp) return this.visit_BinOp(node);
    if (node instanceof NoOp) return this.visit_NoOp();
    this.error();
  }

  visit_Num(node: Num): number {
    return node.value;
  }

  visit_Template(node: Template): string {
    const value = node.value;
    const len = value.length;
    let index = 0;
    const output:string[] = [];
    while (index < len) {
      const char = value.charAt(index);
      if(char === '$') {
        if (value.charAt(index + 1) === '{') {
          index += 2;
          let exp = '';
          while (value.charAt(index) !== '}' || value.charAt(index - 1) === '\\') {
            exp += value.charAt(index);
            index ++;
          }
          output.push(`\${${this.visit(new Parser(new Lexer(exp)).expr())}}`);
          index ++;
        } else {
          output.push(char);
          index ++;
        }
      } else {
        output.push(char);
        index ++;
      }
    }
    return `\`${output.join('')}\``;
  }

  visit_Str(node: Str): string {
    return `"${node.value}"`;
  }

  visit_BinOp(node: BinOp): string {
    const left_value = this.visit(node.left);
    const right_value = this.visit(node.right);

    switch (node.op.type) {
    case TokenType.PLUS:
      return `add(${left_value}, ${right_value})`;
    case TokenType.MINUS:
      return `minus(${left_value}, ${right_value})`;
    case TokenType.MUL:
      return `mul(${left_value}, ${right_value})`;
    case TokenType.DIV:
      return `div(${left_value}, ${right_value})`;
    }
    this.error();
  }

  visit_UnaryOp(node: UnaryOp): string {
    const value = this.visit(node.expr);
    switch (node.op.type) {
    case TokenType.PLUS:
      return `positive(${value})`;
    case TokenType.MINUS:
      return `negative(${value})`;
    }
    this.error();
  }

  visit_Compound(node: Compound): void {
    node.children.forEach(child => this.visit(child));
  }

  visit_Assign(node: Assign): void {
    this.code.push(`let ${node.left.value} = ${this.visit(node.right)};`);
  }

  visit_Var(node: Var): string {
    return node.value;
  }

  visit_NoOp(): void {
    return;
  }

  transform(): string {
    this.visit(this.parser.parse());
    return this.code.join('\n');
  }
}
