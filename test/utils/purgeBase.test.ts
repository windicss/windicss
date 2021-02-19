import { purgeBase } from '../../src/utils/algorithm';
import { CSSParser } from '../../src/utils/parser';
import { readFileSync } from 'fs';

const html = readFileSync('./test/assets/example.html').toString();
const preflight = readFileSync('./test/assets/twBaseStyle.css').toString();

describe('purgeBase', () => {
  it('purge', () => {
    const styles = new CSSParser(preflight).parse();
    expect(purgeBase(html, styles).children.map(i => i.selector)).toEqual([
      'p',
      'ul',
      '*,\n::before,\n::after',
      'img',
      'a',
      'code',
      'img,\nsvg',
      'img',
    ]);
  });
});
