import { defaultColors } from '../../config/base';
import { Property, Style } from '../../utils/style';
import { toColor } from '../../utils/color';
import { cssEscape } from '../../utils/algorithm';
import {
  isNumber,
  isFraction,
  isSize,
  roundUp,
  fracToPercent,
  hex2RGB,
  negateValue,
  flatColors,
} from '../../utils/tools';
import type { colorCallback, colorObject } from 'src/interfaces';



class Handler {
  private _amount: string;
  utility: Utility;
  value: string | undefined;
  color?: colorCallback;
  constructor(utility: Utility) {
    this.utility = utility;
    this.value = undefined;
    this._amount = utility.amount;
  }
  handleStatic(
    map?: { [key: string]: string | string[] } | unknown,
    callback?: (str: string) => string | undefined
  ) {
    if (this.value) return this;
    if (map && typeof map === 'object') {
      const knownMap = map as { [key: string]: string | string[] };
      if (knownMap.DEFAULT) knownMap[this.utility.raw] = knownMap.DEFAULT;
      if (this._amount in knownMap)
        this.value = callback
          ? callback(this._amount)
          : `${knownMap[this._amount]}`;
    }
    return this;
  }
  handleBody(
    map?: { [key: string]: string | string[] } | unknown,
    callback?: (str: string) => string | undefined
  ) {
    if (this.value) return this;
    if (map && typeof map === 'object') {
      const knownMap = map as { [key: string]: string | string[] };
      if (knownMap.DEFAULT) knownMap[this.utility.raw] = knownMap.DEFAULT;
      const body = this.utility.body;
      if (body in knownMap)
        this.value = callback ? callback(body) : `${knownMap[body]}`;
    }
    return this;
  }
  handleSquareBrackets(callback?: (number: string) => string | undefined) {
    if (this.value) return this;
    if (this._amount[0] === '[' && this._amount[this._amount.length-1] === ']') {
      const value = this._amount.slice(1, -1).replace(/_/g, ' '); // replace _ to space
      this.value = callback
        ? callback(value)
        : value;
    }
    return this;
  }
  handleNumber(
    start = -Infinity,
    end = Infinity,
    type: 'int' | 'float' = 'int',
    callback?: (number: number) => string | undefined
  ) {
    if (this.value) return this;
    if (isNumber(this._amount, start, end, type))
      this.value = callback ? callback(+this._amount) : this._amount;
    return this;
  }
  handleSpacing() {
    // just a short-hand for handle spacing.
    return this.handleNumber(0, undefined, 'float', (number: number) =>
      number === 0 ? '0px' : `${roundUp(number / 4, 6)}rem`
    );
  }
  handleNxl(callback?: (number: number) => string | undefined) {
    if (this.value) return this;
    if (/^\d*xl$/.test(this._amount))
      this.value = callback
        ? callback(this._amount === 'xl' ? 1 : parseInt(this._amount))
        : parseInt(this._amount).toString();
    return this;
  }
  handleFraction(callback?: (fraction: string) => string | undefined) {
    if (this.value) return this;
    if (isFraction(this._amount))
      this.value = callback
        ? callback(this._amount)
        : fracToPercent(this._amount);
    return this;
  }
  handleSize(callback?: (size: string) => string | undefined) {
    if (this.value) return this;
    if (isSize(this._amount))
      this.value = callback ? callback(this._amount) : this._amount;
    return this;
  }
  handleVariable(callback?: (variable: string) => string | undefined) {
    if (this.value) return this;
    const matchVariable = this.utility.raw.match(/-\$[\w-]+/);
    if (matchVariable) {
      const variableName = matchVariable[0].substring(2);
      this.value = callback ? callback(variableName) : `var(--${variableName})`;
    }
    return this;
  }
  handleColor(map: colorObject | unknown = defaultColors) {
    if (this.value) return this;
    let color;
    if (map && typeof map === 'object') {
      const colors = flatColors(map as colorObject);
      const body = this.utility.raw.replace(/^ring-offset|outline-solid|outline-dotted/, 'head').replace(/^\w+-/, '');
      if (body in colors) {
        color = colors[body];
      } else if (body.startsWith('hex-')) {
        const hex = body.slice(4);
        if(hex2RGB(hex)) color = '#' + hex;
      }
      if (typeof color === 'string') {
        this.value = color;
      } else if (typeof color === 'function') {
        this.color = color;
      }
    }
    return this;
  }
  handleNegative(
    callback: (value: string) => string | undefined = negateValue
  ) {
    if (!this.value) return this;
    this.value = this.utility.isNegative ? callback(this.value) : this.value;
    return this;
  }

