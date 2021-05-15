import fs from 'fs';
import { Processor } from '../src/lib';
import { HTMLParser } from '../src/utils/parser';
import { StyleSheet } from '../src/utils/style';

const html = fs.readFileSync('../test/assets/example.html').toString();
const parser = new HTMLParser(html); // Simple html parser, only has two methods.
const processor = new Processor({});
const preflightSheet = processor.preflight(html); // Parse all html tags, then generate preflight
const outputHTML: string[] = [];
const outputCSS: StyleSheet[] = [];

let ignoredClass: string[] = [];
let indexStart = 0;

// Match windi ClassName then replace with new ClassName
parser.parseClasses().forEach((p) => {
  outputHTML.push(html.substring(indexStart, p.start));
  const result = processor.compile(p.result, 'windi-', true); // Set third argument to false to hide comments;
  outputCSS.push(result.styleSheet);
  ignoredClass = [...ignoredClass, ...result.ignored];
  outputHTML.push([result.className, ...result.ignored].join(' '));
  indexStart = p.end;
});
outputHTML.push(html.substring(indexStart));

fs.writeFileSync('compile_test.html', outputHTML.join(''));
fs.writeFileSync(
  'compile_test.css',
  outputCSS
    .reduce(
      (previousValue: StyleSheet, currentValue: StyleSheet) =>
        previousValue.extend(currentValue),
      new StyleSheet()
    ) // Combine all stylesheet
    .extend(preflightSheet, false) // Insert preflight before utilities, set second argument to true to insert after
    .sort()
    .combine()
    .build(false) // Build css, set true to minify build
);
