import { Lexer } from './lexer';
import { Parser } from './parser';
import { connect } from './utils';
import { TokenType, BinOp, UnaryOp, Num, Var, Assign, Update, Import, Load, JS, NoOp, Str, Template, Program, Block, PropDecl, StyleDecl, Console, List, Tuple, Params, Dict, Bool, None, Func, Lambda, Return, Yield, Raise, Continue, Break, If, While, With, Try } from './tokens';
import type { Operand } from './tokens';

export default class Transformer {
  parser: Parser;
  code: string[] = [];

  constructor(parser: Parser) {
    this.parser = parser;
  }

  error(msg = 'Transformer Error'): never {
    throw Error(msg);
  }

  visit(node: Operand): string | number | boolean | string[] | void {
    if (node instanceof Program) return this.visit_Program(node);
    if (node instanceof Block) return this.visit_Block(node);
    if (node instanceof PropDecl) return this.visit_PropDecl(node);
    if (node instanceof StyleDecl) return this.visit_StyleDecl(node);
    if (node instanceof Var) return this.visit_Var(node);
    if (node instanceof Load) return this.visit_Load(node);
    if (node instanceof Import) return this.visit_Import(node);
    if (node instanceof Assign) return this.visit_Assign(node);
    if (node instanceof Update) return this.visit_Update(node);
    if (node instanceof JS) return this.visit_JS(node);
    if (node instanceof Console) return this.visit_Console(node);
    if (node instanceof Func) return this.visit_Func(node);
    if (node instanceof Lambda) return this.visit_Lambda(node);
    if (node instanceof Return) return this.visit_Return(node);
    if (node instanceof Yield) return this.visit_Yield(node);
    if (node instanceof Raise) return this.visit_Raise(node);
    if (node instanceof Continue) return this.visit_Continue();
    if (node instanceof Break) return this.visit_Break();
    if (node instanceof Str) return this.visit_Str(node);
    if (node instanceof If) return this.visit_If(node);
    if (node instanceof Try) return this.visit_Try(node);
    if (node instanceof While) return this.visit_While(node);
    if (node instanceof With) return this.visit_With(node);
    if (node instanceof Template) return this.visit_Template(node);
    if (node instanceof Num) return this.visit_Num(node);
    if (node instanceof Bool) return this.visit_Boolean(node);
    if (node instanceof None) return this.visit_None(node);
    if (node instanceof List) return this.visit_List(node);
    if (node instanceof Tuple) return this.visit_Tuple(node);
    if (node instanceof Params) return this.visit_Params(node);
    if (node instanceof Dict) return this.visit_Dict(node);
    if (node instanceof UnaryOp) return this.visit_UnaryOp(node);
    if (node instanceof BinOp) return this.visit_BinOp(node);
    if (node instanceof NoOp) return this.visit_NoOp();
    this.error();
  }

  visit_Num(node: Num): number {
    return node.value;
  }

