import { wrapit, escape, searchFrom } from "../tools";

export class Property {
  name: string | string[];
  value?: string;
  comment?: string;

  constructor(name: string | string[], value?: string, comment?: string) {
    this.name = name;
    this.value = value;
    this.comment = comment;
  }

  private static _singleParse(
    css: string
  ): Property | InlineAtRule | undefined {
    css = css.trim();
    if (!css) return;
    if (css.charAt(0) === "@") return InlineAtRule.parse(css);
    const split = css.search(":");
    const end = css.search(";");
    if (split === -1) return;
    return new Property(
      css.substring(0, split).trim(),
      css.substring(split + 1, end === -1 ? undefined : end).trim()
    );
  }

  static parse(
    css: string
  ): Property | InlineAtRule | (Property | InlineAtRule)[] | undefined {
    if (!/;\s*$/.test(css)) css += ";"; // Fix for the situation where the last semicolon is omitted
    const properties: (Property | InlineAtRule)[] = [];
    let index = 0;
    while (true) {
      const start = searchFrom(css, /\S/, index);
      const end = searchFrom(css, ";", index);
      if (end === -1) break;
      const parsed = this._singleParse(css.substring(start, end + 1));
      if (parsed) properties.push(parsed);
      index = end + 1;
    }
    const count = properties.length;
    if (count > 1) return properties;
    if (count === 1) return properties[0];
  }

  toStyle(selector?: string, escape = true) {
    return new Style(selector, this, escape);
  }

  build(minify = false): string {
    const createProperty = (name: string, value?: string) => {
      if (minify) {
        return `${name}:${value};`;
      } else {
        const p = `${name}: ${value};`;
        return this.comment ? p + ` /* ${this.comment} */` : p;
      }
    };
    if (!this.value) return "";
    return typeof this.name === "string"
      ? createProperty(this.name, this.value)
      : this.name
          .map((i) => createProperty(i, this.value))
          .join(minify ? "" : "\n");
  }
}

export class InlineAtRule extends Property {
  name: string;
  constructor(name: string, value?: string) {
    super(name, value);
    this.name = name;
  }
  static parse(css: string) {
    const matchName = css.match(/@[^\s;\{\}]+/);
    if (matchName) {
      const name = matchName[0].substring(1);
      const expression =
        matchName.index !== undefined
          ? css
              .substring(matchName.index + name.length + 1)
              .match(/[^;]*/)?.[0]
              .trim()
          : undefined;
      return new InlineAtRule(name, expression === "" ? undefined : expression);
    }
  }
  build() {
    return this.value ? `@${this.name} ${this.value};` : `@${this.name};`;
  }
}

export class Style {
  selector?: string;
  escape: boolean;
  property: Property[];
  private _pseudoClasses?: string[];
  private _pseudoElements?: string[];
  private _parentSelectors?: string[];
  private _childSelectors?: string[];
  private _brotherSelectors?: string[];
  private _wrapSelectors?: ((selector: string) => string)[];
  private _wrapRules?: ((rule: string) => string)[];
  private _atRules?: string[];

  constructor(
    selector?: string,
    property?: Property | Property[],
    escape = true
  ) {
    this.selector = selector;
    this.escape = escape;
    this.property = property
      ? Array.isArray(property)
        ? property
        : [property]
      : [];
  }

  get rule() {
    let result = this.selector
      ? this.escape
        ? escape(this.selector)
        : this.selector
      : "";
    (this._wrapSelectors ?? []).forEach((func) => (result = func(result)));
    this._parentSelectors &&
      (result = `${this._parentSelectors.join(" ")} ${result}`);
    this._pseudoClasses && (result += `:${this._pseudoClasses.join(":")}`);
    this._pseudoElements && (result += `::${this._pseudoElements.join("::")}`);
    this._brotherSelectors &&
      (result += `.${this._brotherSelectors.join(".")}`);
    this._childSelectors && (result += ` ${this._childSelectors.join(" ")}`);
    (this._wrapRules ?? []).forEach((func) => (result = func(result)));
    return result;
  }

  get atRules() {
    return this._atRules;
  }

  get pseudoClasses() {
    return this._pseudoClasses;
  }

  get pseudoElements() {
    return this._pseudoElements;
  }

  get parentSelectors() {
    return this._parentSelectors;
  }

  get childSelectors() {
    return this._childSelectors;
  }

  get brotherSelectors() {
    return this._brotherSelectors;
  }

  get wrapSelectors() {
    return this._wrapSelectors;
  }

  get wrapRules() {
    return this._wrapRules;
  }

  atRule(atrule?: string) {
    if (!atrule) return this;
    if (this._atRules) {
      this._atRules.push(atrule);
    } else {
      this._atRules = [atrule];
    }
    return this;
  }

