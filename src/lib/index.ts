import { getNestedValue, hash, deepCopy, testRegexr, guessClassName, toArray } from '../utils/tools';
import { negative, breakpoints } from '../utils/helpers';
import { Keyframes, Container, Property, Style, StyleSheet } from '../utils/style';
import { resolveVariants } from './variants';
import { staticUtilities, dynamicUtilities } from './utilities';
import { createHandler, HandlerCreator } from './utilities/handler';
import extract, { generateStaticStyle } from './extract';
import test from './test';
import preflight from './preflight';
import plugin from '../plugin/index';
import { baseConfig } from '../config';
import { sortGroup } from '../utils/algorithm/sortStyle';
import { layerOrder, pluginOrder } from '../config/order';
import cssEscape from '../utils/algorithm/cssEscape';
import diffConfig from '../utils/algorithm/diffConfig';
import combineConfig from '../utils/algorithm/combineConfig';
import ClassParser from '../utils/parser/class';
// @ts-expect-error no types
import toSource from 'tosource';

import type {
  Config,
  DictStr,
  DefaultConfig,
  DynamicUtility,
  ConfigUtil,
  Theme,
  DefaultTheme,
  Element,
  Shortcut,
  PluginUtils,
  PluginUtilOptions,
  PluginOutput,
  PluginWithOptions,
  DeepNestObject,
  UtilityGenerator,
  VariantGenerator,
  ProcessorCache,
  ThemeType,
  NestObject,
  Validata,
  StyleArrayObject,
  PluginCache,
  ResolvedVariants,
  VariantTypes,
  AddPluginType,
  VariantUtils,
} from '../interfaces';

import type { Utility } from './utilities/handler';

export class Processor {
  private _config: Config;
  private _theme: Config['theme'];
  private _variants: ResolvedVariants = {};
  private _cache: ProcessorCache = {
    html: [],
    attrs: [],
    classes: [],
    utilities: [],
    variants: [],
  };
  public _handler: HandlerCreator;
  readonly _plugin: PluginCache = {
    static: {},
    dynamic: {},
    utilities: {},
    components: {},
    preflights: {},
    shortcuts: {},
    alias: {},
    completions: {},
  };

  public pluginUtils: PluginUtils = {
    addDynamic: (...args) => this.addDynamic(...args),
    addUtilities: (...args) => this.addUtilities(...args),
    addComponents: (...args) => this.addComponents(...args),
    addBase: (...args) => this.addBase(...args),
    addVariant: (...args) => this.addVariant(...args),
    e: (...args) => this.e(...args),
    prefix: (...args) => this.prefix(...args),
    config: (...args) => this.config(...args),
    theme: (...args) => this.theme(...args),
    variants: (...args) => this.variants(...args),
  };

