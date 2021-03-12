import type { Style } from './base';
import { hash, deepCopy } from '../tools';
import sortSelector from '../algorithm/sortSelector';
import compileStyleSheet from '../algorithm/compileStyleSheet';

export class StyleSheet {
  children: Style[];
  prefixer = true;

  constructor(children?: Style[]) {
    this.children = children || [];
  }

  add(item?: Style | Style[]): this {
    if (!item) return this;
    if (Array.isArray(item)) {
      this.children = [...this.children, ...item];
    } else {
      this.children.push(item);
    }
    return this;
  }

  extend(styleSheet: StyleSheet | undefined, append = true): this {
    if (styleSheet)
      this.children = append
        ? [...this.children, ...styleSheet.children]
        : [...styleSheet.children, ...this.children];
    return this;
  }

  combine(): this {
    const styleMap: { [key: string]: Style } = {};
    this.children.forEach((v) => {
      const hashValue = hash(v.atRules + v.rule);
      if (hashValue in styleMap) {
        styleMap[hashValue] = styleMap[hashValue].extend(v, true);
      } else {
        styleMap[hashValue] = v;
      }
    });
    this.children = Object.values(styleMap).map((i) => i.clean()); //.sort());
    return this;
  }

  layer(type : 'base' | 'components' | 'utilities'): StyleSheet {
    const styleSheet = new StyleSheet(this.children.filter(i => i.meta.type === type));
    styleSheet.prefixer = this.prefixer;
    return styleSheet;
  }

  split(): { base: StyleSheet, components: StyleSheet, utilities: StyleSheet } {
    return {
      base: this.layer('base'),
      components: this.layer('components'),
      utilities: this.layer('utilities'),
    };
  }

  clone(): StyleSheet {
    return deepCopy(this);
  }

  sort(meta = false): this {
    this.children = meta ? this.children.sort((a, b) => {
      return a.meta.order - b.meta.order;
    }) : this.children.sort(sortSelector);
    return this;
  }

  build(minify = false): string {
    return compileStyleSheet(this.children, minify, this.prefixer);
  }
}
