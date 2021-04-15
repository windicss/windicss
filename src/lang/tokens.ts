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
  TEMPLATE = 'TEMPLATE',
  COLOR = 'COLOR',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MUL = 'MUL',
  DIV = 'DIV',
  DOLLAR = '$',
  DOT = '.',
  LPAREN = '(',
  RPAREN = ')',
  LBRACKET = '{',
  RBRACKET = '}',
  UNKNOWN = 'UNKNOWN',
  ASSIGN = 'ASSIGN',
  SPACE = 'SPACE',
  SEMI = 'SEMI',
  COLON = 'COLON',
  EOF = 'EOF',
  ID = 'ID',
  VAR = '@var',
  APPLY = '@apply',
  MIXIN = '@mixin',
  INCLUDE = '@include',
  FUNC = '@func',
  RETURN = '@return',
  IMPORT = '@import',
  EXPORT = '@export',
  LOAD = '@load',
  IF = '@if',
  ELSE = '@else',
  ELIF = '@elif',
  WHILE = '@while',
  FOR = '@for',
  JS = '@js',
  LOG = '@log',
  WARN = '@warn',
  ERROR = '@error',
}

export const REVERSED_KEYWORDS: {[key:string]:Token} = {
  'apply': new Token(TokenType.APPLY, '@apply'),
  'mixin': new Token(TokenType.MIXIN, '@mixin'),
  'include': new Token(TokenType.INCLUDE, '@include'),
  'func': new Token(TokenType.FUNC, '@func'),
  'return': new Token(TokenType.RETURN, '@return'),
  'var': new Token(TokenType.VAR, '@var'),
  'load': new Token(TokenType.LOAD, '@load'),
  'import': new Token(TokenType.IMPORT, '@import'),
  'export': new Token(TokenType.EXPORT, '@export'),
  'if': new Token(TokenType.IF, '@if'),
  'else': new Token(TokenType.ELSE, '@else'),
  'elif': new Token(TokenType.ELIF, '@elif'),
  'while': new Token(TokenType.WHILE, '@while'),
  'for': new Token(TokenType.FOR, '@for'),
  'js': new Token(TokenType.JS, '@js'),
  'log': new Token(TokenType.LOG, '@log'),
  'warn': new Token(TokenType.WARN, '@warn'),
  'error': new Token(TokenType.ERROR, '@error'),
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

export class Template {
  token: Token;
  value: string;
  constructor(token: Token) {
    this.token = token;
    this.value = token.value as string;
  }
}

export class Var {
  token: Token;
  value: string;
  constructor(token: Token) {
    this.token = token;
    this.value = token.value as string;
  }
}

export class Assign {
  left: Var;
  op: Token;
  right: Operand;
  constructor(left: Var, op: Token, right: Operand) {
    this.left = left;
    this.op = op;
    this.right = right;
  }
}

export class Compound {
  // Represents a 'BEGIN ... END' block
  children: (Assign | Compound | NoOp)[]
  constructor(children: (Assign | Compound | NoOp)[]) {
    this.children = children;
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

export class NoOp {
  // NoOp node is used to represent an empty statement. For example ‘BEGIN END’ is a valid compound statement that has no statements.
}

export type Operand = Num | BinOp | UnaryOp | NoOp;
