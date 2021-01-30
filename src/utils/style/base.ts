import {
  wrapit,
  searchFrom,
  connectList,
  camelToDash,
  deepCopy,
  isTagName,
} from "../tools";

import type { NestObject } from "../../interfaces";

export class Property {
  name: string | string[];
  value?: string;
  comment?: string;
  important: boolean;

  constructor(
    name: string | string[],
    value?: string,
    comment?: string,
    important = false
  ) {
    this.name = name;
    this.value = value;
    this.comment = comment;
    this.important = important;
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
    let important = false;
    let prop = css.substring(split + 1, end === -1 ? undefined : end).trim();
    if (/!important;?$/.test(prop)) {
      important = true;
      prop = prop.replace(/!important/, "").trimRight();
    }
    return new Property(
      css.substring(0, split).trim(),
      prop,
      undefined,
      important
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

  toStyle(selector?: string): Style {
    return new Style(selector, this, this.important);
  }

  build(minify = false): string {
    const createProperty = (name: string, value?: string) => {
      if (minify) {
        return `${name}:${value}${this.important ? "!important" : ""};`;
      } else {
        const p = `${name}: ${value}${this.important ? " !important" : ""};`;
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
  constructor(name: string, value?: string, important = false) {
    super(name, value, undefined, important);
    this.name = name;
  }
  static parse(css: string): InlineAtRule | undefined {
    const matchName = css.match(/@[^\s;{}]+/);
    if (matchName) {
      const name = matchName[0].substring(1);
      let important = false;
      let expression =
        matchName.index !== undefined
          ? css
              .substring(matchName.index + name.length + 1)
              .match(/[^;]*/)?.[0]
              .trim()
          : undefined;
      if (expression && /!important;?$/.test(expression)) {
        important = true;
        expression = expression.replace(/!important/, "").trimRight();
      }
      return new InlineAtRule(
        name,
        expression === "" ? undefined : expression,
        important
      );
    }
  }
  build(): string {
    return this.value
      ? `@${this.name} ${this.value}${this.important ? " !important" : ""};`
      : `@${this.name}${this.important ? " !important" : ""};`;
  }
}

export class Style {
  selector?: string;
  important: boolean;
  property: Property[];
  private _pseudoClasses?: string[];
  private _pseudoElements?: string[];
  private _parentSelectors?: string[];
  private _childSelectors?: string[];
  private _brotherSelectors?: string[];
  private _wrapProperties?: ((property: string) => string)[];
  private _wrapSelectors?: ((selector: string) => string)[];
  private _wrapRules?: ((rule: string) => string)[];
  private _atRules?: string[];

  constructor(
    selector?: string,
    property?: Property | Property[],
    important = false
  ) {
    this.selector = selector;
    this.important = important;
    this.property = property
      ? Array.isArray(property)
        ? property
        : [property]
      : [];
  }

  get rule(): string {
    let result = this.selector ?? "";
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

  get wrapProperties(): ((properties: string) => string)[] | undefined {
    return this._wrapProperties;
  }

  get wrapSelectors(): ((selector: string) => string)[] | undefined {
    return this._wrapSelectors;
  }

  get wrapRules(): ((selector: string) => string)[] | undefined {
    return this._wrapRules;
  }

  static generate(
    parent?: string,
    property?: NestObject,
    root?: Style
  ): Style[] {
    if (!root)
      root = parent?.startsWith("@")
        ? new Style().atRule(parent)
        : new Style(parent);
    let output: Style[] = [];
    for (const [key, value] of Object.entries(property ?? {})) {
      if (typeof value === "string") {
        root.add(new Property(camelToDash(key), value));
      } else {
        const wrap = deepCopy(root);
        wrap.property = [];
        let child: Style | undefined;
        if (key.startsWith("@")) {
          child = wrap.atRule(key, false);
        } else {
          if (wrap.selector === undefined) {
            wrap.selector = key;
            child = wrap;
          } else {
            if (/^[a-z]+$/.test(key) && !isTagName(key)) {
              wrap.wrapProperty((property) => `${key}-${property}`);
              child = wrap;
            } else {
              const _hKey = (selector: string, key: string) =>
                (/&/.test(key) ? key : `& ${key}`).replace("&", selector);
              wrap.wrapSelector((selector) =>
                selector
                  .replace(/\\/g, "")
                  .split(/\s*,\s*/g)
                  .map((s) =>
                    key
                      .split(/\s*,\s*/g)
                      .map((i) => _hKey(s, i))
                      .join(", ")
                  )
                  .join(", ")
              );
              child = wrap;
            }
          }
        }
        output = output.concat(
          Style.generate(key.startsWith("@") ? undefined : key, value, child)
        );
      }
    }
    if (root.property.length > 0) output.unshift(root);
    return output;
  }

  atRule(atrule?: string, append = true): this {
    if (!atrule) return this;
    if (this._atRules) {
      append ? this._atRules.push(atrule) : this._atRules.unshift(atrule);
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

  wrapProperty(func: (property: string) => string): this {
    if (this._wrapProperties) {
      this._wrapProperties.push(func);
    } else {
      this._wrapProperties = [func];
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
    if (item.wrapProperties) {
      const props: Property[] = [];
      item.property.forEach((p) => {
        const pc = new Property(p.name, p.value, p.comment);
        item.wrapProperties?.forEach((wrap) => {
          pc.name = Array.isArray(pc.name)
            ? pc.name.map((i) => wrap(i))
            : wrap(pc.name);
        });
        if (item.important) pc.important = true;
        props.push(pc);
      });
      this.property = connectList(this.property, props, append);
    } else {
      if (item.important) item.property.forEach((i) => (i.important = true));
      this.property = connectList(this.property, item.property, append);
    }
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
      .map((p) => {
        if (this._wrapProperties) {
          let name = p.name;
          this._wrapProperties.forEach(
            (w) =>
              (name = Array.isArray(name) ? name.map((n) => w(n)) : w(name))
          );
          return new Property(
            name,
            p.value,
            p.comment,
            this.important ? true : p.important
          ).build(minify);
        }
        return this.important
          ? new Property(p.name, p.value, p.comment, true).build(minify)
          : p.build(minify);
      })
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
    important?: boolean
  ) {
    super(selector, property, important);
  }
}
