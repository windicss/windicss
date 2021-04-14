export class Token {
  type: TokenType;
  value?: string | number;

  constructor(type: TokenType, value?: string | number) {
    this.type = type;
    this.value = value;
  }
}

export enum TokenType {
  NUMBER = 'NUMBER',
  PIXEL = 'PIXEL',
  REM = 'REM',
  EM = 'EM',
  SECOND = 'SECOND',
  DEGREE = 'DEGREE',
  PERCENTAGE = 'PERCENTAGE',
  STRING = 'STRING',
  USTRING = 'USTRING',
  COLOR = 'COLOR',
  VAR = 'VAR',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MUL = 'MUL',
  DIV = 'DIV',
  LPAREN = '(',
  RPAREN = ')',
  ASSIGN = 'ASSIGN',
  BEGIN = 'BEGIN',
  END = 'END',
  SEMI = 'SEMI',
  EOF = 'EOF',
}

export const REVERSED_KEYWORDS: {[key:string]:Token} = {
  'BEGIN': new Token(TokenType.BEGIN, 'BEGIN'),
  'END': new Token(TokenType.END, 'END'),
};

export class Num {
  token: Token;
  value: number;
  constructor(token: Token) {
    this.token = token;
    this.value = token.value as number;
  }
}

export class PIXEL extends Num {
}

export class REM extends Num {
}

export class Str {
  token: Token;
  value: string;
  constructor(token: Token) {
    this.token = token;
    this.value = token.value as string;
  }
}

export class UStr extends Str {
}

export class Var {
  token: Token;
  value: string;
  constructor(token: Token) {
    this.token = token;
    this.value = token.value as string;
  }
}

export class UnaryOp {
  op: Token;
  expr: Operand;
  constructor(op: Token, expr: Operand) {
    this.op = op;
    this.expr = expr;
  }
}

export class BinOp {
  left: Operand;
  op: Token;
  right: Operand;
  constructor(left: Operand, op: Token, right: Operand) {
    this.left = left;
    this.op = op;
    this.right = right;
  }
}

export type Operand = Num | Str | Var | BinOp | UnaryOp;
