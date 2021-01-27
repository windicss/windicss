import fs from "fs";
import path from "path";

export function isFile(path: string) {
  return fs.existsSync(path) && fs.lstatSync(path).isFile();
}

export function walk(dir: string, deep = true) {
  let result: { type: string; path: string }[] = [];

  fs.readdirSync(dir).forEach((item) => {
    let itemPath = path.join(dir, item);

    if (fs.lstatSync(itemPath).isFile()) {
      result.push({
        type: "file",
        path: itemPath,
      });
    } else {
      result.push({
        type: "folder",
        path: itemPath,
      });
      if (deep) result = [...result, ...walk(itemPath, deep)];
    }
  });
  return result;
}

export class FilePattern {
  pattern: RegExp;
  constructor(pattern: string) {
    this.pattern = this._transform(pattern);
  }

  match(text: string) {
    return Boolean(text.match(this.pattern));
  }

  private _transform(pattern: string) {
    // if (!pattern.startsWith('^')) pattern = '^' + pattern;
    if (!pattern.endsWith("$")) pattern += "$";
    const backSlash = String.fromCharCode(92);
    const anyText = `[${backSlash}s${backSlash}S]+`;
    pattern = pattern
      .replace(/^\.\//, "")
      .replace(/\*\*\/\*/g, anyText)
      .replace(/\*\*/g, "[^/]+")
      .replace(/\*/g, "[^/]+")
      .replace(/\./g, backSlash + ".")
      .replace(/\//g, backSlash + "/");
    return new RegExp(pattern);
  }
}

export function getVersion() {
  return `__NAME__ __VERSION__`; // replace by rollup
}

export function generateTemplate(
  folder: string,
  outputPath = "windi.output.css"
) {
  if (!(fs.existsSync(folder) && fs.lstatSync(folder).isDirectory())) {
    fs.mkdirSync(folder);
    if (!fs.existsSync(folder))
      throw new Error(`Folder ${folder} creatation failed.`);
  }
  folder = path.resolve(folder);
  const template = `<!DOCTYPE html>
  <html lang="en">

  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${path.basename(folder)}</title>
      <link rel="stylesheet" href="${outputPath}">
  </head>

  <body class="bg-gray-100">
      <div class="container mx-auto flex flex-col justify-center items-center h-screen">
          <div class="lg:flex shadow rounded-lg">
              <div class="bg-blue-500 rounded-t-lg lg:rounded-tr-none lg:rounded-l-lg lg:w-4/12 py-4 h-full flex flex-col justify-center">
                  <div class="text-center tracking-wide">
                      <div class="text-white font-bold text-8xl lg:text-4xl">24</div>
                      <div class="text-white font-normal text-4xl pt-4 lg:pt-0 lg:text-2xl">Sept</div>
                  </div>
              </div>
              <div class="w-full px-1 bg-white py-5 lg:px-2 lg:py-2 tracking-wide">
                  <div class="flex flex-row lg:justify-start justify-center">
                      <div class="text-gray-700 font-light text-sm text-center lg:text-left px-2">
                          1:30 PM
                      </div>
                      <div class="text-gray-700 font-light text-sm text-center lg:text-left px-2">
                          Organiser : IHC
                      </div>
                  </div>
                  <div class="text-gray-700 text-xl pb-1 text-center lg:text-left px-2">
                      International Conference Dubai
                  </div>

                  <div class="text-gray-800 font-light text-sm pt-1 text-center lg:text-left px-2">
                      A-142/1, A-142, Ganesh Nagar, Tilak Nagar, New Delhi, 110018
                  </div>
              </div>
              <div class="flex flex-row items-center w-full lg:w-1/3 bg-white lg:justify-end justify-center px-2 py-4 lg:px-0 rounded-lg">
                  <span class="tracking-wider text-gray-600 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm rounded-lg leading-loose mx-2">
                      Going
                  </span>
              </div>
          </div>
      </div>
  </body>
  </html>`;
  const inputPath = path.join(folder, "index.html");
  outputPath = path.join(folder, outputPath);
  fs.writeFileSync(inputPath, template);
  fs.writeFileSync(outputPath, "");
  return { html: inputPath, css: outputPath };
}
