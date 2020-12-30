import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import packageJson from '../../package.json';


export function walk(dir:string, callback:(item:{type:string, path:string})=>unknown, deep=true) {
  let result:{type:string, path:string}[] = [];
 
  // get the contents of dir
  fs.readdir(dir, (e, items) => {

    // for each item in the contents
    items.forEach((item) => {

      // get the item path
      let itemPath = path.join(dir, item);

      if (fs.lstatSync(itemPath).isFile()) {
        callback({
          type: 'file',
          path: itemPath,
        })
      } else {
        callback({
          type: 'folder',
          path: itemPath,
        });
        if (deep) walk(itemPath, callback);
      };
    });
  });
  return result;
};


export class FilePattern {
  pattern: RegExp;
  constructor(pattern:string) {
    this.pattern = this._transform(pattern);
  }

  match(text:string) {
    return Boolean(text.match(this.pattern));
  }

  private _transform(pattern:string) {
    // if (!pattern.startsWith('^')) pattern = '^' + pattern;
    if (!pattern.endsWith('$')) pattern += '$';
    const backSlash = String.fromCharCode(92);
    const anyText = `[${backSlash}s${backSlash}S]+`;
    pattern = pattern
              .replace(/\*\*\/\*/g, anyText)
              .replace(/\*\*/g, '[^/]+')
              .replace(/\*/g, '[^/]+')
              .replace(/\./g, backSlash+'.')
              .replace(/\//g, backSlash+'/');
    return new RegExp(pattern);
  }
}

export function findFiles(path: string) {
}
//   // process.cwd()
//   const regex = /.*.js$/;
//   const dir = process.cwd();

//   fs.readdir(dir, function (err, files) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log(files);
//     files.forEach(f => {
//       if (isExists(f) && isFolder(f)) {
//         console.log(f);
//         // findFiles(f);
//       }
//     })
//     // console.log(files.filter(i=>i.match(regex)));
//   });
// }

export function getVersion() {
  return `${packageJson.name} ${packageJson.version}`;
}

const pattern = new FilePattern('**/variants/*.js');

walk('../', (item:{type:string, path:string}) => {
  if (item.type === 'file' && pattern.match(item.path)) {
    console.log(item.path);
  }
  // console.log(item);
}, true);
// console.log(isExists('/Users/veritas/Test/svelte-pro/my-svelte-project/*.txt'))

// console.log(fileMatch('./src/**/*.html'));