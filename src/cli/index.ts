import arg from 'arg';
import { resolve } from 'path';
import { Processor } from '../lib';
import { readFileSync, writeFileSync } from 'fs';
import { HTMLParser } from '../utils/parser';
import { StyleSheet } from '../utils/style';
import {
  getVersion,
  FilePattern,
  walk,
  isFile,
  generateTemplate,
  Console,
} from './utils';

const doc = `
Generate css from text files that containing tailwindcss classes.
By default, it will use interpretation mode to generate a single css file.

Usage:
  windicss [filenames]
  windicss [filenames] -c -m
  windicss [filenames] -c -s -m
  windicss [filenames] [-c | -i] [-b | -s] [-m] [-p <prefix:string>] [-o <path:string>] [--args arguments]

Options:
  -h, --help            Print this help message and exit.
  -v, --version         Print windicss current version and exit.

  -i, --interpret       Interpretation mode, generate class name corresponding to tailwindcss. This is the default behavior.
  -c, --compile         Compilation mode, combine the class name in each row into a single class.
  -t, --preflight       Add preflights, default is false.

  -b, --combine         Combine all css into one single file. This is the default behavior.
  -s, --separate        Generate a separate css file for each input file.

  -m, --minify          Generate minimized css file.
  -p, --prefix PREFIX   Set the css class name prefix, only valid in compilation mode. The default prefix is 'windi-'.
  -o, --output PATH     Set output css file path.
  -f, --config PATH     Set config file path.

  --init PATH           Start a new project on the path.
`;

const args = arg({
  // Types
  '--help': Boolean,
  '--version': Boolean,
  '--compile': Boolean,
  '--interpret': Boolean,
  '--preflight': Boolean,
  '--combine': Boolean,
  '--separate': Boolean,
  '--minify': Boolean,
  '--init': String,
  '--prefix': String,
  '--output': String,
  '--config': String,

  // Aliases
  '-h': '--help',
  '-v': '--version',
  '-i': '--interpret',
  '-c': '--compile',
  '-t': '--preflight',
  '-b': '--combine',
  '-s': '--separate',

  '-m': '--minify',
  '-p': '--prefix',
  '-o': '--output',
  '-f': '--config',
});

if (args['--help'] || (args._.length === 0 && Object.keys(args).length === 1)) {
  Console.log(doc);
  process.exit();
}

if (args['--version']) {
  Console.log(getVersion());
  process.exit();
}

if (args['--init']) {
  const template = generateTemplate(args['--init'], args['--output']);
  args._.push(template.html);
  args['--preflight'] = true;
  args['--output'] = template.css;
}

const localFiles = walk('.', true).filter((i) => i.type === 'file').map(i=> ({ type: i.type, path: i.path.replace(/\\/g, '/') }) );

const matchFiles: string[] = [];
for (const pt of args._) {
  if (isFile(pt) && pt.search(/\.windi\./) === -1) {
    matchFiles.push(pt);
  } else if (pt.search(/\*/) !== -1) {
    // match files like **/*.html **/src/*.html *.html ...
    localFiles.forEach((i) => {
      const pattern = new FilePattern(pt);
      if (pattern.match(i.path) && i.path.search(/\.windi\./) === -1)
        matchFiles.push(i.path);
    });
  } else {
    Console.error(`File ${pt} does not exist!`);
  }
}

let ignoredClasses: string[] = [];
const preflights: StyleSheet[] = [];
const styleSheets: StyleSheet[] = [];
const processor = new Processor(args['--config'] ? require(resolve(args['--config'])) : undefined);

if (args['--compile']) {
  // compilation mode
  const prefix = args['--prefix'] ?? 'windi-';
  matchFiles.forEach((file) => {
    let indexStart = 0;
    const outputStyle: StyleSheet[] = [];
    const outputHTML: string[] = [];
    const html = readFileSync(file).toString();
    const parser = new HTMLParser(html);

    // Match tailwind ClassName then replace with new ClassName
    parser.parseClasses().forEach((p) => {
      outputHTML.push(html.substring(indexStart, p.start));
      const utility = processor.compile(p.result, prefix, true); // Set third argument to false to hide comments;
      outputStyle.push(utility.styleSheet);
      ignoredClasses = [...ignoredClasses, ...utility.ignored];
      outputHTML.push([utility.className, ...utility.ignored].join(' '));
      indexStart = p.end;
    });
    outputHTML.push(html.substring(indexStart));
    styleSheets.push(
      outputStyle.reduce(
        (previousValue: StyleSheet, currentValue: StyleSheet) =>
          previousValue.extend(currentValue),
        new StyleSheet()
      )
    );

    const outputFile = file.replace(/(?=\.\w+$)/, '.windi');
    writeFileSync(outputFile, outputHTML.join(''));
    Console.log(`${file} -> ${outputFile}`);

    if (args['--preflight'])
      preflights.push(processor.preflight(parser.html));
  });
} else {
  // interpretation mode
  matchFiles.forEach((file) => {
    const parser = new HTMLParser(readFileSync(file).toString());
    const utility = processor.interpret(
      parser
        .parseClasses()
        .map((i) => i.result)
        .join(' ')
    );
    styleSheets.push(utility.styleSheet);
    ignoredClasses = [...ignoredClasses, ...utility.ignored];

    if (args['--preflight'])
      preflights.push(processor.preflight(parser.html));
  });
}

if (args['--separate']) {
  styleSheets.forEach((style, index) => {
    const filePath = matchFiles[index].replace(/\.\w+$/, '.windi.css');
    if (args['--preflight']) style = preflights[index].extend(style);
    writeFileSync(filePath, style.build(args['--minify']));
    Console.log(`${matchFiles[index]} -> ${filePath}`);
  });
} else {
  let outputStyle = styleSheets
    .reduce(
      (previousValue: StyleSheet, currentValue: StyleSheet) =>
        previousValue.extend(currentValue),
      new StyleSheet()
    )
    .combine()
    .sort();
  if (args['--preflight'])
    outputStyle = preflights
      .reduce(
        (previousValue: StyleSheet, currentValue: StyleSheet) =>
          previousValue.extend(currentValue),
        new StyleSheet()
      )
      .combine()
      .sort()
      .extend(outputStyle);
  const filePath = args['--output'] ?? 'windi.output.css';
  writeFileSync(filePath, outputStyle.build(args['--minify']));
  Console.log('matched files:', matchFiles);
  Console.log('output file:', filePath);
}

Console.log('ignored classes:', ignoredClasses);