  public variantUtils: VariantUtils = {
    modifySelectors: (modifier) =>
      new Style().wrapSelector((selector) =>
        modifier({
          className: /^[.#]/.test(selector) ? selector.substring(1) : selector,
        })),
    atRule: (name) => new Style().atRule(name),
    pseudoClass: (name) => new Style().pseudoClass(name),
    pseudoElement: (name) => new Style().pseudoElement(name),
    parent: (name) => new Style().parent(name),
    child: (name) => new Style().child(name),
  };

  constructor(config?: Config) {
    this._config = this.resolveConfig(config, baseConfig);
    this._theme = this._config.theme;
    this._handler = createHandler(this._config.handlers);
    this._config.shortcuts && this.loadShortcuts(this._config.shortcuts);
    this._config.alias && this.loadAlias(this._config.alias);
  }

  private _resolveConfig(userConfig: Config, presets: Config = {}) {
    if (userConfig.presets) {
      const resolved = this._resolvePresets(userConfig.presets);
      presets = this._resolveConfig(resolved, presets);
      delete userConfig.presets;
    }
    const userTheme = userConfig.theme;
    if (userTheme) delete userConfig.theme;
    const extendTheme: Theme = userTheme && 'extend' in userTheme ? userTheme.extend ?? {} : {};
    const theme = (presets.theme || {}) as Record<string, ThemeType>;
    if (userTheme) {
      if ('extend' in userTheme) delete userTheme.extend;
      for (const [key, value] of Object.entries(userTheme)) {
        theme[key] = typeof value === 'function' ? value : { ...value };
      }
    }
    if (extendTheme && typeof extendTheme === 'object') this._reduceFunction(theme, extendTheme);
    return { ...presets, ...userConfig, theme };
  }

  private _reduceFunction(theme: Record<string, ThemeType>, extendTheme: Theme) {
    for (const [key, value] of Object.entries(extendTheme)) {
      const themeValue = theme[key];
      switch (typeof themeValue) {
      case 'function':
        theme[key] = (theme, { negative, breakpoints }) => combineConfig(
          (themeValue as ConfigUtil)(theme, { negative, breakpoints }),
          (typeof value === 'function' ? value(theme, { negative, breakpoints }) : value ?? {}),
        );
        break;
      case 'object':
        theme[key] = (theme, { negative, breakpoints }) => combineConfig(themeValue, (typeof value === 'function' ? value(theme, { negative, breakpoints }) : value ?? {}));
        break;
      default:
        theme[key] = value;
      }
    }
  }

  private _resolvePresets(presets: Config[]) {
    let config: Config = {};
    const extend: Config = {};
    presets.forEach(p => {
      if (p.theme && 'extend' in p.theme && p.theme.extend) {
        this._reduceFunction(extend, p.theme.extend);
        delete p.theme.extend;
      }
      config = this._resolveConfig(p, config);
    });
    if (config.theme) {
      (config.theme as Record<string, ThemeType>).extend = extend;
    } else {
      config.theme = { extend };
    }
    return config;
  }

  private _resolveFunction(config: Config) {
    if (!config.theme) return config;
    const theme = (path: string, defaultValue?: unknown) => this.theme(path, defaultValue);
    for (const dict of [config.theme, 'extend' in config.theme ? config.theme.extend ?? {} : {}]) {
      for (const [key, value] of Object.entries(dict)) {
        if (typeof value === 'function') {
          (dict as Record<string, ThemeType>)[key] = value(theme, {
            negative,
            breakpoints,
          }) as ConfigUtil;
        }
      }
    }
    return config;
  }

  private _replaceStyleVariants(styles: Style[]) {
    // @screen sm -> @screen (min-width: 640px)
    styles.forEach(style => {
      style.atRules = style.atRules?.map(i => {
        if (i.match(/@screen/)) {
          const variant = i.replace(/\s*@screen\s*/, '');
          const atRule = this._variants[variant]().atRules?.[0];
          return atRule ?? i;
        }
        return i;
      });
    });
  }

  private _addPluginProcessorCache(type: AddPluginType, key: string, styles: Style | Style[]) {
    styles = toArray(styles);
    this._plugin[type][key] = key in this._plugin[type]
      ? [...this._plugin[type][key], ...styles]
      : styles;
  }

  private _loadVariables() {
    const config = this.theme('vars') as NestObject | undefined;
    if (!config) return;
    this.addBase({ ':root': Object.assign({}, ...Object.keys(config).map(i => ({ [`--${i}`]: config[i] }))) as NestObject });
  }

  loadConfig(config?: Config): Config {
    this._config = this.resolveConfig(config, baseConfig);
    this._theme = this._config.theme;
    this._handler = createHandler(this._config.handlers);
    this._config.shortcuts && this.loadShortcuts(this._config.shortcuts);
    this._config.alias && this.loadAlias(this._config.alias);
    return this._config;
  }

  resolveConfig(config: Config | undefined, presets: Config): Config {
    this._config = this._resolveConfig({ ...deepCopy(config ? config : {}), exclude: config?.exclude }, deepCopy(presets)); // deep copy
    this._theme = this._config.theme; // update theme to make sure theme() function works.
    this._config.plugins?.map(i => typeof i === 'function' ? ('__isOptionsFunction' in i ? this.loadPluginWithOptions(i): this.loadPlugin(plugin(i))) : this.loadPlugin(i));
    this._config = this._resolveFunction(this._config);
    this._variants = { ...this._variants, ... this.resolveVariants() };
    this._cache.variants = Object.keys(this._variants);
    this._loadVariables();
    if (this._config.corePlugins) this._plugin.core = Array.isArray(this._config.corePlugins) ? Object.assign({}, ...(this._config.corePlugins as string[]).map(i => ({ [i]: true }))) : { ...Object.assign({}, ...Object.keys(pluginOrder).slice(Object.keys(pluginOrder).length/2).map(i => ({ [i]: true }))), ...this._config.corePlugins };
    return this._config;
  }

  resolveVariants(
    type?: VariantTypes
  ): ResolvedVariants {
    const variants = resolveVariants(this._config);
    if (type) {
      return variants[type];
    }
    return { ...variants.screen, ...variants.theme, ...variants.state };
  }

  resolveStaticUtilities(includePlugins = false): StyleArrayObject {
    const staticStyles: StyleArrayObject = {};
    for (const key in staticUtilities) {
      const style = generateStaticStyle(this, key, true);
      if (style) staticStyles[key] = [ style ];
    }
    if (!includePlugins) return staticStyles;
    return { ...staticStyles, ...this._plugin.utilities, ...this._plugin.components };
  }

  resolveDynamicUtilities(includePlugins = false): DynamicUtility {
    if (!includePlugins) return dynamicUtilities;
    return { ...dynamicUtilities, ...this._plugin.dynamic };
  }

  get allConfig(): DefaultConfig {
    return this._config as unknown as DefaultConfig;
  }

  get allTheme(): DefaultTheme {
    return (this._theme ?? {}) as DefaultTheme;
  }

  get allVariant(): string[] {
    return this._cache.variants;
  }

  wrapWithVariants(variants: string[], styles: Style | Style[]): Style[] | undefined {
    // apply variant to style
    if (!Array.isArray(styles)) styles = [styles];
    if (variants.length === 0) return styles;

    return styles.map(style => {
      if (style instanceof Keyframes) return style;
      const atrules:string[] = [];
      let wrapped = variants
        .map(i => this._variants[i]())
        .reduce((previousValue: Style, currentValue: Style) => {
          const output = previousValue.extend(currentValue);
          if (previousValue.isAtrule) atrules.push((previousValue.atRules as string[])[0]);
          return output;
        }, new Style())
        .extend(style);
      if (style instanceof Container) wrapped = new Container().extend(wrapped);
      if (atrules.length > 0) wrapped.meta.variants = atrules;
      return wrapped;
    });
  }

  removePrefix(className: string): string {
    const prefix = this.config('prefix') as string | undefined;
    return prefix ? className.replace(new RegExp(`^${prefix}`), '') : className;
  }

  markAsImportant(style: Style, force: boolean | string = false): Style {
    const _important = force ? force : this.config('important', false);
    const important = typeof _important === 'string' ? (_important as string) : (_important as boolean);
    if (important) {
      if (typeof important === 'string') {
        style.parent(important);
      } else {
        style.important = true;
        style.property.forEach(i => i.important = true);
      }
    }
    return style;
  }

  extract(className: string, addComment = false, prefix?: string): Style | Style[] | undefined {
    return extract(this, className, addComment, prefix);
  }

  test(className: string, prefix?: string): boolean {
    return test(this, className, prefix);
  }

  preflight(
    html?: string,
    includeBase = true,
    includeGlobal = true,
    includePlugins = true,
    ignoreProcessed = false
  ): StyleSheet {
    let id;
    if (html) {
      id = hash(html);
      if (ignoreProcessed && this._cache.html.includes(id)) return new StyleSheet();
    }
    id && ignoreProcessed && this._cache.html.push(id);
    return preflight(this, html, includeBase, includeGlobal, includePlugins);
  }

  interpret(
    classNames: string,
    ignoreProcessed = false,
    handleIgnored?: (ignored:string) => Style | Style[] | undefined
  ): { success: string[]; ignored: string[]; styleSheet: StyleSheet } {
    const ast = new ClassParser(classNames, this.config('separator', ':') as string, this._cache.variants).parse();
    const success: string[] = [];
    const ignored: string[] = [];
    const styleSheet = new StyleSheet();

    const _hIgnored = (className:string) => {
      if (handleIgnored) {
        const style = handleIgnored(className);
        if (style) {
          styleSheet.add(style);
          success.push(className);
        } else {
          ignored.push(className);
        }
      }
      ignored.push(className);
    };

    const _gStyle = (
      baseClass: string,
      variants: string[],
      selector: string,
      important = false,
      prefix?: string,
    ) => {
      if (this._config.exclude && testRegexr(selector, this._config.exclude)) {
        // filter exclude className
        ignored.push(selector);
        return;
      }
      if (variants[0] && selector in { ...this._plugin.utilities, ...this._plugin.components }) {
        // handle special selector that conflict with class parser, such as 'hover:abc'
        success.push(selector);
        styleSheet.add(deepCopy(this._plugin.utilities[selector]));
        return;
      }
      let result = this.extract(baseClass, false, prefix);
      if (result) {
        const escapedSelector = '.' + cssEscape(selector);
        if (result instanceof Style) {
          if(!result.meta.respectSelector) result.selector = escapedSelector;
          this.markAsImportant(result, important);
        } else if (Array.isArray(result)) {
          result = result.map(i => {
            if (i instanceof Keyframes) return i;
            if(!i.meta.respectSelector) i.selector = escapedSelector;
            this.markAsImportant(i, important);
            return i;
          });
        }
        const wrapped = this.wrapWithVariants(variants, result);
        if (wrapped) {
          success.push(selector);
          styleSheet.add(wrapped);
        } else {
          _hIgnored(selector);
        }
      } else {
        _hIgnored(selector);
      }
    };

    const _hGroup = (obj: Element, parentVariants: string[] = []) => {
      const _eval = (u: Element) => {
        if (u.type === 'group') {
          _hGroup(u, obj.variants);
        } else if (u.type === 'alias' && (u.content as string) in this._plugin.alias) {
          this._plugin.alias[u.content as string].forEach(i => _eval(i));
        } else {
          // utility
          const variants = [
            ...parentVariants,
            ...obj.variants,
            ...u.variants,
          ];
          const important = obj.important || u.important;
          const selector = (important ? '!' : '') + [...variants, u.content].join(':');
          typeof u.content === 'string' &&
            _gStyle(u.content, variants, selector, important, this.config('prefix') as string);
        }
      };
      Array.isArray(obj.content) && obj.content.forEach(u => _eval(u));
    };

    const _gAst = (ast: Element[]) => {
      ast.forEach(obj => {
        if (!(ignoreProcessed && this._cache.utilities.includes(obj.raw))) {
          if (ignoreProcessed) this._cache.utilities.push(obj.raw);
          if (obj.type === 'utility') {
            if (Array.isArray(obj.content)) {
              // #functions stuff
            } else if (obj.content) {
              _gStyle(obj.content, obj.variants, obj.raw, obj.important, this.config('prefix') as string);
            }
          } else if (obj.type === 'group') {
            _hGroup(obj);
          } else if (obj.type === 'alias' && (obj.content as string) in this._plugin.alias) {
            _gAst(this._plugin.alias[obj.content as string]);
          } else {
            _hIgnored(obj.raw);
          }
        }
      });
    };

    _gAst(ast);

    if (!this.config('prefixer')) styleSheet.prefixer = false;

    return {
      success,
      ignored,
      styleSheet: styleSheet.sort(),
    };
  }

  validate(classNames: string): { success: Validata[]; ignored: Validata[] } {
    const ast = new ClassParser(classNames, this.config('separator', ':') as string, this._cache.variants).parse();
    const success: Validata[] = [];
    const ignored: Validata[] = [];

    const _hSuccess = (className: string, self: Element, parent?: Element) => {
      success.push({
        className,
        ...self,
        parent,
      });
    };

    const _hIgnored = (className: string, self: Element, parent?: Element) => {
      ignored.push({
        className,
        ...self,
        parent,
      });
    };

    const _gStyle = (
      baseClass: string,
      variants: string[],
      selector: string,
      self: Element,
      parent?: Element,
      prefix?: string,
    ) => {
      if (this._config.exclude && testRegexr(selector, this._config.exclude)) {
        // filter exclude className
        _hIgnored(selector, self, parent);
        return;
      }
      if (variants[0] && selector in { ...this._plugin.utilities, ...this._plugin.components }) {
        // handle special selector that conflict with class parser, such as 'hover:abc'
        _hSuccess(selector, self, parent);
        return;
      }
      if (this.test(baseClass, prefix) && variants.filter(i => !(i in this._variants)).length === 0) {
        _hSuccess(selector, self, parent);
      } else {
        _hIgnored(selector, self, parent);
      }
    };

    const _hGroup = (obj: Element, parentVariants: string[] = []) => {
      const _eval = (u: Element, parent: Element) => {
        if (u.type === 'group') {
          _hGroup(u, obj.variants);
        } else if (u.type === 'alias' && (u.content as string) in this._plugin.alias) {
          this._plugin.alias[u.content as string].forEach(i => _eval(i, u));
        } else {
          // utility
          const variants = [
            ...parentVariants,
            ...obj.variants,
            ...u.variants,
          ];
          const important = obj.important || u.important;
          const selector = (important ? '!' : '') + [...variants, u.content].join(':');
          typeof u.content === 'string' &&
            _gStyle(u.content, variants, selector, u, parent, this.config('prefix') as string);
        }
      };
      Array.isArray(obj.content) && obj.content.forEach(u => _eval(u, obj));
    };

    const _gAst = (ast: Element[]) => {
      ast.forEach(obj => {
        if (obj.type === 'utility') {
          if (Array.isArray(obj.content)) {
            // #functions stuff
          } else if (obj.content) {
            _gStyle(obj.content, obj.variants, obj.raw, obj, undefined, this.config('prefix') as string);
          }
        } else if (obj.type === 'group') {
          _hGroup(obj);
        } else if (obj.type === 'alias' && (obj.content as string) in this._plugin.alias) {
          _gAst(this._plugin.alias[obj.content as string]);
        } else {
          _hIgnored(obj.raw, obj);
        }
      });
    };

    _gAst(ast);

    return {
      success,
      ignored,
    };
  }

  compile(
    classNames: string,
    prefix = 'windi-',
    showComment = false,
    ignoreGenerated = false,
    handleIgnored?: (ignored:string) => Style | Style[] | undefined,
    outputClassName?: string
  ): {
    success: string[];
    ignored: string[];
    className?: string;
    styleSheet: StyleSheet;
  } {
    const ast = new ClassParser(classNames, this.config('separator', ':') as string, this._cache.variants).parse();
    const success: string[] = [];
    const ignored: string[] = [];
    const styleSheet = new StyleSheet();
    let className: string | undefined = outputClassName ?? prefix + hash(classNames.trim().split(/\s+/g).join(' '));
    if (ignoreGenerated && this._cache.classes.includes(className)) return { success, ignored, styleSheet, className };
    const buildSelector = '.' + className;

    const _hIgnored = (className:string) => {
      if (handleIgnored) {
        const style = handleIgnored(className);
        if (style) {
          styleSheet.add(style);
          success.push(className);
        } else {
          ignored.push(className);
        }
      }
      ignored.push(className);
    };

    const _gStyle = (
      baseClass: string,
      variants: string[],
      selector: string,
      important = false
    ) => {
      if (this._config.exclude && testRegexr(selector, this._config.exclude)) {
        // filter exclude className
        ignored.push(selector);
        return;
      }
      if (variants[0] && selector in { ...this._plugin.utilities, ...this._plugin.components }) {
        // handle special selector that conflict with class parser, such as 'hover:abc'
        success.push(selector);
        styleSheet.add(deepCopy(this._plugin.utilities[selector]));
        return;
      }
      const result = this.extract(baseClass, showComment);
      if (result) {
        if (Array.isArray(result)) {
          result.forEach(i => {
            if (i instanceof Keyframes) {
              i.meta.order = 20;
              return i;
            }
            i.selector = buildSelector;
            this.markAsImportant(i, important);
          });
        } else {
          result.selector = buildSelector;
          this.markAsImportant(result, important);
        }
        const wrapped = this.wrapWithVariants(variants, result);
        if (wrapped) {
          success.push(selector);
          styleSheet.add(wrapped);
        } else {
          _hIgnored(selector);
        }
      } else {
        _hIgnored(selector);
      }
    };

    const _hGroup = (obj: Element, parentVariants: string[] = []) => {
      Array.isArray(obj.content) &&
        obj.content.forEach((u) => {
          if (u.type === 'group') {
            _hGroup(u, obj.variants);
          } else {
            // utility
            const variants = [
              ...parentVariants,
              ...obj.variants,
              ...u.variants,
            ];
            const selector = [...variants, u.content].join(':');
            typeof u.content === 'string' &&
              _gStyle(this.removePrefix(u.content), variants, selector, obj.important || u.important);
          }
        });
    };

    ast.forEach((obj) => {
      if (obj.type === 'utility') {
        if (Array.isArray(obj.content)) {
          // #functions stuff
        } else if (obj.content) {
          _gStyle(this.removePrefix(obj.content), obj.variants, obj.raw, obj.important);
        }
      } else if (obj.type === 'group') {
        _hGroup(obj);
      } else {
        _hIgnored(obj.raw);
      }
    });

    className = success.length > 0 ? className : undefined;
    if (ignoreGenerated && className) this._cache.classes.push(className);
    if (!this.config('prefixer')) styleSheet.prefixer = false;
    return {
      success,
      ignored,
      className,
      styleSheet: styleSheet.sortby(sortGroup).combine(),
    };
  }

  attributify(attrs: { [ key:string ]: string | string[] }, ignoreProcessed = false): { success: string[]; ignored: string[]; styleSheet: StyleSheet } {
    const success: string[] = [];
    const ignored: string[] = [];
    const styleSheet = new StyleSheet();
    const { prefix, disable }: { prefix?: string, disable?: string[] } = (this._config.attributify && typeof this._config.attributify === 'boolean') ? {} : this._config.attributify || {};

    const _gStyle = (
      key: string,
      value: string,
      equal = false,
      notAllow = false,
      ignoreProcessed = false,
    ) => {
      const buildSelector = `[${this.e((prefix || '') + key)}${equal?'=':'~='}"${value}"]`;
      if (notAllow || (ignoreProcessed && this._cache.attrs.includes(buildSelector))) {
        ignored.push(buildSelector);
        return;
      }
      const importantValue = value.startsWith('!');
      if (importantValue) value = value.slice(1);
      const importantKey = key.startsWith('!');
      if (importantKey) key = key.slice(1);
      const id = key.match(/\w+$/)?.[0] ?? '';
      const splits = value.split(':');
      let variants = splits.slice(0, -1);
      let utility = splits.slice(-1)[0];
      let keys = key.split(':');
      const lastKey = keys.slice(-1)[0];

      if (lastKey in this._variants && lastKey !== 'svg') {
        variants = [...keys, ...variants];
      } else if (id in this._variants && id !== 'svg') {
        // sm = ... || sm:hover = ... || sm-hover = ...
        const matches = key.match(/[@<\w]+/g);
        if (!matches) {
          ignored.push(buildSelector);
          return;
        }
        variants = [...matches, ...variants];
      } else {
        // text = ... || sm:text = ... || sm-text = ... || sm-hover-text = ...
        if (!keys) {
          ignored.push(buildSelector);
          return;
        }
        if (keys.length === 1) keys = key.split('-');
        let last;
        // handle min-h || max-w ...
        if (['min', 'max'].includes(keys.slice(-2, -1)[0])) {
          variants = [...keys.slice(0, -2), ...variants];
          last = keys.slice(-2,).join('-');
        } else {
          variants = [...keys.slice(0, -1), ...variants];
          last = keys[keys.length - 1];
        }
        // handle negative, such as m = -x-2
        const negative = utility.charAt(0) === '-';
        if (negative) utility = utility.slice(1,);
        utility = ['m', 'p'].includes(last) && ['t', 'l', 'b', 'r', 'x', 'y'].includes(utility.charAt(0)) ? last + utility : last + '-' + utility;
        if (negative) utility = '-' + utility;
        utility !== 'cursor-default' && (utility = utility.replace(/-(~|default)$/, ''));
        // handle special cases
        switch(last) {
        case 'w':
          if (['w-min', 'w-max', 'w-min-content', 'w-max-content'].includes(utility)) {
            utility = utility.slice(0, 5);
          } else if (utility.startsWith('w-min')) {
            utility = 'min-w' + utility.slice(5);
          } else if (utility.startsWith('w-max')) {
            utility = 'max-w' + utility.slice(5);
          }
          break;
        case 'h':
          if (['h-min', 'h-max', 'h-min-content', 'h-max-content'].includes(utility)) {
            utility = utility.slice(0, 5);
          } else if (utility.startsWith('h-min')) {
            utility = 'min-h' + utility.slice(5);
          } else if (utility.startsWith('h-max')) {
            utility = 'max-h' + utility.slice(5);
          }
          break;
        case 'flex':
          switch (utility) {
          case 'flex-default':
            utility = 'flex';
            break;
          case 'flex-inline':
            utility = 'inline-flex';
            break;
          }
          break;
        case 'grid':
          switch(utility) {
          case 'grid-default':
            utility = 'grid';
            break;
          case 'grid-inline':
            utility = 'inline-grid';
            break;
          default:
            if (/^grid-(auto|gap|col|row)-/.test(utility)) utility = utility.slice(5);
          }
          break;
        case 'justify':
          if (utility.startsWith('justify-content-')) {
            utility = 'justify-' + utility.slice(16);
          }
          break;
        case 'align':
          if (/^align-(items|self|content)-/.test(utility)) {
            utility = utility.slice(6);
          } else {
            utility = 'content-' + utility.slice(6);
          }
          break;
        case 'place':
          if (!/^place-(items|self|content)-/.test(utility)) {
            utility = 'place-content-' + utility.slice(6);
          }
          break;
        case 'font':
          if (/^font-(tracking|leading)-/.test(utility) || ['font-italic', 'font-not-italic', 'font-antialiased', 'font-subpixel-antialiased', 'font-normal-nums', 'font-ordinal', 'font-slashed-zero', 'font-lining-nums', 'font-oldstyle-nums', 'font-proportional-nums', 'font-tabular-nums', 'font-diagonal-fractions', 'font-stacked-fractions'].includes(utility))
            utility = utility.slice(5);
          break;
        case 'text':
          if (['text-baseline', 'text-top', 'text-middle', 'text-bottom', 'text-text-top', 'text-text-bottom'].includes(utility)) {
            utility = 'align-' + utility.slice(5);
          } else if (utility.startsWith('text-placeholder') || utility.startsWith('text-underline') || utility.startsWith('text-tab') || utility.startsWith('text-indent') || utility.startsWith('text-hyphens') || utility.startsWith('text-write')) {
            utility = utility.slice(5);
          } else if (['text-underline', 'text-line-through', 'text-no-underline', 'text-uppercase', 'text-lowercase', 'text-capitalize', 'text-normal-case', 'text-truncate', 'text-overflow-ellipsis', 'text-overflow-clip', 'text-break-normal', 'text-break-words', 'text-break-all'].includes(utility)) {
            utility = utility.slice(5);
          } else if (utility.startsWith('text-space')) {
            utility = 'white' + utility.slice(5);
          }
          break;
        case 'underline':
          if (utility === 'underline-none') {
            utility = 'no-underline';
          } else if (utility === 'underline-line-through') {
            utility = 'line-through';
          }
          break;
        case 'svg':
          if (utility.startsWith('svg-fill') || utility.startsWith('svg-stroke')) utility = utility.slice(4);
          break;
        case 'border':
          if (utility.startsWith('border-rounded')) {
            utility = utility.slice(7);
          }
          break;
        case 'gradient':
          if (utility === 'gradient-none') {
            utility = 'bg-none';
          } else if (/^gradient-to-[trbl]{1,2}$/.test(utility)) {
            utility = 'bg-' + utility;
          } else if (/^gradient-(from|via|to)-/.test(utility)) {
            utility = utility.slice(9);
          }
          break;
        case 'display':
          utility = utility.slice(8);
          break;
        case 'pos':
          utility = utility.slice(4);
          break;
        case 'position':
          utility = utility.slice(9);
          break;
        case 'box':
          if (/^box-(decoration|shadow)/.test(utility)) {
            utility = utility.slice(4,);
          }
          break;
        case 'filter':
          if (utility !== 'filter-none' && utility !== 'filter') {
            utility = utility.slice(7);
          }
          break;
        case 'backdrop':
          if (utility === 'backdrop') {
            utility = 'backdrop-filter';
          } else if (utility === 'backdrop-none') {
            utility = 'backdrop-filter-none';
          }
          break;
        case 'transition':
          if (/transition-(duration|ease|delay)-/.test(utility)) {
            utility = utility.slice(11);
          }
          break;
        case 'transform':
          if (!['transform-gpu', 'transform-none', 'transform'].includes(utility)) {
            utility = utility.slice(10);
          }
          break;
        case 'isolation':
          if (utility === 'isolation-isolate') utility = 'isolate';
          break;
        case 'table':
          if (utility === 'table-inline') {
            utility = 'inline-table';
          } else if (utility.startsWith('table-caption-') || utility.startsWith('table-empty-cells')) {
            utility = utility.slice(6);
          }
          break;
        case 'pointer':
          utility = 'pointer-events' + utility.slice(7);
          break;
        case 'resize':
          if (utility === 'resize-both') utility = 'resize';
          break;
        case 'ring':
          break;
        case 'blend':
          utility = 'mix-' + utility;
          break;
        case 'sr':
          if (utility === 'sr-not-only') utility = 'not-sr-only';
          break;
        }
      }
      const style = this.extract(utility, false);
      if (style) {
        const important = importantKey || importantValue;
        if (Array.isArray(style)) {
          style.forEach(i => {
            if (i instanceof Keyframes) return i;
            i.selector = buildSelector;
            this.markAsImportant(i, important);
          });
        } else {
          style.selector = buildSelector;
          this.markAsImportant(style, important);
        }
        const wrapped = this.wrapWithVariants(variants, style);
        if (wrapped) {
          ignoreProcessed && this._cache.attrs.push(buildSelector);
          success.push(buildSelector);
          styleSheet.add(wrapped);
        } else {
          ignored.push(buildSelector);
        }
      } else {
        ignored.push(buildSelector);
      }
    };

    // eslint-disable-next-line prefer-const
    for (let [key, value] of Object.entries(attrs)) {
      let notAllow = false;
      if (prefix) {
        if (key.startsWith(prefix)) {
          key = key.slice(prefix.length);
        } else {
          notAllow = true;
        }
      }
      if (disable?.includes(key)) notAllow = true;
      if (Array.isArray(value)) {
        value.forEach(i => _gStyle(key, i, false, notAllow, ignoreProcessed));
      } else {
        _gStyle(key, value, true, notAllow, ignoreProcessed);
      }
    }

    return {
      success,
      ignored,
      styleSheet: styleSheet.sort().combine(),
    };
  }

  loadPlugin({
    handler,
    config,
  }: PluginOutput): void {
    if (config) {
      config = this._resolveFunction(config);
      config = combineConfig(
        config as { [key: string]: unknown },
        this._config as { [key: string]: unknown }
      );
      const pluginTheme = config.theme as Record<string, ThemeType>;
      const extendTheme = pluginTheme?.extend as undefined | Record<string, ThemeType>;
      if (pluginTheme && extendTheme && typeof extendTheme === 'object') {
        for (const [key, value] of Object.entries(extendTheme)) {
          const themeValue = pluginTheme[key];
          if (themeValue && typeof themeValue === 'object') {
            pluginTheme[key] = { ...(themeValue ?? {}), ...value as { [key:string] : unknown } };
          } else if (value && typeof value === 'object' ){
            pluginTheme[key] = value as {[key:string] : unknown};
          }
        }
      }
      this._config = { ...config, theme: pluginTheme };
      this._theme = pluginTheme;
    }
    this._config = this._resolveFunction(this._config);
    this._theme = this._config.theme;
    this._variants = this.resolveVariants();
    handler(this.pluginUtils);
  }

  loadPluginWithOptions(optionsFunction: PluginWithOptions<any>, userOptions?:DictStr): void {
    const plugin = optionsFunction(userOptions ?? {});
    this.loadPlugin(plugin);
  }

  loadShortcuts(shortcuts: { [ key:string ]: Shortcut }): void {
    for (const [key, value] of Object.entries(shortcuts)) {
      const prefix = this.config('prefix', '');
      if (typeof value === 'string') {
        this._plugin.shortcuts[key] = this.compile(value, undefined, undefined, false, undefined, cssEscape(prefix + key)).styleSheet.children.map(i => i.updateMeta('components', 'shortcuts', layerOrder['shortcuts']));
      } else {
        let styles: Style[] = [];
        Style.generate('.' + cssEscape(key), value).forEach(style => {
          for (const prop of style.property) {
            if (!prop.value) continue;
            if (prop.name === '@apply') {
              styles = styles.concat(this.compile(Array.isArray(prop.value)? prop.value.join(' ') : prop.value).styleSheet.children.map(i => {
                const newStyle = deepCopy(style);
                newStyle.property = [];
                return newStyle.extend(i);
              }));
            } else {
              const newStyle = deepCopy(style);
              newStyle.property = [ prop ];
              styles.push(newStyle);
            }
          }
        });
        this._plugin.shortcuts[key] = styles.map(i => i.updateMeta('components', 'shortcuts', layerOrder['shortcuts']));
      }
    }
  }

  loadAlias(alias: { [key:string]: string }): void {
    for (const [key, value] of Object.entries(alias)) {
      this._plugin.alias[key] = new ClassParser(value, undefined, this._cache.variants).parse();
    }
  }

  config(path: string, defaultValue?: unknown): unknown {
    if (path === 'corePlugins') return this._plugin.core ? Object.keys(this._plugin.core).filter(i => this._plugin.core?.[i]) : Object.keys(pluginOrder).slice(Object.keys(pluginOrder).length/2);
    return getNestedValue(this._config, path) ?? defaultValue;
  }

  theme(path: string, defaultValue?: unknown): unknown {
    return this._theme ? getNestedValue(this._theme, path) ?? defaultValue : undefined;
  }

  corePlugins(path: string): boolean {
    if (Array.isArray(this._config.corePlugins)) {
      return (this._config.corePlugins as string[]).includes(path);
    }
    return (this.config(`corePlugins.${path}`, true) as boolean) ?? false;
  }

  variants(path: string, defaultValue: string[] = []): string[] {
    if (Array.isArray(this._config.variants)) {
      return this._config.variants;
    }
    return this.config(`variants.${path}`, defaultValue) as string[];
  }

  e(selector: string): string {
    return cssEscape(selector);
  }

  prefix(selector: string): string {
    return selector.replace(/(?=[\w])/, this._config.prefix ?? '');
  }

  addUtilities(
    utilities: DeepNestObject | DeepNestObject[],
    options: PluginUtilOptions = {
      layer: 'utilities',
      variants: [],
      respectPrefix: true,
      respectImportant: true,
    }
  ): Style[] {
    if (Array.isArray(options)) options = { variants: options };
    if (Array.isArray(utilities)) utilities = utilities.reduce((previous: {[key:string]:unknown}, current) => combineConfig(previous, current), {}) as DeepNestObject;
    let output: Style[] = [];
    const layer = options.layer ?? 'utilities';
    const order = layerOrder[layer] + 1;
    for (const [key, value] of Object.entries(utilities)) {
      const styles = Style.generate(key.startsWith('.') && options.respectPrefix ? this.prefix(key) : key, value);
      if (options.layer) styles.forEach(style => style.updateMeta(layer, 'plugin', order));
      if (options.respectImportant && this._config.important) styles.forEach(style => style.important = true);
      let className = guessClassName(key);
      if (key.charAt(0) === '@') {
        styles.forEach(style => {
          if (style.selector) className = guessClassName(style.selector);
          if (Array.isArray(className)) {
            className.filter(i => i.isClass).forEach(({ selector, pseudo }) => this._addPluginProcessorCache('utilities', selector, pseudo? style.clone('.' + cssEscape(selector)).wrapSelector(selector => selector + pseudo) : style.clone()));
            const base = className.filter(i => !i.isClass).map(i => i.selector).join(', ');
            if (base) this._addPluginProcessorCache('static', base, style.clone(base));
          } else {
            this._addPluginProcessorCache(className.isClass? 'utilities' : 'static', className.selector, className.pseudo? style.clone('.' + cssEscape(className.selector)).wrapSelector(selector => selector + (className as { pseudo: string }).pseudo) : style.clone());
          }
        });
      } else if (Array.isArray(className)) {
        className.filter(i => i.isClass).forEach(({ selector, pseudo }) => this._addPluginProcessorCache('utilities', selector, pseudo ? styles.map(i => i.clone('.' + cssEscape(selector)).wrapSelector(selector => selector + pseudo)): deepCopy(styles)));
        const base = className.filter(i => !i.isClass).map(i => i.selector).join(', ');
        if (base) this._addPluginProcessorCache('static', base, styles.map(i => i.clone(base)));
      } else {
        this._addPluginProcessorCache(className.isClass? 'utilities': 'static', className.selector, className.pseudo ? styles.map(style => style.clone('.' + cssEscape((className as { selector: string }).selector)).wrapSelector(selector => selector + (className as { pseudo: string }).pseudo)) : styles);
      }
      output = [...output, ...styles];
    }
    return output;
  }

  addDynamic(
    key: string,
    generator: UtilityGenerator,
    options: PluginUtilOptions = {
      layer: 'utilities',
      group: 'plugin',
      variants: [],
      completions: [],
      respectPrefix: true,
      respectImportant: true,
      respectSelector: false,
    }
  ): UtilityGenerator {
    const uOptions = Array.isArray(options)? { variants:options } : options;
    const layer = uOptions.layer || 'utilities';
    const group = uOptions.group || 'plugin';
    const order = uOptions.order || layerOrder[layer] + 1;
    if (uOptions.completions) this._plugin.completions[group] = group in this._plugin.completions ? [...this._plugin.completions[group], ...uOptions.completions] : uOptions.completions;
    const style = (selector: string, property?: Property | Property[], important:boolean = uOptions.respectImportant && this._config.important ? true : false) => new Style(selector, property, important);
    const prop = (name: string | string[], value?: string, comment?: string, important = uOptions.respectImportant && this._config.important ? true : false) => new Property(name, value, comment, important);
    const keyframes = (selector: string, property?: Property | Property[], important:boolean = uOptions.respectImportant && this._config.important ? true : false) => new Keyframes(selector, property, important);
    keyframes.generate = Keyframes.generate;
    style.generate = Style.generate;
    prop.parse = Property.parse;
    this._plugin.dynamic[key] = (key in this._plugin.dynamic)
      ? (Utility: Utility) => deepCopy(this._plugin.dynamic[key])(Utility) || generator({ Utility, Style: style, Property: prop, Keyframes: keyframes })
      : (Utility: Utility) => {
        const output = generator({ Utility, Style: style, Property: prop, Keyframes: keyframes });
        if (!output) return;
        if (Array.isArray(output)) return output.map(i => i.updateMeta(layer, group, order, 0, false, i.meta.respectSelector || uOptions.respectSelector));
        return output.updateMeta(layer, group, order, 0, false, output.meta.respectSelector || uOptions.respectSelector);
      };
    return generator;
  }

  addComponents(
    components: DeepNestObject | DeepNestObject[],
    options: PluginUtilOptions = { layer: 'components', variants: [], respectPrefix: false }
  ): Style[] {
    if (Array.isArray(options)) options = { variants: options };
    if (Array.isArray(components)) components = components.reduce((previous: {[key:string]:unknown}, current) => combineConfig(previous, current), {}) as DeepNestObject;
    let output: Style[] = [];
    const layer = options.layer ?? 'components';
    const order = layerOrder[layer] + 1;
    for (const [key, value] of Object.entries(components)) {
      const styles = Style.generate(key.startsWith('.') && options.respectPrefix ? this.prefix(key): key, value);
      styles.forEach(style => style.updateMeta(layer, 'plugin', order));
      if (options.respectImportant && this._config.important) styles.forEach(style => style.important = true);
      let className = guessClassName(key);
      if (key.charAt(0) === '@') {
        styles.forEach(style => {
          if (style.selector) className = guessClassName(style.selector);
          if (Array.isArray(className)) {
            className.filter(i => i.isClass).forEach(({ selector, pseudo }) => this._addPluginProcessorCache('components', selector, pseudo? style.clone('.' + cssEscape(selector)).wrapSelector(selector => selector + pseudo) : style.clone()));
            const base = className.filter(i => !i.isClass).map(i => i.selector).join(', ');
            if (base) this._addPluginProcessorCache('static', base, style.clone(base));
          } else {
            this._addPluginProcessorCache(className.isClass? 'components' : 'static', className.selector, className.pseudo? style.clone('.' + cssEscape(className.selector)).wrapSelector(selector => selector + (className as { pseudo: string }).pseudo) : style.clone());
          }
        });
      } else if (Array.isArray(className)) {
        // one of the selector are not class, treat the entire as static to avoid duplication
        if (className.some(i => !i.isClass)) {
          const base = className.map(i => i.selector).join(', ');
          if (base) this._addPluginProcessorCache('static', base, styles.map(i => i.clone(base)));
        }
        // class
        else {
          className.forEach(({ selector, pseudo }) => this._addPluginProcessorCache('components', selector, pseudo ? styles.map(i => i.clone('.' + cssEscape(selector)).wrapSelector(selector => selector + pseudo)): deepCopy(styles)));
        }
      } else {
        this._addPluginProcessorCache(className.isClass? 'components': 'static', className.selector, className.pseudo ? styles.map(style => style.clone('.' + cssEscape((className as { selector: string }).selector)).wrapSelector(selector => selector + (className as { pseudo: string }).pseudo)) : styles);
      }
      output = [...output, ...styles];
    }
    return output;
  }

  addBase(baseStyles: DeepNestObject): Style[] {
    let output: Style[] = [];
    for (const [key, value] of Object.entries(baseStyles)) {
      const styles = Style.generate(key, value).map(i => i.updateMeta('base', 'plugin', 10));
      this._replaceStyleVariants(styles);
      this._addPluginProcessorCache('preflights', key, styles);
      output = [...output, ...styles];
    }
    return output;
  }

  addVariant(
    name: string,
    generator: VariantGenerator,
  ): Style | Style[] {
    // name && generator && options;
    const style = generator({
      ...this.variantUtils,
      separator: this.config('separator', ':') as string,
      style: new Style(),
    });
    this._variants[name] = () => style;
    this._cache.variants.push(name);
    return style;
  }

  dumpConfig(): string {
    const processor = new Processor();
    const diff = diffConfig(processor._config, this._config) as Config;
    let output = { theme: { extend: {} }, plugins: [] } as {[key:string]:any};
    if (diff.theme) {
      for (const [key, value] of Object.entries(diff.theme)) {
        if (key !== 'extend') {
          (output.theme.extend as {[key:string]:unknown})[key] = value;
        }
      }
      delete diff.theme;
    }
    if (diff.plugins) {
      for (const plugin of diff.plugins) {
        if ('config' in plugin) {
          delete plugin.config;
        }
        output.plugins.push(plugin);
      }
      delete diff.plugins;
    }
    output = { ...diff, ...output };

    return `module.exports = ${toSource(output)}`;
  }
}
