import type { MemberExpression, Expression, Identifier } from 'jsep';
import type { operand, unaryCallback, binaryCallback, AnyExpression } from './interfaces';

const toNumber = (n: operand) => typeof n === 'number' ? n : typeof n === 'string' ? parseFloat(n): n ? 1 : 0;

const binops: {[key:string]:binaryCallback} = {
  '||': (a, b) => a || b,
  '&&': (a, b) => a && b,

  '==': (a, b) => a === b,
  '!=': (a, b) => a !== b,
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,

  '+': (a, b) => toNumber(a) + toNumber(b),
  '-': (a, b) => toNumber(a) - toNumber(b),
  '*': (a, b) => toNumber(a) * toNumber(b),
  '/': (a, b) => toNumber(a) / toNumber(b),
  '%': (a, b) => toNumber(a) % toNumber(b),
};

const unops: {[key:string]:unaryCallback} = {
  '-': a => -a,
  '+': a => +a,
  '!': a => !a,
};

function evaluateMember(node: MemberExpression, context: Record<string, unknown>) {
  const object = evaluate(node.object, context) as Record<string, unknown>;
  return node.computed ? [object, object[evaluate(node.property, context) as string]] : [object, object[(node.property as Identifier).name]];
}

export function evaluate(_node: Expression, context: Record<string, unknown>):unknown {

  const node = _node as AnyExpression;

  let caller = undefined;
  let fn = undefined;
  let assign = undefined;

  switch (node.type) {

  case 'ArrayExpression':
    return node.elements.map(i => evaluate(i, context));

  case 'BinaryExpression':
    return binops[node.operator](evaluate(node.left, context) as boolean, evaluate(node.right, context) as boolean);

  case 'CallExpression':
    if (node.callee.type === 'MemberExpression') {
      assign = evaluateMember(node.callee as MemberExpression, context);
      caller = assign[0];
      fn = assign[1];
    } else {
      fn = evaluate(node.callee, context);
    }
    if (typeof fn !== 'function') { return undefined; }
    return fn.apply(caller, node.arguments.map(i => evaluate(i, context)));

  case 'ConditionalExpression':
    return evaluate(node.test, context) ? evaluate(node.consequent, context) : evaluate(node.alternate, context);

  case 'Identifier':
    return context[node.name];

  case 'Literal':
    return node.value;

  case 'LogicalExpression':
    if (node.operator === 'or') return evaluate(node.left, context) || evaluate(node.right, context);
    if (node.operator === 'and') return evaluate(node.left, context) && evaluate(node.right, context);
    return binops[node.operator](evaluate(node.left, context) as boolean, evaluate(node.right, context) as boolean);

  case 'MemberExpression':
    return evaluateMember(node, context)[1];

  case 'ThisExpression':
    return context;

  case 'UnaryExpression':
    return unops[node.operator](evaluate(node.argument, context) as operand);

  default:
    return undefined;
  }
}
