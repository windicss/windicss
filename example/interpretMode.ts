import fs from 'fs';
import { Processor } from '../src/lib';
import { HTMLParser } from '../src/utils/parser';

const html = fs.readFileSync('../test/assets/example.html').toString();

const parser = new HTMLParser(html); // Simple html parser, only has two methods.
const processor = new Processor();
const preflightSheet = processor.preflight(html); // Parse all html tags, then generate preflight

const result = processor.interpret(
  parser
    .parseClasses()
    .map((i) => i.result)
    .join(' ')
); // Combine all classes into one line to simplify operations
fs.writeFileSync(
  'interpret_test.css',
  result.styleSheet.extend(preflightSheet, false).build(false)
); // Build css, set true to minify build
