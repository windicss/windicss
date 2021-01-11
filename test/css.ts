import { CSSParser, Ast } from '../src/utils/css';
import { wrapit } from '../src/utils/tools';
import { Property, Style, StyleSheet } from '../src/utils/style';
import { compile } from '../src/processor';
import { sortMediaQuery } from '../src/utils/sort';
import { wrap } from 'module';

const css = `
@charset "utf-8";

img,
video {
  max-width: 100%;
  height: auto;
}

.hover\:bg-pink-200:hover {
  background-color: #fed7e2;
}

.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 1rem;
  padding-left: 1rem;
  @apply font-bold lg:bg-green-300 md:text-lg;
  @apply text-gray-900;
}

.dtest {
  @apply font-light;
}

.container {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px; /* this is comment */
  }
}

@media (min-width: 640px) {
  .container {
    min-width: 640px;
  }
}

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 640px) {
  @media (prefers-color-scheme: dark) {
    @keyframes ping {
      0% {
        transform: scale(1);
        opacity: 1;
        @apply font-bold;
      }
      75%, 100% {
        transform: scale(2);
        opacity: 0;
        @apply bg-yellow-300 md:bg-red-500;
      }
    }
  }
}
`

const parser = new CSSParser(css);
const ast = parser.parse();

function logAst(ast:Ast[]):string {
  return ast.map(node => {
    if (node.children) {
      return `${node.data} ${wrapit(logAst(node.children.data))}`;
    } else {
      if (node.type === 'AtRule' && node.data.name === 'apply') {
        return '123';
      }
      return node.raw;
    }
  }).join('\n');
}

function generateStyle(node:Ast, root:Style) {
  const result = compile(node.data.expression);
  result.styleSheet.children.forEach(style=>{
    style.selector = root.selector;
    if (root.atRules) {
      const originAtRules = style.atRules ?? [];
      style.clearAtRules();
      for (let atrule of [...originAtRules, ...root.atRules].reverse()) {
        style.atRule(atrule);
      }
    }
  });
  return result.styleSheet;
}

// function optimize(styleSheet:StyleSheet) {
  // styleSheet.forEach()
// }

function combineObject(a:{[key:string]:any}, b:{[key:string]:any}) {
  const output = {...a};
  for (let [key_of_b, value_of_b] of Object.entries(b)) {
    if (a.hasOwnProperty(key_of_b)) {
      const value_of_a = a[key_of_b];
      if (value_of_a !== value_of_b) {
        if (value_of_b !== null && value_of_b.constructor !== Object) {
          output[key_of_b] = [value_of_a, value_of_b];
        } else if (value_of_a !== null && value_of_a.constructor === Object) {
          output[key_of_b] = combineObject(value_of_a, value_of_b);
        } else {
          output[key_of_b] = [
            value_of_a,
            combineObject(value_of_a, value_of_b)
          ]
        }
      }
    } else {
      output[key_of_b] = value_of_b;
    }
  }
  return output;
}

// function mapStyle(style:Style) {
// }

function deepList(list:string[], value?:any):{} {
  const key = list.pop();
  if (!value) value = {};
  if (!key) return value;
  const dict:{[key:string]:{}} = {}
  dict[key] = value;
  return deepList(list, dict); 
}

function findApply(ast:Ast[], output:StyleSheet, root?:Style, ) {
  const _updateStyle = (node:Ast, root:Style) => {
    if (node.type==='AtRule') return root.atRule(node.data);
    root.selector = node.data;
    return root;
  };
  ast.forEach(node => {
    if (node.children) {
      findApply(node.children.data, output, _updateStyle(node, root ?? new Style()));
    } else if (node.type === 'AtRule' && node.data.name === 'apply') {
      if (root) {
        output.extend(generateStyle(node, root));
      }
    }
  });
}

function buildWrap(obj:{}):string {
  const output = [];
  if (Array.isArray(obj)) {

    obj.forEach(item=>{
      if (item.constructor === Object) {
        output.push(buildWrap(item));
      } else {
        output.push(item.build());
      }
    })
  } else {
    for (let [key, value] of Object.entries(obj)) {
      if (value instanceof Style) {
        output.push(`${key} ${wrapit(value.build())}`);
      } else if (value && typeof value === 'object'){
        output.push(`${key} ${wrapit(buildWrap(value))}`);
      }
    }
  }
  return output.join('\n'); 
}


// const styleSheet = new StyleSheet();
// findApply(ast, styleSheet);
// const styleMap = styleSheet.children
//                 .map(i=>{
//                   const list = [...(i.atRules??[]).sort(sortMediaQuery), i.selector??''];
//                   i.clearAtRules();
//                   i.selector = undefined;
//                   return deepList(list, i);
//                 })
//                 .sort((a: {}, b: {})=>{
//                   const akey = Object.keys(a)[0];
//                   const bkey = Object.keys(b)[0];
//                   return sortMediaQuery(akey, bkey);
//                 })
//                 .reduce((previousValue: {}, currentValue: {})=>combineObject(previousValue, currentValue));


// console.log(buildWrap(styleMap));

console.log(ast.build());
