import { Property, Style, StyleSheet } from '../src/utils/style';

const p = new Property('font-size', '1px');

const p2 = new Property(['color', 'background-color'], 'red');

console.log(p.build());
console.log(p2.build());

const s = new Style('.test', [p, p2]).pseudoClass('hover').pseudoElement('first-line');
const s2 = new Style('.test2', [p, p2]).pseudoClass('hover').pseudoClass('focus').pseudoElement('first-line');
const s3 = new Style('.test2', [p, p2]).pseudoClass('hover').pseudoClass('focus').pseudoElement('first-line').atRule('@media (min-width: 768px)');
const s4 = new Style('.test2', [p, p2]).pseudoClass('hover').pseudoClass('focus').pseudoElement('first-line').atRule('@media (prefers-color-scheme: dark)').atRule('@media (min-width: 768px)');
const s5 = new Style('.test3', [p, p2]).pseudoClass('hover').pseudoClass('focus').pseudoElement('first-line').atRule('@media (min-width: 1024px)');

const st = new StyleSheet([s2, s3, s4, s5]);

console.log(st.build());
console.log(s2.build());
console.log(s3.build());
console.log(s4.build());


