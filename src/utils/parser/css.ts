import { Property, Style, StyleSheet, InlineAtRule, Keyframes } from '../style';
import { isSpace, searchFrom, searchPropEnd, deepCopy } from '../tools';
import { layerOrder } from '../../config/order';
import type { Processor } from '../../lib';

export default class CSSParser {
  css?: string;
  processor?: Processor;
  private _cache: {[key:string]:Style[]} = {};
  constructor(css?: string, processor?: Processor) {
    this.css = css;
    this.processor = processor;
  }

  private _addCache(style: Style) {
    const rule = style.rule;
    if (['.', '#'].includes(rule.charAt(0))) this._cache[rule] = (rule in this._cache) ? [...this._cache[rule], deepCopy(style)] : [ deepCopy(style) ];
  }

  private _removeComment(css: string | undefined) {
    if (!css) return css;
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

  private _loadTheme(prop?: string): string | undefined {
    if (!prop) return;
    if (!this.processor) return prop;
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

  private _handleDirectives(atrule: string): { atrule: string } | { variants: string[][] } | { apply?: string, important?: boolean } | { layer: 'components' | 'utilities' | 'base' } | undefined {
    if (!this.processor) return { atrule };
    const iatrule = InlineAtRule.parse(atrule);
    if (!iatrule) return;
    if (iatrule.name === 'apply') return { apply: iatrule.value, important: iatrule.important };
    if (iatrule.name === 'layer') return { layer: (iatrule.value ?? 'components') as 'components' | 'utilities' | 'base' };
    if (iatrule.name === 'variants' && iatrule.value)
      return { variants: iatrule.value.split(',').map(i => i.trim().split(':')) };
    if (iatrule.name === 'screen' && iatrule.value) {
      const screens = this.processor.resolveVariants('screen');
      if (iatrule.value in screens) return { atrule: screens[iatrule.value]().atRules?.[0] ?? atrule };
      if (['dark', 'light'].includes(iatrule.value)) return { atrule: `@media (prefers-color-scheme: ${iatrule.value})` };
    }
    return { atrule };
  }

  private _generateNestProperty(props: Property | InlineAtRule | (Property | InlineAtRule)[], parent?: string, parentType?:('atRule' | 'selector')): Style {
    const style = new Style(undefined, props);
    if (!parent || !parentType) return style;
    if (parentType === 'selector') {
      style.selector = parent;
      return style;
    }
    return style.atRule(parent);
  }

  private _generateNestStyle(styles: Style[], parent?: string, parentType?:('atRule' | 'selector')): Style[] {
    let layer: 'components' | 'utilities' | 'base' = 'components';
    let order = layerOrder['components'];
    if (!parent) return styles;
    if (parentType === 'selector') {
      styles.forEach(i => {
        if (i instanceof Keyframes) return;
        if (!i.selector) {
          i.selector = parent;
        } else {
          let selector = i.selector;
          if (!/&/.test(selector)) selector = /\s*,\s*/.test(selector) ? selector.trim().split(/\s*,\s*/g).map(i => `& ${i}`).join(', ') : `& ${selector}`;
          i.selector = /\s*,\s*/.test(parent) ? parent.trim().split(/\s*,\s*/g).map(i => selector.replace(/&/g, i)).join(', ') : selector.replace(/&/g, parent);
        }
        i.updateMeta({ type: layer, corePlugin: false, group: 'block', order });
        this._addCache(i);
      });
    } else if (parentType === 'atRule') {
      let atrule: string | undefined = parent;
      if (this.processor) {
        // handle directives
        const directives = this._handleDirectives(parent);
        if (directives) {
          if ('atrule' in directives) {
            // @screen
            atrule = directives.atrule;
          } else if ('layer' in directives) {
            // @layer
            atrule = undefined;
            layer = directives.layer;
            order = layerOrder[layer];
          } else if ('variants' in directives) {
            // @variants
            let output: Style[] = [];
            for (const variant of directives.variants) {
              const wrapper = this.processor.wrapWithVariants(variant, styles);
              if (wrapper) output = output.concat(wrapper);
            }
            output.map(i => {
              i.updateMeta({ type: layer, corePlugin: false, group: 'block', order });
              this._addCache(i);
            });
            return output;
          }
        }
      }
      styles.filter(i => !(i instanceof Keyframes)).forEach(i => {
        i.atRule(atrule);
        i.updateMeta({ type: layer, corePlugin: false, group: 'block', order });
        this._addCache(i);
      });
    }
    return styles;
  }

  parse(css = this.css, parent?:string, parentType?:('atRule' | 'selector')): StyleSheet {
    const styleSheet = new StyleSheet();
    css = this._removeComment(css);
    if (!css || isSpace(css)) return styleSheet;
    let index = 0;
    let firstLetter = searchFrom(css, /\S/, index);

    while (firstLetter !== -1) {
      const propEnd = searchPropEnd(css, index);
      const nestStart = searchFrom(css, '{', firstLetter);

      if (propEnd === -1 || (nestStart !== -1 && propEnd > nestStart)) {
        // nested AtRule or Selector
        const selector = css.substring(firstLetter, nestStart).trim();
        index = nestStart + 1;
        const nestEnd = this._searchGroup(css, index);
        if (nestEnd === -1) break; // doesn't close block

        // allow last rule without semicolon
        let rule = css.slice(index, nestEnd);
        if (!/[};]\s*/.test(rule)) rule = rule + ';';
        const content = this.parse(rule, selector);

        index = nestEnd + 1;
        styleSheet.add(this._generateNestStyle(content.children, selector, css.charAt(firstLetter) === '@' ? 'atRule': 'selector'));

      } else if (css.charAt(firstLetter) === '@') {
        // inline AtRule
        const data = css.slice(firstLetter, propEnd);
        if (this.processor) {
          // handle directives
          const directives = this._handleDirectives(data.trim());
          if (directives) {
            if ('atrule' in directives) {
              const atRule = InlineAtRule.parse(directives.atrule);
              if (atRule) styleSheet.add(this._generateNestProperty(atRule, parent, parentType));
            } else if ('apply' in directives && directives.apply) {
              const result = this.processor.compile(directives.apply, undefined, false, false, (ignored) => {
                if (('.' + ignored) in this._cache) return this._cache['.' + ignored];
              });

              styleSheet.add(result.styleSheet.children.map(i => {
                if (!(i instanceof Keyframes)) {
                  i.selector = undefined;
                  i.important = directives.important ?? false;
                }
                return i;
              }));
            }
          }
        } else {
          // normal atrule
          const atRule = InlineAtRule.parse(data);
          if (atRule) styleSheet.add(this._generateNestProperty(atRule, parent, parentType));
        }
        index = propEnd + 1;

      } else {
        // inline Property
        const prop = Property.parse(css.slice(firstLetter, propEnd));
        index = propEnd + 1;
        if (prop) {
          // handle theme function
          if (Array.isArray(prop)) {
            prop.filter(p => p.value?.match(/theme\([^)]*\)/)).forEach(p => p.value = this._loadTheme(p.value));
          } else if (prop.value?.match(/theme\([^)]*\)/)) {
            prop.value = this._loadTheme(prop.value);
          }
          styleSheet.add(this._generateNestProperty(prop, parent, parentType));
        }
      }

      firstLetter = searchFrom(css, /\S/, index);
    }
    if (!parent) this._cache = {};
    return styleSheet.combine();
  }
}
