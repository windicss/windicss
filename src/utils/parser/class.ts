export default class ClassParser {
  index: number;
  classNames?: string;
  classMap: { [key: string]: { [key: string]: any } };

  constructor(classNames?: string) {
    this.classNames = classNames;
    this.classMap = { "*": [] };
    this.index = 0;
  }

  private _handle_group(): { [key: string]: any }[] {
    if (!this.classNames) return [];
    let char;
    let group;
    let func;
    let variants = [];
    let parts: { [key: string]: any }[] = [];
    let variantStart = this.index + 1;
    let classStart = this.index + 1;
    let groupStart = this.index + 1;
    let ignoreSpace = false;
    while (true) {
      this.index++;
      char = this.classNames.charAt(this.index);
      switch (char) {
        case "|":
          variants.push(this.classNames.slice(variantStart, this.index));
          variantStart = this.index + 1;
          ignoreSpace = true;
          break;
        case ":":
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
    const newParts: { [key: string]: any }[] = [];
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
    let groupStart = this.index + 1;
    while (true) {
      if (this.classNames.charAt(this.index) === ")") {
        break;
      }
      this.index++;
    }
    return this.classNames.slice(groupStart, this.index);
  }

  parse() {
    if (!this.classNames) return [];
    this.classNames = "(" + this.classNames + ")"; // turn into group;
    return this._handle_group();
  }
}