  visit_Boolean(node: Bool): boolean {
    return node.value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visit_None(node: None): undefined {
    return undefined;
  }

  visit_List(node: List): string {
    return `[${node.values.map(i => this.visit(i)).join(', ')}]`;
  }

  visit_Tuple(node: Tuple): string {
    return `[${node.values.map(i => this.visit(i)).join(', ')}]`;
  }

  visit_Params(node: Params): string {
    return node.values.map(i => this.visit(i)).join(', ');
  }

  visit_Dict(node: Dict): string {
    const output:string[] = [];
    for (const [key, value] of node.pairs) {
      output.push(`${typeof key === 'number'? key: '"' + key + '"'}: ${this.visit(value)}`);
    }
    return `{  \n  ${output.join(',\n  ')}\n}`;
  }

  visit_Func(node: Func): string {
    return node.name ? `function ${node.name}(${node.params.join(', ')}) {
${connect(this.visit_Block(node.block))}
}` : `(function (${node.params.join(', ')}) {
${connect(this.visit_Block(node.block))}
})`;
  }

  visit_Lambda(node: Lambda): string {
    return node.name ? `const ${node.name} = (${node.params.join(', ')}) => ${this.visit(node.expr)}`: `((${node.params.join(', ')}) => ${this.visit(node.expr)})`;
  }

  visit_If(node: If): string {
    let state = `if (${this.visit(node.if_block[0])}) {\n  ${connect(this.visit_Block(node.if_block[1]))}\n}`;
    state += node.elif_blocks?.map(([expr, block]) => {
      return ` else if (${this.visit(expr)}) {\n  ${connect(this.visit_Block(block))}\n}`;
    }).join('') ?? '';
    state += node.else_block ? ` else {\n  ${connect(this.visit_Block(node.else_block))}\n}` : '';
    return state;
  }

  visit_Try(node: Try): string {
    let state = `try {\n  ${connect([...this.visit_Block(node.try_block), ...node.else_block? this.visit_Block(node.else_block): []])}\n}`;
    let excepts = node.except_blocks?.map(([expr, block, alias], index) => {
      return `${index === 0 ? 'if': 'else if'} (e${expr === 'Exception' ? '' : ` instanceof ${expr}`}) {\n  ${connect(alias ? [`let ${alias} = e`, ...this.visit_Block(block)]: this.visit_Block(block))}\n}`;
    });
    if (node.finally_except_block) excepts? excepts.push(`else {\n  ${connect(this.visit_Block(node.finally_except_block))}\n}`): excepts = [`  ${connect(this.visit_Block(node.finally_except_block))}`];
    if (excepts) {
      state += `catch(e) {\n  ${excepts.join(' ')}}`;
    }
    state += node.finally_block ? ` finally {\n  ${connect(this.visit_Block(node.finally_block))}\n}` : '';
    return state;
  }

  visit_While(node: While): string {
    let state = `while (${this.visit(node.if_block[0])}) {\n  ${connect(this.visit_Block(node.if_block[1]))}\n}`;
    state += node.else_block ? `;\nif (!(${this.visit(node.if_block[0])})) {\n  ${connect(this.visit_Block(node.else_block))}\n}` : '';
    return state;
  }

  visit_With(node: With): string {
    return `() => {
  let ${node.name} = ${this.visit(node.expr)};
  ${connect(this.visit_Block(node.block))}
}`;
  }

  visit_Return(node: Return): string {
    return `return ${this.visit(node.value)}`;
  }

  visit_Yield(node: Yield): string {
    return `yield ${this.visit(node.value)}`;
  }

  visit_Raise(node: Raise): string {
    return `throw ${this.visit(node.value)}`;
  }

  visit_Continue(): string {
    return 'continue';
  }

  visit_Break(): string {
    return 'break';
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

  visit_JS(node: JS): string {
    return node.code;
  }

  visit_Import(node: Import): string {
    return node.urls.map(i => `__import__("${i}")`).join(';\n');
  }

  visit_Load(node: Load): string {
    const make_exports = (exports: {
      [key: string]: string;
    }) => {
      const output:string[] = [];
      for (const [key, value] of Object.entries(exports)) {
        output.push(key === value ? key : `${value} as ${key}`);
      }
      const items = output.join(', ');
      return items.charAt(0) === '*' ? items :`{ ${items} }`;
    };

    return node.modules.map(i => {
      if (i.default && i.exports) return `import ${i.default}, ${make_exports(i.exports)} from "${i.url}"`;
      if (i.default) return `import ${i.default} from "${i.url}`;
      if (i.exports) return `import ${make_exports(i.exports)} from "${i.url}"`;
      return `import "${i.url}"`;
    }).join(';\n');
  }

  visit_BinOp(node: BinOp): string {
    const left_value = this.visit(node.left);
    const right_value = this.visit(node.right);

    switch (node.op.type) {
    case TokenType.PLUS:
      return `__add__(${left_value}, ${right_value})`;
    case TokenType.MINUS:
      return `__minus__(${left_value}, ${right_value})`;
    case TokenType.MUL:
      return `__mul__(${left_value}, ${right_value})`;
    case TokenType.DIV:
      return `__div__(${left_value}, ${right_value})`;
    case TokenType.MOD:
      return `__mod__(${left_value}, ${right_value})`;
    case TokenType.EXP:
      return `__exp__(${left_value}, ${right_value})`;
    case TokenType.EQUAL:
      return `${left_value} === ${right_value}`;
    case TokenType.NOTEQUAL:
      return `${left_value} !== ${right_value}`;
    case TokenType.GERATER:
      return `${left_value} > ${right_value}`;
    case TokenType.GERATEREQUAL:
      return `${left_value} >= ${right_value}`;
    case TokenType.LESS:
      return `${left_value} < ${right_value}`;
    case TokenType.LESSEQUAL:
      return `${left_value} <= ${right_value}`;
    case TokenType.OR:
      return `${left_value} || ${right_value}`;
    case TokenType.AND:
      return `${left_value} && ${right_value}`;
    case TokenType.IN:
      return `__in__(${left_value}, ${right_value})`;
    case TokenType.NOTIN:
      return `!(__in__(${left_value}, ${right_value}))`;
    case TokenType.LPAREN:
      return `${left_value}(${right_value})`;
    case TokenType.LSQUARE:
      return `${left_value}[${right_value}]`;
    case TokenType.DOT:
      return `${left_value}.${right_value}`;
    }
    this.error();
  }

  visit_UnaryOp(node: UnaryOp): string {
    const value = this.visit(node.expr);
    switch (node.op.type) {
    case TokenType.PLUS:
      return `__positive__(${value})`;
    case TokenType.MINUS:
      return `__negative__(${value})`;
    case TokenType.NO:
    case TokenType.NOT:
      return `!(${value})`;
    }
    this.error();
  }

  visit_Program(node: Program): void {
    this.code = this.visit_Block(node.block);
  }

  visit_Console(node: Console): string {
    switch (node.type) {
    case TokenType.LOG:
      return `console.log(${this.visit(node.expr)})`;
    case TokenType.WARN:
      return `console.warn(${this.visit(node.expr)})`;
    case TokenType.ERROR:
      return `console.error(${this.visit(node.expr)})`;
    case TokenType.ASSERT:
      return `console.assert(${this.visit(node.expr)})`;
    }
  }

  visit_Block(node: Block): string[] {
    const output:string[] = [];
    [...node.statement_list, ...node.style_list].forEach(i => {
      const result = this.visit(i);
      if (result !== undefined) output.push(`${result}`);
    });
    return output;
  }

  visit_PropDecl(node: PropDecl): string {
    return `new Property("${node.name}", ${this.visit(node.value) as string})`;
  }

  visit_StyleDecl(node: StyleDecl): string {
    const output:string[] = [];
    // const children = this.visit(node.children);
    const block = node.children;
    output.push(`(() => {\nconst style = new Style("${node.selector}")`);
    block.statement_list.forEach(i => {
      if (!(i instanceof NoOp)) {
        output.push(`${this.visit(i)}`);
      }
    });
    block.style_list.forEach(i => {
      const style = this.visit(i);
      if (style) output.push(`style.add(${style.toString()})`);
    });
    output.push('return style;\n})()');
    return output.join(';\n');
  }

  visit_Assign(node: Assign): string {
    return `let ${node.left.value} = ${this.visit(node.right)}`;
  }

  visit_Update(node: Update): string {
    return `${node.left.value} = ${this.visit(node.right)}`;
  }

  visit_Var(node: Var): string {
    return node.value;
  }

  visit_NoOp(): void {
    return;
  }

  transform(): string {
    this.visit(this.parser.parse());
    return connect(this.code);
  }
}
