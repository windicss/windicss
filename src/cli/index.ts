import arg from 'arg';
import chokidar from 'chokidar';
import { deepCopy } from '../utils/tools';
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

const doc = `Generate css from text files that containing windi classes.
By default, it will use interpretation mode to generate a single css file.

Usage:
  windicss [filenames]
  windicss [filenames] -c -m -w
  windicss [filenames] -c -s -m -w
  windicss [filenames] [-c | -i] [-a] [-b | -s] [-m] [-w] [-p <prefix:string>] [-o <path:string>] [--args arguments]

Options:
  -h, --help            Print this help message and exit.
  -v, --version         Print windicss current version and exit.

  -i, --interpret       Interpretation mode, generate class selectors. This is the default behavior.
  -c, --compile         Compilation mode, combine the class name in each row into a single class.
  -a, --attributify     Attributify mode, generate attribute selectors. Attributify mode can be mixed with the other two modes.
  -t, --preflight       Add preflights, default is false.

  -b, --combine         Combine all css into one single file. This is the default behavior.
  -s, --separate        Generate a separate css file for each input file.

  -m, --minify          Generate minimized css file.
  -w, --watch           Enable watch mode.
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
  '--attributify': Boolean,
  '--preflight': Boolean,
  '--combine': Boolean,
  '--separate': Boolean,
  '--watch': Boolean,
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
  '-a': '--attributify',
  '-t': '--preflight',
  '-b': '--combine',
  '-s': '--separate',
  '-w': '--watch',
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

const localFiles = walk('.', true).filter((i) => i.type === 'file').map(i => ({ type: i.type, path: i.path.replace(/\\/g, '/') }) );

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
let ignoredAttrs: string[] = [];
const preflights: { [key:string]: StyleSheet } = {};
const styleSheets: { [key:string]: StyleSheet } = {};
const processor = new Processor(args['--config'] ? require(resolve(args['--config'])) : undefined);

function compile(files: string[]) {
  // compilation mode
  const prefix = args['--prefix'] ?? 'windi-';
  files.forEach((file) => {
    let indexStart = 0;
    const outputStyle: StyleSheet[] = [];
    const outputHTML: string[] = [];
    const html = readFileSync(file).toString();
    const parser = new HTMLParser(html);

    // Match ClassName then replace with new ClassName
    parser.parseClasses().forEach((p) => {
      outputHTML.push(html.substring(indexStart, p.start));
      const utility = processor.compile(p.result, prefix, true); // Set third argument to false to hide comments;
      outputStyle.push(utility.styleSheet);
      ignoredClasses = [...ignoredClasses, ...utility.ignored];
      outputHTML.push([utility.className, ...utility.ignored].join(' '));
      indexStart = p.end;
    });
    outputHTML.push(html.substring(indexStart));
    styleSheets[file] = (
      outputStyle.reduce(
        (previousValue: StyleSheet, currentValue: StyleSheet) =>
          previousValue.extend(currentValue),
        new StyleSheet()
      )
    );

    const outputFile = file.replace(/(?=\.\w+$)/, '.windi');
    writeFileSync(outputFile, outputHTML.join(''));
    Console.log(`${file} -> ${outputFile}`);
    if (args['--preflight']) preflights[file] = processor.preflight(parser.html);
  });
}

function interpret(files: string[]) {
  // interpretation mode
  files.forEach((file) => {
    const parser = new HTMLParser(readFileSync(file).toString());
    const utility = processor.interpret(
      parser
        .parseClasses()
        .map((i) => i.result)
        .join(' ')
    );
    styleSheets[file] = utility.styleSheet;
    ignoredClasses = [...ignoredClasses, ...utility.ignored];

    if (args['--preflight']) preflights[file] = processor.preflight(parser.html);
  });
}

function attributify(files: string[]) {
  // attributify mode
  files.forEach((file) => {
    const parser = new HTMLParser(readFileSync(file).toString());
    const attrs: { [key: string]: string | string[] } = parser
      .parseAttrs()
      .reduceRight((a: { [key: string]: string | string[] }, b) => {
        if (b.key === 'class' || b.key === 'className') return a;
        if (b.key in a) {
          a[b.key] = Array.isArray(a[b.key])
            ? Array.isArray(b.value)? [ ...(a[b.key] as string[]), ...b.value ]: [ ...(a[b.key] as string[]), b.value ]
            : [ a[b.key] as string, ...(Array.isArray(b.value) ? b.value : [b.value]) ];
          return a;
        }
        return Object.assign(a, { [b.key]: b.value });
      }, {});
    const utility = processor.attributify(attrs);
    styleSheets[file] = utility.styleSheet;
    ignoredAttrs = [...ignoredAttrs, ...utility.ignored];
  });
}

function build(files: string[], update = false) {
  if (args['--compile']) {
    compile(files);
  } else {
    interpret(files);
  }
  if (args['--attributify']) {
    attributify(files);
  }
  if (args['--separate']) {
    for (const [file, sheet] of Object.entries(styleSheets)) {
      const outfile = file.replace(/\.\w+$/, '.windi.css');
      writeFileSync(outfile, (args['--preflight'] ? deepCopy(sheet).extend(preflights[file], false) : sheet).build(args['--minify']));
      Console.log(`${file} -> ${outfile}`);
    }
  } else {
    let outputStyle = Object.values(styleSheets)
      .reduce(
        (previousValue: StyleSheet, currentValue: StyleSheet) =>
          previousValue.extend(currentValue),
        new StyleSheet()
      )
      .sort()
      .combine();
    if (args['--preflight'])
      outputStyle = Object.values(preflights)
        .reduce(
          (previousValue: StyleSheet, currentValue: StyleSheet) =>
            previousValue.extend(currentValue),
          new StyleSheet()
        )
        .sort()
        .combine()
        .extend(outputStyle);
    const filePath = args['--output'] ?? 'windi.css';
    writeFileSync(filePath, outputStyle.build(args['--minify']));
    if (!update) {
      Console.log('matched files:', matchFiles);
      Console.log('output file:', filePath);
    }
  }
  if (!update) {
    Console.log('ignored classes:', ignoredClasses);
    if (args['--attributify']) Console.log('ignored attrs:', ignoredAttrs.slice(0, 5), `... ${ignoredAttrs.length-5} more items`);
  }
}

build(matchFiles);

if (args['--watch']) {
  const watcher = chokidar.watch(matchFiles);
  watcher.on('change', (path) => {
    Console.log('File', path, 'has been changed');
    Console.time('Building');
    build([path], true);
    Console.timeEnd('Building');
  });
}
