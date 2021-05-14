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
import type { colorCallback, colorObject, Handlers } from 'src/interfaces';

export type Handler = {
  utility: Utility
  value?: string
  _amount: string
  color?: colorCallback
  handleStatic: (
    map?: { [key: string]: string | string[] } | unknown,
    callback?: (str: string) => string | undefined
  )=> Handler
  handleBody: (
    map?: { [key: string]: string | string[] } | unknown,
    callback?: (str: string) => string | undefined
  ) => Handler
  handleNumber: (
    start?: number,
    end?: number,
    type?: 'int' | 'float',
    callback?: (number: number) => string | undefined
  ) => Handler
  handleSpacing: () => Handler
  handleSquareBrackets: (
    callback?: (number: string) => string | undefined
  ) => Handler
  handleColor: (
    map?: colorObject | unknown
  ) => Handler
  handleFraction: (
    callback?: (fraction: string) => string | undefined
  ) => Handler
  handleNxl: (
    callback?: (number: number) => string | undefined
  ) => Handler
  handleSize: (
    callback?: (size: string) => string | undefined
  ) => Handler
  handleVariable: (
    callback?: (variable: string) => string | undefined
  ) => Handler
  handleNegative: (
    callback?: (value: string) => string | undefined
  ) => Handler
  createProperty: (
    name: string | string[], callback?: (value: string) => string
  ) => Property | undefined
  createStyle: (
    selector: string,
    callback: (value: string) => Property | Property[] | undefined
  ) => Style | undefined
  createColorValue: (
    opacityValue?: string | undefined
  ) => string | undefined
  createColorStyle: (
    selector: string,
    property: string | string[],
    opacityVariable?: string | undefined,
    wrapRGB?: boolean
  ) => Style | undefined
  callback: (
    func: (value: string) => Property | Style | Style[] | undefined
  ) => Property | Style | Style[] | undefined
}

export type HandlerCreator = (utility: Utility, value?: string | undefined, color?: colorCallback | undefined) => Handler;

