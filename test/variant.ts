import { Property } from '../src/utils/style';
import Processor from '../src/processor';

const processor = new Processor();
const testVariant = (v: string []) => processor.wrapWithVariants(v, new Property('box-sizing', 'border-box').toStyle('.box-border')).map(i=>i.build(true)).join('\n');

console.log(testVariant(['sm', '@dark', 'hover']));
console.log(testVariant(['+sm', 'dark', 'hover']));
console.log(testVariant(['-sm', 'dark', 'hover']));
console.log(testVariant(['+2xl', 'dark', 'hover']));

console.log(testVariant(['md', 'dark', 'focus']));
console.log(testVariant(['lg', '@light', 'motion-safe', 'focus-within', 'first-line']));
