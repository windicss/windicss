import type jsep from 'jsep';

export type operand = number | string | boolean;
export type unaryCallback = (a: operand) => operand;
export type binaryCallback = (a: operand, b: operand) => operand;

export type AnyExpression = jsep.ArrayExpression
  | jsep.BinaryExpression
  | jsep.MemberExpression
  | jsep.CallExpression
  | jsep.ConditionalExpression
  | jsep.Identifier
  | jsep.Literal
  | jsep.LogicalExpression
  | jsep.ThisExpression
  | jsep.UnaryExpression;
