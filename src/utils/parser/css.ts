import { Property, Style, StyleSheet, InlineAtRule } from '../style';
import { searchFrom } from '../tools';
import { deepCopy } from '../../utils';
import type { Processor } from '../../lib';

export default class CSSParser {
  css?: string;
  processor?: Processor;
  private _cache: {[key:string]:Style[]} = {};
  constructor(css?: string, processor?: Processor) {
    this.css = css;
    this.processor = processor;
  }

  private _removeComment(css: string) {
    let commentOpen = css.search(/\/\*/);
    let commentClose = css.search(/\*\//);
    while (commentOpen !== -1 && commentClose !== -1) {
      css = css.substring(0, commentOpen) + css.substring(commentClose + 2);
      commentOpen = css.search(/\/\*/);
      commentClose = css.search(/\*\//);
    }
    return css;
  }

  private _searchGroup(text: string, startIndex = 0) {
    let level = 1;
    let endBracket = searchFrom(text, '}', startIndex);
    while (endBracket !== -1) {
      const nextBracket = searchFrom(text, '{', startIndex);
      if (endBracket < nextBracket || nextBracket === -1) {
        level--;
        startIndex = endBracket + 1;
        if (level === 0) return endBracket;
      } else {
        level++;
        startIndex = nextBracket + 1;
      }
      endBracket = searchFrom(text, '}', startIndex);
    }
    return -1;
  }

  private _loadTheme(prop: string): string | undefined {
    if (!this.processor) return;
    let index = 0;
    const output:string[] = [];
    while (index < prop.length) {
      const matched = prop.slice(index,).match(/theme\([^)]*?\)/);
      if (!matched || matched.index === undefined) break;
      output.push(prop.slice(index, index + matched.index));
      const args = matched[0].slice(6, -1).split(/\s*,\s*/).map(i => i.trim().replace(/^['"]+|['"]+$/g, ''));
      output.push(this.processor.theme(args[0], args[1]) as string);
      index += matched.index + matched[0].length;
    }
    output.push(prop.slice(index,));
    return output.join('');
  }

  private _generateStyle(css: string, selector?: string): Style[] | undefined {
    let parsed = Property.parse(css);
    if (!parsed) return;
    if (!Array.isArray(parsed)) parsed = [ parsed ];
    if (!this.processor) return [ new Style(selector, parsed, false) ];
    const style = new Style(selector);
    let atrules: Style[] = [];
    for (const prop of parsed) {
      if (prop instanceof InlineAtRule && prop.name === 'apply' && prop.value) {
        const result = this.processor.compile(prop.value, undefined, false, false, (ignored) => {
          if (('.' + ignored) in this._cache) return this._cache['.' + ignored];
        });

        atrules = atrules.concat(result.styleSheet.children.filter(i => !i.simple).map(i => {
          i.selector = selector;
          i.important = prop.important ?? false;
          return i;
        }));

        style.add(result.styleSheet.children.filter(i => i.simple).map(i => {
          if (prop.important) return i.property.map(i => {
            i.important = true;
            return i;
          });
          return i.property;
        }).reduce((prev, current) => [...prev, ...current], []));
      } else {
        if (!(prop instanceof InlineAtRule) && prop.value?.match(/theme\([^)]*\)/)) prop.value = this._loadTheme(prop.value);
        style.add(prop);
      }
    }
    return style.property[0]? [style, ...atrules]: atrules;
  }

  private _handleDirectives(
    atrule: string
  ): { atrule?: string; variants?: string[][] } | undefined {
    if (!this.processor) return { atrule };
    const iatrule = InlineAtRule.parse(atrule);
    if (!iatrule) return;
    if (['tailwind', 'responsive'].includes(iatrule.name)) return;
    if (iatrule.name === 'variants' && iatrule.value)
      return {
        variants: iatrule.value.split(',').map(i => i.trim().split(':')),
      };
    if (iatrule.name === 'screen' && iatrule.value) {
      const screens = this.processor.resolveVariants('screen');
      if (iatrule.value in screens)
        return { atrule: screens[iatrule.value]().atRules?.[0] };
      if (['dark', 'light'].includes(iatrule.value))
        return { atrule: `@media (prefers-color-scheme: ${iatrule.value})` };
    }
    return { atrule };
  }

  parse(css = this.css): StyleSheet {
    const styleSheet = new StyleSheet();

    if (!css) return styleSheet;
    let index = 0;
    let firstLetter = searchFrom(css, /\S/, index);
    css = this._removeComment(css);

    while (firstLetter !== -1) {
      if (css.charAt(firstLetter) === '@') {
        // atrule
        const ruleEnd = searchFrom(css, ';', firstLetter);
        const nestStart = searchFrom(css, '{', firstLetter);

        if (nestStart === -1 || (ruleEnd !== -1 && ruleEnd < nestStart)) {
          // inline atrule
          let atrule = css.substring(firstLetter, ruleEnd).trim();
          if (this.processor) {
            const directives = this._handleDirectives(atrule);
            if (directives?.atrule) atrule = directives.atrule;
          }
          const parsed = InlineAtRule.parse(atrule);
          if (parsed) styleSheet.add(parsed.toStyle(undefined));
          index = ruleEnd + 1;
        } else {
          // nested atrule
          const nestEnd = this._searchGroup(css, nestStart + 1);
          const atrule = css.substring(firstLetter, nestStart).trim();
          if (this.processor) {
            const directives = this._handleDirectives(atrule);
            if (directives?.atrule) {
              styleSheet.add(
                this.parse(
                  css.substring(nestStart + 1, nestEnd)
                ).children.map((i) => i.atRule(directives.atrule))
              );
            } else if (directives?.variants) {
              const variants = directives.variants;
              const style = this.parse(css.substring(nestStart + 1, nestEnd))
                .children;
              variants
                .map((i) => this.processor?.wrapWithVariants(i, style))
                .forEach((i) => i && styleSheet.add(i));
            }
          } else {
            styleSheet.add(
              this.parse(
                css.substring(nestStart + 1, nestEnd)
              ).children.map((i) => i.atRule(atrule))
            );
          }
          index = nestEnd + 1;
        }
      } else {
        const nestStart = searchFrom(css, '{', firstLetter);
        const nestEnd = this._searchGroup(css, nestStart + 1);
        if (nestStart === -1) {
          // inline properties
          styleSheet.add(this._generateStyle(css, undefined));
          break;
        }
        // nested selector
        const selector = css.substring(firstLetter, nestStart).trim();
        const styles = this._generateStyle(css.substring(nestStart + 1, nestEnd), selector);
        if (styles) {
          if (selector.startsWith('.')) this._cache[selector] = deepCopy(styles);
          styleSheet.add(styles);
        }
        index = nestEnd + 1;
      }
      firstLetter = searchFrom(css, /\S/, index);
    }
    return styleSheet;
  }
}