  pseudoClass(string: string) {
    if (this._pseudoClasses) {
      this._pseudoClasses.push(string);
    } else {
      this._pseudoClasses = [string];
    }
    return this;
  }

  pseudoElement(string: string) {
    if (this._pseudoElements) {
      this._pseudoElements.push(string);
    } else {
      this._pseudoElements = [string];
    }
    return this;
  }

  brother(string: string) {
    if (this._brotherSelectors) {
      this._brotherSelectors.push(string);
    } else {
      this._brotherSelectors = [string];
    }
    return this;
  }

  parent(string: string) {
    if (this._parentSelectors) {
      this._parentSelectors.push(string);
    } else {
      this._parentSelectors = [string];
    }
    return this;
  }

  child(string: string) {
    if (this._childSelectors) {
      this._childSelectors.push(string);
    } else {
      this._childSelectors = [string];
    }
    return this;
  }

  wrapSelector(func: (selector: string) => string) {
    if (this._wrapSelectors) {
      this._wrapSelectors.push(func);
    } else {
      this._wrapSelectors = [func];
    }
    return this;
  }

  wrapRule(func: (rule: string) => string) {
    if (this._wrapRules) {
      this._wrapRules.push(func);
    } else {
      this._wrapRules = [func];
    }
    return this;
  }

  add(item: Property | Property[]) {
    if (Array.isArray(item)) {
      this.property = [...this.property, ...item];
    } else {
      this.property.push(item);
    }
    return this;
  }

  extend(item: Style | undefined, onlyProperty = false, append = true) {
    if (!item) return this;
    const connect = append
      ? (list: any[] = [], anotherList: any[] = []) => [...list, ...anotherList]
      : (list: any[] = [], anotherList: any[] = []) => [
          ...anotherList,
          ...list,
        ];
    this.property = connect(this.property, item.property);
    if (onlyProperty) return this;
    if (item.selector) this.selector = item.selector;
    if (item._atRules) this._atRules = connect(item._atRules, this._atRules); // atrule is build in reverse
    if (item._brotherSelectors)
      this._brotherSelectors = connect(
        this._brotherSelectors,
        item._brotherSelectors
      );
    if (item._childSelectors)
      this._childSelectors = connect(
        this._childSelectors,
        item._childSelectors
      );
    if (item._parentSelectors)
      this._parentSelectors = connect(
        this._parentSelectors,
        item._parentSelectors
      );
    if (item._pseudoClasses)
      this._pseudoClasses = connect(this._pseudoClasses, item._pseudoClasses);
    if (item._pseudoElements)
      this._pseudoElements = connect(
        this._pseudoElements,
        item._pseudoElements
      );
    if (item._wrapRules)
      this._wrapRules = connect(this._wrapRules, item._wrapRules);
    if (item._wrapSelectors)
      this._wrapSelectors = connect(this._wrapSelectors, item._wrapSelectors);
    return this;
  }

  clean() {
    // remove duplicated property
    const property: Property[] = [];
    const cache: string[] = [];
    this.property.forEach((i) => {
      const inline = i.build();
      if (!cache.includes(inline)) {
        cache.push(inline);
        property.push(i);
      }
    });
    this.property = property;
    return this;
  }

  flat() {
    const properties: Property[] = [];
    this.property.forEach((p) => {
      if (Array.isArray(p.name)) {
        p.name.forEach((i) => {
          properties.push(new Property(i, p.value, p.comment));
        });
      } else {
        properties.push(p);
      }
    });
    this.property = properties;
    return this;
  }

  sort() {
    // sort property
    this.property = this.property.sort((a: Property, b: Property) => {
      return `${a.name}`.substring(0, 2) > `${b.name}`.substring(0, 2) ? 1 : -1;
    });
    return this;
  }

  build(minify = false): string {
    let result = this.property
      .map((p) => p.build(minify))
      .join(minify ? "" : "\n");
    if (!this.selector && !this._atRules) return result.replace(/;}/g, "}");
    if (this.selector)
      result =
        (minify ? this.rule.replace(/,\s/g, ",") : this.rule + " ") +
        wrapit(
          result,
          undefined,
          undefined,
          undefined,
          result !== "" ? minify : true
        );
    if (this._atRules) {
      for (const rule of this._atRules) {
        result = minify
          ? `${rule.replace(/\s/g, "")}${wrapit(
              result,
              undefined,
              undefined,
              undefined,
              minify
            )}`
          : `${rule} ${wrapit(
              result,
              undefined,
              undefined,
              undefined,
              result !== "" ? minify : true
            )}`;
      }
    }
    return minify ? result.replace(/;}/g, "}") : result;
  }
}

export class GlobalStyle extends Style {
  constructor(...args: any[]) {
    super(...args);
  }
}
