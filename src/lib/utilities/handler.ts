import { defaultColors } from '../../config/base';
import { Property, Style } from '../../utils/style';
import { toColor } from '../../utils/color';
import { cssEscape } from '../../utils/algorithm';
import {
  isNumber,
  roundUp,
  fracToPercent,
  hex2RGB,
  negateValue,
  flatColors,
  splitColorGroup,
} from '../../utils/tools';

import type { colorCallback, colorObject, DictStr, Handlers } from '../../interfaces';

type emptyCallback = () => Property | Style | Style[] | undefined
type valueCallback = (value: string) => Property | Style | Style[] | undefined
type handlerCallback = (handler: Handler) => Property | Style | Style[] | undefined

export type Handler = {
  utility: Utility
  value?: string
  prefix?: string
  _amount: string
  _slices: string[]
  _prefix_expr?: string
  opacity?: string | undefined
  color?: colorCallback
  catchPrefix: (regex: RegExp, match?: boolean) => Handler | undefined,
  isStatic: (map: { [key: string]: string | string[] }, amount?: string) => boolean,
  isTime: (start: number, end: number, type: 'int' | 'float') => boolean,
  isNumber: (start: number, end: number, type: 'int' | 'float') => boolean,
  isFraction: () => boolean,
  isSize: () => boolean,
  isNxl: () => boolean,
  isVariable: () => boolean,
  isSquareBracket: () => boolean,
  handleStatic: (
    map?: { [key: string]: string | string[] } | unknown,
    callback?: (str: string) => string | undefined
  ) => Handler
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
  handleString: (callback: (string: string) => string | undefined) => Handler
  handleSpacing: () => Handler
  handleSquareBrackets: (
    callback?: (number: string) => string | undefined
  ) => Handler
  handleTime: (
    start?: number,
    end?: number,
    type?: 'int' | 'float',
    callback?: (milliseconds: number) => string | undefined
  ) => Handler
  handleColor: (
    map?: colorObject | unknown
  ) => Handler
  handleOpacity: (map?: DictStr | unknown) => Handler
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
  callback: (func: valueCallback) => Property | Style | Style[] | undefined
  then: (func: (handlerCallback | emptyCallback)) => Property | Style | Style[] | undefined
}

export type HandlerCreator = (utility: Utility, value?: string | undefined, color?: colorCallback | undefined) => Handler;

