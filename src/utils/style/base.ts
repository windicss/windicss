import { wrapit, escape, searchFrom, connectList } from "../tools";

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
    let end = searchFrom(css, ";", index);
    while (end !== -1) {
      const parsed = this._singleParse(
        css.substring(searchFrom(css, /\S/, index), end + 1)
      );
      if (parsed) properties.push(parsed);
      index = end + 1;
      end = searchFrom(css, ";", index);
    }
    const count = properties.length;
    if (count > 1) return properties;
    if (count === 1) return properties[0];
  }

  toStyle(selector?: string, escape = true): Style {
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
  static parse(css: string): InlineAtRule | undefined {
    const matchName = css.match(/@[^\s;{}]+/);
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
  build(): string {
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

  get rule(): string {
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

  get atRules(): string[] | undefined {
    return this._atRules;
  }

  get pseudoClasses(): string[] | undefined {
    return this._pseudoClasses;
  }

  get pseudoElements(): string[] | undefined {
    return this._pseudoElements;
  }

  get parentSelectors(): string[] | undefined {
    return this._parentSelectors;
  }

  get childSelectors(): string[] | undefined {
    return this._childSelectors;
  }

  get brotherSelectors(): string[] | undefined {
    return this._brotherSelectors;
  }

  get wrapSelectors(): ((selector: string) => string)[] | undefined {
    return this._wrapSelectors;
  }

  get wrapRules(): ((selector: string) => string)[] | undefined {
    return this._wrapRules;
  }

  atRule(atrule?: string): this {
    if (!atrule) return this;
    if (this._atRules) {
      this._atRules.push(atrule);
    } else {
      this._atRules = [atrule];
    }
    return this;
  }

  pseudoClass(string: string): this {
    if (this._pseudoClasses) {
      this._pseudoClasses.push(string);
    } else {
      this._pseudoClasses = [string];
    }
    return this;
  }

  pseudoElement(string: string): this {
    if (this._pseudoElements) {
      this._pseudoElements.push(string);
    } else {
      this._pseudoElements = [string];
    }
    return this;
  }

  brother(string: string): this {
    if (this._brotherSelectors) {
      this._brotherSelectors.push(string);
    } else {
      this._brotherSelectors = [string];
    }
    return this;
  }

  parent(string: string): this {
    if (this._parentSelectors) {
      this._parentSelectors.push(string);
    } else {
      this._parentSelectors = [string];
    }
    return this;
  }

  child(string: string): this {
    if (this._childSelectors) {
      this._childSelectors.push(string);
    } else {
      this._childSelectors = [string];
    }
    return this;
  }

  wrapSelector(func: (selector: string) => string): this {
    if (this._wrapSelectors) {
      this._wrapSelectors.push(func);
    } else {
      this._wrapSelectors = [func];
    }
    return this;
  }

  wrapRule(func: (rule: string) => string): this {
    if (this._wrapRules) {
      this._wrapRules.push(func);
    } else {
      this._wrapRules = [func];
    }
    return this;
  }

  add(item: Property | Property[]): this {
    if (Array.isArray(item)) {
      this.property = [...this.property, ...item];
    } else {
      this.property.push(item);
    }
    return this;
  }

  extend(item: Style | undefined, onlyProperty = false, append = true): this {
    if (!item) return this;
    this.property = connectList(this.property, item.property, append);
    if (onlyProperty) return this;
    item.selector && (this.selector = item.selector);
    item._atRules &&
      (this._atRules = connectList(item._atRules, this._atRules, append)); // atrule is build in reverse
    item._brotherSelectors &&
      (this._brotherSelectors = connectList(
        this._brotherSelectors,
        item._brotherSelectors,
        append
      ));
    item._childSelectors &&
      (this._childSelectors = connectList(
        this._childSelectors,
        item._childSelectors,
        append
      ));
    item._parentSelectors &&
      (this._parentSelectors = connectList(
        this._parentSelectors,
        item._parentSelectors,
        append
      ));
    item._pseudoClasses &&
      (this._pseudoClasses = connectList(
        this._pseudoClasses,
        item._pseudoClasses,
        append
      ));
    item._pseudoElements &&
      (this._pseudoElements = connectList(
        this._pseudoElements,
        item._pseudoElements,
        append
      ));
    item._wrapRules &&
      (this._wrapRules = connectList(this._wrapRules, item._wrapRules, append));
    item._wrapSelectors &&
      (this._wrapSelectors = connectList(
        this._wrapSelectors,
        item._wrapSelectors,
        append
      ));
    return this;
  }

  clean(): this {
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

  flat(): this {
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

  sort(): this {
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
  constructor(
    selector?: string,
    property?: Property | Property[],
    escape = true
  ) {
    super(selector, property, escape);
  }
}
