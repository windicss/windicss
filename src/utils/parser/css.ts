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

  private _generateStyle(css: string, selector?: string) {
    let parsed = Property.parse(css);
    if (!parsed) return;
    if (!Array.isArray(parsed)) parsed = [parsed];
    const properties: Property[] = parsed.filter(
      (i) => !(i instanceof InlineAtRule)
    );
    const applies = parsed.filter((i) => i instanceof InlineAtRule && i.name === 'apply' && i.value);
    if (this.processor && applies.length > 0) {

      const notImportant = this.processor.compile(applies.filter(i => !i.important).map(i => i.value).join(' '), undefined, false, false, (ignored) => {
        if (('.' + ignored) in this._cache) return this._cache['.' + ignored];
      });
      notImportant.ignored.map(i => '.' + i).filter(i => i in this._cache).map(i => notImportant.styleSheet.add(this._cache[i]));
      notImportant.styleSheet.children.forEach((style) => {
        style.selector = selector;
      });

      const important = this.processor.compile(applies.filter(i => i.important).map(i => i.value).join(' '), undefined, false, false, (ignored) => {
        if (('.' + ignored) in this._cache) return this._cache['.' + ignored];
      });
      important.ignored.map(i => '.' + i).filter(i => i in this._cache).map(i => important.styleSheet.add(this._cache[i]));
      important.styleSheet.children.forEach((style) => {
        style.selector = selector;
        style.important = true;
      });

      return properties.length > 0
        ? [new Style(selector, properties, false), ...notImportant.styleSheet.extend(important.styleSheet).children]
        : notImportant.styleSheet.extend(important.styleSheet).children;
    }
    return [ new Style(selector, this.processor ? properties : parsed, false) ];
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
        variants: iatrule.value.split(',').map((i) => i.trim().split(':')),
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
        const styles = this._generateStyle(
          css.substring(nestStart + 1, nestEnd),
          css.substring(firstLetter, nestStart).trim()
        );
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
