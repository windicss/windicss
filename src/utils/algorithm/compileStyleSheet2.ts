import { Style } from '../style/base';
import { wrapit, deepCopy } from '../../utils/tools';

function _buildAtrule(atrule:string, children: Style[], minify = false, prefixer = true) {
  return `${ atrule }${ minify ? '' : ' ' }${ wrapit(_buildStyleList(children, minify, prefixer), undefined, undefined, undefined, minify) }`;
}

function _buildStyleList(styleList: Style[], minify = false, prefixer = true): string {
  let currentAtrule: string | undefined;
  let currentStyle: Style | undefined;
  let styleStack: Style[] = [];
  const output: string[] = [];
  for (const style of styleList) {
    if (style.isAtrule) {
      if (currentStyle) {
        output.push(currentStyle.clean().build(minify, prefixer));
        currentStyle = undefined;
      }
      const newAtrule = (style.atRules as string[]).pop();
      if (currentAtrule) {
        if (currentAtrule === newAtrule && newAtrule !== '@font-face') { // @font-face shouldn't been combined
          styleStack.push(style);
        } else {
          output.push(_buildAtrule(currentAtrule, styleStack, minify, prefixer));
          currentAtrule = newAtrule;
          styleStack = [ style ];
        }
      } else {
        currentAtrule = newAtrule;
        styleStack = [ style ];
      }
    } else {
      if (currentAtrule) {
        output.push(_buildAtrule(currentAtrule, styleStack, minify, prefixer));
        currentAtrule = undefined;
        styleStack = [];
      }
      if (currentStyle) {
        if (style.rule === currentStyle.rule) {
          if (style.important) style.property.forEach(p => p.important = true);
          if (style.wrapProperties) style.property.forEach(p => style.wrapProperties?.forEach(wrap => p.name = Array.isArray(p.name) ? p.name.map(i => wrap(i)) : wrap(p.name)));
          currentStyle.add(style.property);
        } else {
          output.push(currentStyle.clean().build(minify, prefixer));
          currentStyle = style;
        }
      } else {
        currentStyle = style;
      }
    }
  }
  if (currentAtrule) output.push(_buildAtrule(currentAtrule, styleStack, minify, prefixer));
  if (currentStyle) output.push(currentStyle.clean().build(minify, prefixer));
  return output.join(minify ? '' : '\n');
}

export default function (styleList: Style[], minify = false, prefixer = true): string {
  return _buildStyleList(deepCopy(styleList), minify, prefixer);
}
