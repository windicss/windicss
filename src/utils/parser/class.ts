import type { Element } from "../../interfaces";

export default class ClassParser {
  index: number;
  separator: string;
  classNames?: string;

  constructor(classNames?: string, separator = ":") {
    this.classNames = classNames;
    this.separator = separator;
    this.index = 0;
  }

  private _handle_group(): Element[] {
    if (!this.classNames) return [];
    let char;
    let group;
    let func;
    let variants = [];
    let variantStart = this.index + 1;
    let classStart = this.index + 1;
    let groupStart = this.index + 1;
    let ignoreSpace = false;
    const parts: Element[] = [];
    const length = this.classNames.length;
    while (this.index < length) {
      this.index++;
      char = this.classNames.charAt(this.index);
      switch (char) {
        case this.separator:
          variants.push(this.classNames.slice(variantStart, this.index));
          variantStart = this.index + 1;
          ignoreSpace = true;
          break;
        case "(":
          if (ignoreSpace) {
            group = this._handle_group();
          } else {
            func = this.classNames.slice(groupStart, this.index);
            group = this._handle_function();
          }
          ignoreSpace = false;
          break;
        case ")":
        case " ":
        case "\n":
        case "\t":
        case "\r":
          if (!ignoreSpace) {
            if (groupStart !== this.index) {
              const raw = this.classNames.slice(classStart, this.index);
              if (Array.isArray(group)) {
                parts.push({ raw, variants, content: group, type: "group" });
                group = undefined;
              } else if (func) {
                parts.push({
                  raw,
                  variants,
                  func,
                  content: group,
                  type: "func",
                });
                func = undefined;
              } else {
                parts.push({
                  raw,
                  variants,
                  content: this.classNames.slice(variantStart, this.index),
                  type: "utility",
                });
              }
              variants = [];
            }
            groupStart = this.index + 1;
            classStart = this.index + 1;
          }
          variantStart = this.index + 1;
          break;
        default:
          ignoreSpace = false;
      }
      if (char === ")") {
        break;
      }
    }
    // remove duplicated class
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

  private _handle_function() {
    if (!this.classNames) return;
    const groupStart = this.index + 1;
    while (this.classNames.charAt(this.index) !== ")") {
      this.index++;
    }
    return this.classNames.slice(groupStart, this.index);
  }

  parse(): Element[] {
    if (!this.classNames) return [];
    this.classNames = "(" + this.classNames + ")"; // turn into group;
    return this._handle_group();
  }
}
