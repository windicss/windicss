import arg from 'arg';
import packageJson from '../../package.json';

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
    '--combine': Boolean,
    '--separate': Boolean,
    '--minify': Boolean,
    '--prefix': String,
    '--output': String,
 
    // Aliases
    '-h':        '--help',
    '-v':        '--version',
    '-c':        '--compile',
    '-i':        '--interpret',
    '-b':        '--combine',
    '-s':        '--separate',
    '-m':        '--minify',
    '-p':        '--prefix',
    '-o':        '--output',
});
 
// console.log(args);
if (args["--help"]) {
    console.log(doc);
    process.exit();
}

if (args["--version"]) {
  console.log(`${packageJson.name} ${packageJson.version}`);
  process.exit();
}