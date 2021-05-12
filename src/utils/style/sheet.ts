import { hash, deepCopy } from '../tools';
import { Layer } from '../../interfaces';
import { sortMeta } from '../algorithm/sortStyle';
import compileStyleSheet from '../algorithm/compileStyleSheet';
import type { Style } from './base';

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

  extend(styleSheet: StyleSheet | undefined, append = true, dedup = false): this {
    if (styleSheet) {
      let extended = styleSheet.children;
      if (dedup) {
        const hashes = extended.map(i => hash(i.build()));
        extended = extended.filter(i => !hashes.includes(hash(i.build())));
      }
      this.prefixer = styleSheet.prefixer;
      this.children = append? [...this.children, ...extended]: [...extended, ...this.children];
    }
    return this;
  }

  combine(): this {
    const styleMap: { [key: string]: Style } = {};
    this.children.forEach((style, index) => {
      const hashValue = hash(style.atRules + style.rule);
      if (hashValue in styleMap) {
        if (style.atRules?.includes('@font-face')) {
          // keeps multiple @font-face
          styleMap[hashValue + index] = style;
        } else {
          styleMap[hashValue] = styleMap[hashValue].extend(style, true);
        }
      } else {
        styleMap[hashValue] = style;
      }
    });
    this.children = Object.values(styleMap).map((i) => i.clean());
    return this;
  }

  layer(type: Layer): StyleSheet {
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

  sort(): this {
    this.children = this.children.sort(sortMeta);
    return this;
  }

  sortby(compareFn?: ((a: Style, b: Style) => number) | undefined): this {
    this.children = this.children.sort(compareFn);
    return this;
  }

  build(minify = false): string {
    return compileStyleSheet(this.children, minify, this.prefixer);
  }
}