export function createHandler(handlers: Handlers = { static: true }): HandlerCreator {
  return (utility: Utility, value?: string, color?: colorCallback) => {
    const handler: Handler = {
      utility,
      value,
      color,
      _amount: utility.amount,
      _slices: utility.slices,

      catchPrefix: (regex, match = false) => {
        handler._prefix_expr = regex.source;

        if (match) {
          const matched = utility.raw.match(regex);
          if (!matched) return;
          handler.prefix = matched[0];
        }
        return handler;
      },

      isStatic: (map, amount = handler._amount) => {
        return amount in map && new RegExp(`${handler._prefix_expr ?? ''}-?${amount}$`).test(handler.utility.raw);
      },

      isNumber: (
        start = -Infinity,
        end = Infinity,
        type = 'int'
      ) => {
        const prefix = handler._prefix_expr;
        const utility = handler.utility.raw;
        if (!prefix) return isNumber(handler._amount, start, end, type);
        const isInt = new RegExp(`${prefix}-\\d+$`).test(utility);
        if (type === 'int') {
          if (!isInt) return false;
        } else {
          const isFloat = new RegExp(`${prefix}-\\d+\\.\\d+$`).test(utility);
          if (!(isInt || isFloat)) return false;
        }
        const num = parseFloat(handler._amount);
        return num >= start && num <= end;
      },

      isTime: (
        start = -Infinity,
        end = Infinity,
        type = 'int'
      ) => {
        const prefix = handler._prefix_expr;
        const utility = handler.utility.raw;
        if (!prefix) return isNumber(handler._amount, start, end, type);
        const isInt = new RegExp(`${prefix}-\\d+(s|ms)$`).test(utility);
        if (type === 'int') {
          if (!isInt) return false;
        } else {
          const isFloat = new RegExp(`${prefix}-\\d+\\.\\d+(s|ms)$`).test(utility);
          if (!(isInt || isFloat)) return false;
        }
        const num = parseFloat(handler._amount);
        return num >= start && num <= end;
      },

      isFraction: () => {
        return handler._prefix_expr ? new RegExp(`${handler._prefix_expr}-\\d+\\/\\d+$`).test(handler.utility.raw) : /^\d+\/\d+$/.test(handler._amount);
      },

      isSize: () => {
        return handler._prefix_expr ? new RegExp(`${handler._prefix_expr}-(\\d+(\\.\\d+)?)+(rem|em|px|rpx|vh|vw|ch|ex)$`).test(handler.utility.raw) : /^-?(\d+(\.\d+)?)+(rem|em|px|rpx|vh|vw|ch|ex)$/.test(handler._amount);
      },

      isNxl: () => {
        return handler._prefix_expr ? new RegExp(`${handler._prefix_expr}-\\d*xl$`).test(handler.utility.raw) : /^\d*xl$/.test(handler._amount);
      },

      isVariable: () => {
        return new RegExp(`${handler._prefix_expr ?? ''}-\\$[\\w-]+`).test(handler.utility.raw);
      },

      isSquareBracket: () => {
        return new RegExp(`${handler._prefix_expr ?? ''}-\\[.+\\]`).test(handler.utility.raw);
      },

      handleStatic: handlers.static ? (map, callback) => {
        if (handler.value) return handler;
        if (map && typeof map === 'object') {
          const knownMap = map as { [key: string]: string | string[] };
          if (knownMap.DEFAULT) knownMap[''] = knownMap.DEFAULT;
          if (handler.isStatic(knownMap))
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
          if (knownMap.DEFAULT) knownMap[''] = knownMap.DEFAULT;
          const body = handler.utility.body;
          if (body in knownMap)
            handler.value = callback ? callback(body) : `${knownMap[body]}`;
        }
        return handler;
      } : () => handler,

      handleNumber: handlers.number ? (start = -Infinity, end = Infinity, type = 'int', callback) => {
        if (handler.value) return handler;
        if (handler.isNumber(start, end, type))
          handler.value = callback ? callback(+handler._amount) : handler._amount;
        return handler;
      } : () => handler,

      handleTime: handlers.time ? (start = -Infinity, end = Infinity, type = 'int', callback) => {
        if (handler.value) return handler;
        let unit = 'ms';
        let amount = handler._amount;
        if (amount.endsWith('ms')) {
          amount = amount.slice(0, -2);
        } else if (amount.endsWith('s')) {
          unit = 's';
          amount = amount.slice(0, -1);
        } else {
          return handler;
        }
        if (isNumber(amount, start, end, type))
          handler.value = callback ? callback(unit === 's' ? +amount * 1000 : +amount) : handler._amount;
        return handler;
      } : () => handler,

      handleString: handlers.string ? (callback) => {
        if (handler.value) return handler;
        handler.value = callback(handler.utility.body);
        return handler;
      } : () => handler,

      handleSquareBrackets: handlers.bracket ? (callback) => {
        if (handler.value) return handler;
        if (handler._amount[0] === '[' && handler._amount[handler._amount.length-1] === ']' && handler.isSquareBracket()) {
          let value = handler._amount.slice(1, -1).replace(/_/g, ' '); // replace _ to space
          if (value.indexOf('calc(') > -1) {
            value = value.replace(/(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g, '$1 $2 ');
          }
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
        if (handler.isNxl())
          handler.value = callback
            ? callback(handler._amount === 'xl' ? 1 : parseInt(handler._amount))
            : parseInt(handler._amount).toString();
        return handler;
      }: () => handler,

      handleFraction: handlers.fraction ? (callback) => {
        if (handler.value) return handler;
        if (handler.isFraction())
          handler.value = callback
            ? callback(handler._amount)
            : fracToPercent(handler._amount);
        return handler;
      } : () => handler,

      handleSize: handlers.size ? (callback) => {
        if (handler.value) return handler;
        if (handler.isSize())
          handler.value = callback ? callback(handler._amount) : handler._amount;
        return handler;
      } : () => handler,

      handleVariable: handlers.variable ? (callback) => {
        if (handler.value) return handler;
        const matchVariable = handler.utility.raw.match(/-\$[\w-]+/);
        if (matchVariable && handler.isVariable()) {
          const variableName = matchVariable[0].substring(2);
          handler.value = callback ? callback(variableName) : `var(--${variableName})`;
        }
        return handler;
      } : () => handler,

      handleColor: handlers.color ? (map = defaultColors) => {
        if (handler.value) return handler;
        let color;
        if (map && typeof map === 'object') {
          const colors = flatColors(map as colorObject);
          const body = handler.utility.raw.replace(/^ring-offset|outline-solid|outline-dotted/, 'head').replace(/^\w+-/, '');
          const [ key, opacity ] = splitColorGroup(body);
          handler.opacity = opacity;
          if (key in colors) {
            color = colors[key];
          } else if (handlers.hex && key.startsWith('hex-')) {
            const hex = key.slice(4);
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

      handleOpacity: handlers.opacity ? (map) => {
        if (handler.opacity && typeof map === 'object') {
          const _map = map as DictStr;
          if (handlers.static && handler.opacity in _map) {
            handler.opacity = _map[handler.opacity];
          } else if (handlers.number && isNumber(handler.opacity, 0, 100, 'int')) {
            handler.opacity = (+handler.opacity / 100).toString();
          } else if (handlers.variable && handler.opacity.charAt(0) === '$') {
            handler.opacity = `var(--${handler.opacity.slice(1)})`;
          } else if (handlers.bracket && handler.opacity.charAt(0) === '[' && handler.opacity.charAt(handler.opacity.length - 1) === ']') {
            handler.opacity = handler.opacity.slice(1, -1).replace(/_/g, ' ');
          } else {
            handler.opacity = undefined;
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
          if (['transparent', 'currentColor', 'auto', 'none'].includes(handler.value)) return handler.value;
          if (handler.value.includes('var') && opacityValue) return `rgba(${handler.value}, ${handler.opacity || opacityValue})`;
          return opacityValue ? `rgba(${toColor(handler.value).color}, ${handler.opacity || opacityValue})` : `rgb(${toColor(handler.value).color})`;
        }
      },

      createColorStyle: (selector, property, opacityVariable, wrapRGB = true) => {
        if (handler.color) {
          const value = handler.color({ opacityVariable, opacityValue: opacityVariable ? `var(${opacityVariable})`: undefined });
          if (opacityVariable) {
            return new Style(selector, [
              new Property(opacityVariable, handler.opacity || '1'),
              new Property(property, value),
            ]);
          }
          return new Style(selector, new Property(property, value));
        }
        const color = handler.value;
        if (!color) return;
        if (['transparent', 'currentColor', 'auto', 'none'].includes(color) || color.includes('var')) return new Style(selector, new Property(property, color));
        const rgb = toColor(color);
        if (opacityVariable) {
          return new Style(selector, [
            new Property(opacityVariable, handler.opacity || rgb.opacity),
            new Property(property, `rgba(${rgb.color}, var(${opacityVariable}))`),
          ]);
        }
        return new Style(selector, new Property(property, wrapRGB ? `rgb(${rgb.color})` : rgb.color));
      },

      callback: (func) => {
        if (!handler.value) return;
        return func(handler.value);
      },

      then: (func) => func(handler),
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
    return this.match(/-(?:[^-]+|\[[\s\S]*?\])$/).substring(1); // 300
  }
  get body(): string {
    return this.match(/-.+/).substring(1); // real-gray-300
  }
  get slices(): string[] {
    return this.absolute.split('-'); // ['placeholder', 'real', 'gray', '300']
  }
  get handler(): Handler {
    return this._h(this);
  }
}
