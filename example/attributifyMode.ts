import fs from 'fs';
import { Processor } from '../src/lib';
import { HTMLParser } from '../src/utils/parser';

const html = fs.readFileSync('../test/assets/example2.html').toString();

const parser = new HTMLParser(html); // Simple html parser, only has two methods.
const processor = new Processor();
const preflightSheet = processor.preflight(html); // Parse all html tags, then generate preflight

const attrs: { [key: string]: string | string[] } = parser
  .parseAttrs()
  .reduceRight((a: { [key: string]: string | string[] }, b) => {
    if (b.key in a) {
      a[b.key] = Array.isArray(a[b.key])
        ? Array.isArray(b.value)? [ ...a[b.key], ...b.value ]: [ ...a[b.key], b.value ]
        : [ a[b.key] as string, ...(Array.isArray(b.value) ? b.value : [b.value]) ];
      return a;
    }
    return Object.assign(a, { [b.key]: b.value });
  }, {});

const result = processor.attributify(attrs);
fs.writeFileSync('attributify_test.css', result.styleSheet.extend(preflightSheet, false).build(false)); // Build css, set true to minify build
