import Processor from '../src/processor';

const processor = new Processor('./tailwind.config.js');

// console.log(processor.config('theme.screens'));

// console.log(processor.config('theme.spacing'));

// console.log(processor.config('theme.borderRadius'));

// console.log(processor.theme('screens'));

// console.log(processor.theme('spacing'));

// console.log(processor.theme('borderRadius'));

// const processor2 = new Processor({theme: { 'spacing': { '144': '36rem' } }});

// console.log(processor2.theme('spacing'));

// console.log(processor2.theme('screens'));

console.log(processor.theme('maxWidth'));

console.log(processor.theme('space'));

console.log(processor.variants('zIndex'));



