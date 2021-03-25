import type { Element } from '../../interfaces';

export default class ClassParser {
  index: number;
  separator: string;
  classNames?: string;

  constructor(classNames?: string, separator = ':') {
    this.classNames = classNames;
    this.separator = separator;
    this.index = 0;
  }

  private _handle_group(removeDuplicated = true): Element[] {
    if (!this.classNames) return [];
    let char;
    let group;
    let func;
    let variant;
    let variants = [];
    let variantStart = this.index + 1;
    let classStart = this.index + 1;
    let groupStart = this.index + 1;
    let ignoreSpace = false;
    let important = false;
    let ignoreBracket = false;
    const parts: Element[] = [];
    const length = this.classNames.length;
    while (this.index < length) {
      this.index++;
      char = this.classNames.charAt(this.index);
      switch (char) {
      case '!':
        important = true;
        break;
      case this.separator:
        variant = this.classNames.slice(variantStart, this.index);
        variants.push(variant.charAt(0) === '!' ? variant.slice(1,): variant);
        variantStart = this.index + 1;
        ignoreSpace = true;
        break;
      case '(':
        if (this.classNames.charAt(this.index - 1) === '-') {
          ignoreBracket = true;
        } else if (ignoreSpace) {
          group = this._handle_group();
        } else {
          func = this.classNames.slice(groupStart, this.index);
          group = this._handle_function();
        }
        ignoreSpace = false;
        break;
      case ')':
      case ' ':
      case '\n':
      case '\t':
      case '\r':
        if (!ignoreSpace) {
          if (groupStart !== this.index) {
            const raw = this.classNames.slice(classStart, this.index);
            const start = classStart - 1;
            const end = this.index - 1;
            if (Array.isArray(group)) {
              parts.push({ raw, start, end, variants, content: group, type: 'group', important });
              group = undefined;
            } else if (func) {
              parts.push({ raw, start, end, variants, func, content: group, type: 'func', important });
              func = undefined;
            } else if (ignoreBracket) {
              // utility with bracket
              const utility = this.classNames.slice(variantStart, this.index + 1);
              parts.push({ raw: raw + ')', start, end: this.index, variants, content: utility.charAt(0) === '!' ? utility.slice(1,): utility, type: 'utility', important });
            } else {
              const utility = this.classNames.slice(variantStart, this.index);
              parts.push({ raw, start, end, variants, content: utility.charAt(0) === '!' ? utility.slice(1,): utility, type: 'utility', important });
            }
            variants = [];
            important = false;
          }
          groupStart = this.index + 1;
          classStart = this.index + 1;
        }
        variantStart = this.index + 1;
        break;
      default:
        ignoreSpace = false;
      }
      if (char === ')') {
        if (!ignoreBracket) break; // end group
        ignoreBracket = false;
      }
    }

    if (removeDuplicated) {
      const newParts: Element[] = [];
      const cache: string[] = [];
      parts.forEach((item) => {
        if (!cache.includes(item.raw)) {
          cache.push(item.raw);
          newParts.push(item);
        }
      });
      return newParts;
    }
    return parts;
  }

  private _handle_function() {
    if (!this.classNames) return;
    const groupStart = this.index + 1;
    while (this.classNames.charAt(this.index) !== ')') {
      this.index++;
    }
    return this.classNames.slice(groupStart, this.index);
  }

  parse(removeDuplicated = true): Element[] {
    if (!this.classNames) return [];
    // Turn classes into group;
    this.classNames = '(' + this.classNames + ')';
    const elements = this._handle_group(removeDuplicated);
    // Initialization, convenient for next call
    this.index = 0;
    this.classNames = this.classNames.slice(1, -1);
    return elements;
  }
}
