import jsep from 'jsep';
import type { Expression } from 'jsep';

jsep.addIdentifierChar('-');

export function parse(val: string | Expression): Expression {
  return jsep(val);
}
