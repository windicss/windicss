import { apply } from '../src/processor/variants';
import { Property } from '../src/utils/style';

const testVariant = (v: string []) => apply(v, new Property('box-sizing', 'border-box').toStyle('.box-border')).map(i=>i.build(true)).join('\n');

console.log(testVariant(['sm', '@dark', 'hover']));
console.log(testVariant(['+sm', 'dark', 'hover']));
console.log(testVariant(['-sm', 'dark', 'hover']));
console.log(testVariant(['+2xl', 'dark', 'hover']));

console.log(testVariant(['md', 'dark', 'focus']));
console.log(testVariant(['lg', '@light', 'motion-safe', 'focus-within', 'first-line']));
