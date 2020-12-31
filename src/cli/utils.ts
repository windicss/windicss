import fs from 'fs';
import path from 'path';
import packageJson from '../../package.json';


export function isFile(path:string) {
  return fs.existsSync(path) && fs.lstatSync(path).isFile();
}


export function walk(dir:string, deep=true) {
  let result:{type:string, path:string}[] = [];
 
  fs.readdirSync(dir).forEach(item=>{
    let itemPath = path.join(dir, item);

      if (fs.lstatSync(itemPath).isFile()) {
        result.push({
          type: 'file',
          path: itemPath,
        })
      } else {
        result.push({
          type: 'folder',
          path: itemPath,
        });
        if (deep) result = [...result, ...walk(itemPath, deep)];
      };
  })
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
              .replace(/^\.\//, '')
              .replace(/\*\*\/\*/g, anyText)
              .replace(/\*\*/g, '[^/]+')
              .replace(/\*/g, '[^/]+')
              .replace(/\./g, backSlash+'.')
              .replace(/\//g, backSlash+'/');
    return new RegExp(pattern);
  }
}


export function getVersion() {
  return `${packageJson.name} ${packageJson.version}`;
}