export function createHandler(handlers: Handlers = { static: true }): HandlerCreator {
  return (utility: Utility, value?: string, color?: colorCallback) => {
    const handler: Handler = {
      utility,
      value,
      color,
      _amount: utility.amount,

      handleStatic: handlers.static ? (map, callback) => {
        if (handler.value) return handler;
        if (map && typeof map === 'object') {
          const knownMap = map as { [key: string]: string | string[] };
          if (knownMap.DEFAULT) knownMap[handler.utility.raw] = knownMap.DEFAULT;
          if (handler._amount in knownMap)
            handler.value = callback
              ? callback(handler._amount)
              : `${knownMap[handler._amount]}`;
        }
        return handler;
      } : () => handler,

      handleBody: handlers.static ? (map, callback) => {
        if (handler.value) return handler;
        if (map && typeof map === 'object') {
          const knownMap = map as { [key: string]: string | string[] };
          if (knownMap.DEFAULT) knownMap[handler.utility.raw] = knownMap.DEFAULT;
          const body = handler.utility.body;
          if (body in knownMap)
            handler.value = callback ? callback(body) : `${knownMap[body]}`;
        }
        return handler;
      } : () => handler,

      handleNumber: handlers.number ? (start = -Infinity, end = Infinity, type = 'int', callback) => {
        if (handler.value) return handler;
        if (isNumber(handler._amount, start, end, type))
          handler.value = callback ? callback(+handler._amount) : handler._amount;
        return handler;
      } : () => handler,

      handleSquareBrackets: handlers.bracket ? (callback) => {
        if (handler.value) return handler;
        if (handler._amount[0] === '[' && handler._amount[handler._amount.length-1] === ']') {
          const value = handler._amount.slice(1, -1).replace(/_/g, ' '); // replace _ to space
          handler.value = callback
            ? callback(value)
            : value;
        }
        return handler;
      } : () => handler,

      handleSpacing: handlers.number ? () => {
        // just a short-hand for handle spacing.
        return handler.handleNumber(0, undefined, 'float', (number: number) =>
          number === 0 ? '0px' : `${roundUp(number / 4, 6)}rem`
        );
      }: () => handler,

      handleNxl: handlers.nxl ? (callback) => {
        if (handler.value) return handler;
        if (/^\d*xl$/.test(handler._amount))
          handler.value = callback
            ? callback(handler._amount === 'xl' ? 1 : parseInt(handler._amount))
            : parseInt(handler._amount).toString();
        return handler;
      }: () => handler,

      handleFraction: handlers.fraction ? (callback) => {
        if (handler.value) return handler;
        if (isFraction(handler._amount))
          handler.value = callback
            ? callback(handler._amount)
            : fracToPercent(handler._amount);
        return handler;
      } : () => handler,

      handleSize: handlers.size ? (callback) => {
        if (handler.value) return handler;
        if (isSize(handler._amount))
          handler.value = callback ? callback(handler._amount) : handler._amount;
        return handler;
      } : () => handler,

      handleVariable: handlers.variable ? (callback) => {
        if (handler.value) return handler;
        const matchVariable = handler.utility.raw.match(/-\$[\w-]+/);
        if (matchVariable) {
          const variableName = matchVariable[0].substring(2);
          handler.value = callback ? callback(variableName) : `var(--${variableName})`;
        }
        return handler;
      } : () => handler,

      handleColor: handlers.static ? (map = defaultColors) => {
        if (handler.value) return handler;
        let color;
        if (map && typeof map === 'object') {
          const colors = flatColors(map as colorObject);
          const body = handler.utility.raw.replace(/^ring-offset|outline-solid|outline-dotted/, 'head').replace(/^\w+-/, '');
          if (body in colors) {
            color = colors[body];
          } else if (handlers.hex && body.startsWith('hex-')) {
            const hex = body.slice(4);
            if(hex2RGB(hex)) color = '#' + hex;
          }
          if (typeof color === 'string') {
            handler.value = color;
          } else if (typeof color === 'function') {
            handler.color = color;
          }
        }
        return handler;
      }: () => handler,

      handleNegative: handlers.negative ? (callback = negateValue) => {
        if (!handler.value) return handler;
        handler.value = handler.utility.isNegative ? callback(handler.value) : handler.value;
        return handler;
      }: () => handler,

      createProperty: (name, callback) => {
        if (!handler.value) return;
        const value = callback ? callback(handler.value) : handler.value;
        return new Property(name, value);
      },

      createStyle: (selector, callback) => {
        if (!handler.value) return;
        const value = callback ? callback(handler.value) : undefined;
        return new Style(selector, value);
      },

      createColorValue: (opacityValue) => {
        if (handler.color) return handler.color({ opacityValue });
        if (handler.value) {
          if (handler.value === 'transparent') return `rgba(0, 0, 0, ${opacityValue})`;
          if (handler.value === 'currentColor') return `rgba(255, 255, 255, ${opacityValue})`;
          if (handler.value.includes('var')) return `rgba(${handler.value}, ${opacityValue})`;
          return opacityValue ? `rgba(${toColor(handler.value).color}, ${opacityValue})` : `rgb(${toColor(handler.value).color})`;
        }
      },

      createColorStyle: (selector, property, opacityVariable, wrapRGB = true) => {
        if (handler.color) {
          const value = handler.color({ opacityVariable, opacityValue: opacityVariable ? `var(${opacityVariable})`: undefined });
          if (opacityVariable) {
            return new Style(selector, [
              new Property(opacityVariable, '1'),
              new Property(property, value),
            ]);
          }
          return new Style(selector, new Property(property, value));
        }
        const color = handler.value;
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
      },

      callback: (func) => {
        if (!handler.value) return;
        return func(handler.value);
      },
    };
    return handler;
  };
}

export class Utility {
  raw: string;
  private _h: HandlerCreator;
  constructor(raw: string, _h: HandlerCreator) {
    this.raw = raw; // -placeholder-real-gray-300
    this._h = _h;
  }
  match(expression: RegExp): string {
    const match = this.absolute.match(expression);
    return match ? match[0] : '';
  }
  clone(raw?: string): Utility {
    return new Utility(raw || this.raw, this._h);
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
    return this._h(this);
  }
}