  handleValue(callback?: (value: string) => string | undefined) {
    if (!this.value) return this;
    if (callback) this.value = callback(this.value);
    return this;
  }

  createProperty(
    name: string | string[],
    callback?: (value: string) => string
  ) {
    if (!this.value) return;
    const value = callback ? callback(this.value) : this.value;
    return new Property(name, value);
  }

  createStyle(
    selector: string,
    callback: (value: string) => Property | Property[] | undefined
  ) {
    if (!this.value) return;
    const value = callback ? callback(this.value) : undefined;
    return new Style(selector, value);
  }

  createColorValue(opacityValue?: string): string | undefined {
    if (this.color) return this.color({ opacityValue });
    if (this.value) {
      if (this.value === 'transparent') return `rgba(0, 0, 0, ${opacityValue})`;
      if (this.value === 'currentColor') return `rgba(255, 255, 255, ${opacityValue})`;
      if (this.value.includes('var')) return `rgba(${this.value}, ${opacityValue})`;
      return opacityValue ? `rgba(${toColor(this.value).color}, ${opacityValue})` : `rgb(${toColor(this.value).color})`;
    }
  }

  createColorStyle(selector: string, property: string | string[], opacityVariable?: string, wrapRGB = true) {
    if (this.color) {
      const value = this.color({ opacityVariable, opacityValue: opacityVariable ? `var(${opacityVariable})`: undefined });
      if (opacityVariable) {
        return new Style(selector, [
          new Property(opacityVariable, '1'),
          new Property(property, value),
        ]);
      }
      return new Style(selector, new Property(property, value));
    }
    const color = this.value;
    if (!color) return;
    if (['transparent', 'currentColor', 'auto'].includes(color) || color.includes('var')) return new Style(selector, new Property(property, color));
    const rgb = toColor(color);
    if (opacityVariable) {
      return new Style(selector, [
        new Property(opacityVariable, rgb.opacity),
        new Property(property, `rgba(${rgb.color}, var(${opacityVariable}))`),
      ]);
    }
    return new Style(selector, new Property(property, wrapRGB ? `rgb(${rgb.color})` : rgb.color));
  }

  callback(func: (value: string) => Property | Style | Style[] | undefined) {
    if (!this.value) return;
    return func(this.value);
  }
}

export class Utility {
  raw: string;
  constructor(raw: string) {
    this.raw = raw; // -placeholder-real-gray-300
  }
  match(expression: RegExp): string {
    const match = this.absolute.match(expression);
    return match ? match[0] : '';
  }
  get class(): string {
    return '.' + cssEscape(this.raw); // .-placeholder-real-gray-300
  }
  get isNegative(): boolean {
    return this.raw[0] === '-'; // true
  }
  get absolute(): string {
    return this.isNegative ? this.raw.substring(1) : this.raw;
  }
  get identifier(): string {
    return this.match(/[^-]+/); // placeholder
  }
  get key(): string {
    return this.match(/^\w[-\w]+(?=-)/); // placeholder-real-gray
  }
  get center(): string {
    return this.match(/-.+(?=-)/).substring(1); // real-gray
  }
  get amount(): string {
    return this.match(/(?:[^-]+|\[[\s\S]*?\])$/); // 300
  }
  get body(): string {
    return this.match(/-.+/).substring(1); // real-gray-300
  }
  get handler(): Handler {
    return new Handler(this);
  }
}
