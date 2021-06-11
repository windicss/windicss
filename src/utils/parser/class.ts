import type { Element } from '../../interfaces';
import { isSpace } from '../../utils/tools';

export default class ClassParser {
  index: number;
  separator: string;
  variants: string[];
  classNames?: string;

  constructor(classNames?: string, separator = ':', variants?: string[]) {
    this.classNames = classNames;
    this.separator = separator;
    this.variants = variants || [];
    this.index = 0;
  }

  private _handle_group(removeDuplicated = true): Element[] {
    if (!this.classNames) return [];
    let preChar;
    let char;
    let group;
    let func;
    let variant;
    let variants = [];
    let variantStart = this.index + 1;
    let classStart = this.index + 1;
    let groupStart = this.index + 1;
    let important = false;
    let ignoreSpace = false;
    let ignoreBracket = false;
    let insideSquareBracket = false;
    const sepLength = this.separator.length;
    const parts: Element[] = [];
    const length = this.classNames.length;

    while (this.index < length) {
      this.index++;
      char = this.classNames.charAt(this.index);
      // ignore parsing and leave content inside square brackets as-is
      if (insideSquareBracket) {
        if(' \n\t\r'.includes(char)) {
          insideSquareBracket = false;
        } else {
          if (char === ']')
            insideSquareBracket = false;
          continue;
        }
      }
      // handle chars
      switch (char) {
      case '!':
        important = true;
        break;
      case this.separator[0]:
        if (this.classNames.slice(this.index, this.index + sepLength) === this.separator) {
          variant = this.classNames.slice(variantStart, this.index);
          if (variant.charAt(0) === '!') variant = variant.slice(1,);
          if (this.variants.includes(variant)) {
            variants.push(variant);
            this.index += sepLength - 1;
            variantStart = this.index + 1;
            ignoreSpace = true;
          }
        }
        break;
      case '[':
        insideSquareBracket = true;
        break;
      case '(':
        preChar = this.classNames.charAt(this.index - 1);
        if (preChar === '-' || (!ignoreSpace && preChar === ' ')) {
          ignoreBracket = true;
        } else if (ignoreSpace) {
          group = this._handle_group();
        } else {
          func = this.classNames.slice(groupStart, this.index);
          while (!isSpace(this.classNames.charAt(this.index))) {
            this.index++;
          }
          this.index--;
        }
        ignoreSpace = false;
        break;
      case '"':
      case '`':
      case '\'':
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
              const utility = this.classNames.slice(variantStart, this.index);
              parts.push({ raw: raw, start, end, variants, content: utility, type: 'utility', important });
              func = undefined;
            } else if (ignoreBracket && char === ')') {
              // utility with bracket
              const utility = this.classNames.slice(variantStart, this.index + 1);
              parts.push({ raw: raw + ')', start, end: this.index, variants, content: important ? utility.slice(1,): utility, type: 'utility', important });
            } else {
              const utility = this.classNames.slice(variantStart, this.index);
              if (utility.charAt(0) === '*') {
                parts.push({ raw, start, end, variants, content: utility.slice(1,), type: 'alias', important });
              } else {
                parts.push({ raw, start, end, variants, content: utility.charAt(0) === '!' ? utility.slice(1,): utility, type: 'utility', important });
              }
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
