import arg from 'arg';
import { getVersion, findFiles } from './utils';

const doc = `
Generate css from text files containing tailwindcss class.
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
`

const args = arg({
    // Types
    '--help':    Boolean,
    '--version': Boolean,
    '--compile': Boolean,
    '--interpret': Boolean,
    '--preflight': Boolean,
    '--combine': Boolean,
    '--separate': Boolean,
    '--minify': Boolean,
    '--prefix': String,
    '--output': String,
 
    // Aliases
    '-h':        '--help',
    '-v':        '--version',
    '-i':        '--interpret',
    '-c':        '--compile',
    '-t':        '--preflight',
    '-b':        '--combine',
    '-s':        '--separate',

    '-m':        '--minify',
    '-p':        '--prefix',
    '-o':        '--output',
}, {
  // argv: ["--compile", "--combine"],
  // permissive: true
});
// console.log(args); 

if (args["--help"] || (args._.length === 0 && Object.keys(args).length === 1)) {
  console.log(doc);
  process.exit();
}

if (args["--version"]) {
  console.log(getVersion());
  process.exit();
}

const interpret = args["--interpret"];
const separate = args["--separate"];

// console.log(args);


// if (args["--separate"]) const outputFile = args["--output"] ?? 'windi.output.css';

// console.log(outputFile);

console.log(findFiles(''));
