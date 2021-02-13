import { getNestedValue, hash, deepCopy } from "../utils/tools";
import { negative, breakpoints } from "../utils/helpers";
import { Property, Style, StyleSheet } from "../utils/style";
import { resolveVariants } from "./variants";
import { staticUtilities, dynamicUtilities } from "./utilities";

import extract, { generateStaticStyle } from "./extract";
import preflight from "./preflight";
import baseConfig from "../config/base";
import cssEscape from "../utils/algorithm/cssEscape";
import combineConfig from "../utils/algorithm/combineConfig";
import ClassParser from "../utils/parser/class";

import type {
  Config,
  DictStr,
  DefaultConfig,
  DynamicUtility,
  ConfigUtil,
  Theme,
  DefaultTheme,
  Output,
  Element,
  PluginUtils,
  PluginUtilOptions,
  PluginOutput,
  PluginWithOptionsOutput,
  DeepNestObject,
  UtilityGenerator,
  VariantGenerator,
} from "../interfaces";

import type { Utility } from "./utilities/handler";

export class Processor {
  private _config: Config;
  private _theme: Config["theme"];
  private _variants: { [key: string]: () => Style } = {};
  private _cache: {
    html: string[];
    classes: string[];
    utilities: string[];
  } = {
    html: [],
    classes: [],
    utilities: [],
  };
  readonly _plugin: {
    dynamic: { [key: string]: ((utility: Utility) => Output)};
    utilities: { [key: string]: Style[] };
    components: { [key: string]: Style[] };
    preflights: { [key: string]: Style[] };
    variants: { [key: string]: () => Style };
  } = {
    dynamic: {},
    utilities: {},
    components: {},
    preflights: {},
    variants: {},
  };

  public pluginUtils: PluginUtils = {
    addDynamic: (
      key: string,
      generator: UtilityGenerator,
      options?: PluginUtilOptions
    ) => this.addDynamic(key, generator, options),
    addUtilities: (utilities: DeepNestObject, options?: PluginUtilOptions) =>
      this.addUtilities(utilities, options),
    addComponents: (components: DeepNestObject | DeepNestObject[], options?: PluginUtilOptions) =>
      this.addComponents(components, options),
    addBase: (baseStyles: DeepNestObject) => this.addBase(baseStyles),
    addVariant: (
      name: string,
      generator: VariantGenerator
    ) => this.addVariant(name, generator),
    e: (selector: string) => this.e(selector),
    prefix: (selector: string) => this.prefix(selector),
    config: (path: string, defaultValue?: unknown) =>
      this.config(path, defaultValue),
    theme: (path: string, defaultValue?: unknown) =>
      this.theme(path, defaultValue),
    variants: (path: string, defaultValue?: string[]) =>
      this.variants(path, defaultValue),
  };

  public variantUtils = {
    modifySelectors: (
      modifier: ({ className }: { className: string }) => string
    ): Style =>
      new Style().wrapSelector((selector: string) =>
        modifier({
          className: /^[.#]/.test(selector) ? selector.substring(1) : selector,
        })
      ),
    atRule: (name: string): Style => new Style().atRule(name),
    pseudoClass: (name: string): Style => new Style().pseudoClass(name),
    pseudoElement: (name: string): Style => new Style().pseudoElement(name),
    parent: (name: string): Style => new Style().parent(name),
    child: (name: string): Style => new Style().child(name),
  };

  constructor(config?: Config) {
    this._config = this.resolveConfig(config, baseConfig);
    this._theme = this._config.theme;
  }

  private _resolveConfig(userConfig: Config, presets: Config) {
    if (userConfig.presets) presets = this._resolvePresets(userConfig.presets);
    const userTheme = userConfig.theme;
    if (userTheme) delete userConfig.theme;
    const extendTheme = userTheme?.extend ?? ({} as { [key: string]: Theme });
    if (userTheme && extendTheme) delete userTheme.extend;
    const theme: Theme = { ...presets.theme, ...userTheme };
    for (const [key, value] of Object.entries(extendTheme)) {
      theme[key] = { ...(theme[key] ?? {}), ...value };
    }
    return { ...presets, ...userConfig, theme };
  }

  private _resolvePresets(presets: Config[]) {
    let config: Config = {};
    presets.forEach((p) => {
      config = this._resolveConfig(config, p);
    });
    return config;
  }

  private _resolveFunction(config: Config) {
    if (!config.theme) return config;
    const theme = (path: string, defaultValue?: unknown) =>
      this.theme(path, defaultValue);
    for (const [key, value] of Object.entries(config.theme)) {
      if (typeof value === "function") {
        config.theme[key] = value(theme, {
          negative,
          breakpoints,
        }) as ConfigUtil;
      }
    }
    return config;
  }

  private _resolveCorePlugins() {
    // not support yet
  }

  private _resolvePlugins() {
    // not support yet
  }

  private _replaceStyleVariants(styles: Style[]) {
    // @screen sm -> @screen (min-width: 640px)
    styles.forEach(style => {
      style.atRules = style.atRules?.map(i => {
        if (i.match(/@screen/)) {
          const variant = i.replace(/\s*@screen\s*/, "");
          const atRule = this._variants[variant]().atRules?.[0];
          return atRule ?? i;
        }
        return i;
      })
    })
  }

  resolveConfig(config: Config | undefined, presets: Config): Config {
    this._config = this._resolveConfig(deepCopy(config ? config : {}), presets); // deep copy
    this._theme = this._config.theme; // update theme to make sure theme() function works.
    this._config = this._resolveFunction(this._config);
    this._config.plugins?.map(i => i.__isOptionsFunction ? this.loadPluginWithOptions(i) : this.loadPlugin(i) );
    this._variants = this.resolveVariants();
    return this._config;
  }

  resolveVariants(
    type?: "screen" | "theme" | "state"
  ): { [key: string]: () => Style } {
    const variants = resolveVariants(this._config);
    if (type) {
      return variants[type];
    }
    return { ...variants.screen, ...variants.theme, ...variants.state };
  }

  resolveStaticUtilities(includePlugins = false): { [key: string]: Style[] } {
    const staticStyles: { [key: string]: Style[] } = {};
    for (const key in staticUtilities) {
      staticStyles[key] = [generateStaticStyle(key, true)];
    }
    if (!includePlugins) return staticStyles;
    return {...staticStyles, ...this._plugin.utilities, ...this._plugin.components};
  }

  resolveDynamicUtilities(includePlugins = false): DynamicUtility {
    if (!includePlugins) return dynamicUtilities;
    return {...dynamicUtilities, ...this._plugin.dynamic};
  }

  get allConfig(): DefaultConfig {
    return this._config as DefaultConfig;
  }

  get allTheme(): DefaultTheme {
    return (this._theme ?? {}) as DefaultTheme;
  }

  wrapWithVariants(variants: string[], styles: Style | Style[]): Style[] {
    // apply variant to style
    if (!Array.isArray(styles)) styles = [styles];
    if (variants.length === 0) return styles;
    const allVariants = { ...this._variants, ...this._plugin.variants };
    return styles.map((style) => {
      return variants
        .filter((i) => i in allVariants)
        .map((i) => allVariants[i]())
        .reduce((previousValue: Style, currentValue: Style) => {
          return previousValue.extend(currentValue);
        }, new Style())
        .extend(style);
    });
  }

  removePrefix(className: string): string {
    const prefix = this.config("prefix") as string | undefined;
    return prefix ? className.replace(new RegExp(`^${prefix}`), "") : className;
  }

  markAsImportant(style: Style, force: boolean | string = false): Style {
    const _important = force ? force : this.config("important", false);
    const important =
      typeof _important === "string"
        ? (_important as string)
        : (_important as boolean);
    if (important) {
      if (typeof important === "string") {
        style.parent(important);
      } else {
        style.important = true;
      }
    }
    return style;
  }

  extract(className: string, addComment = false): Style | Style[] | undefined {
    return extract(this, className, addComment);
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
      if (ignoreProcessed && this._cache.html.includes(id))
        return new StyleSheet();
    }
    id && this._cache.html.push(id);
    return preflight(this, html, includeBase, includeGlobal, includePlugins);
  }

  interpret(
    classNames: string,
    ignoreProcessed = false
  ): { success: string[]; ignored: string[]; styleSheet: StyleSheet } {
    // Interpret tailwind class then generate raw tailwind css.
    const ast = new ClassParser(
      classNames,
      this.config("separator", ":") as string
    ).parse();
    const success: string[] = [];
    const ignored: string[] = [];
    const styleSheet = new StyleSheet();

    const _gStyle = (
      baseClass: string,
      variants: string[],
      selector: string
    ) => {
      const result = this.extract(baseClass);
      if (result) {
        success.push(selector);
        if (result instanceof Style) {
          result.selector = "." + cssEscape(selector);
          this.markAsImportant(result);
        }
        if (Array.isArray(result))
          result.forEach((i) => this.markAsImportant(i));
        styleSheet.add(this.wrapWithVariants(variants, result));
      } else {
        ignored.push(selector);
      }
    };

    const _hGroup = (obj: Element, parentVariants: string[] = []) => {
      Array.isArray(obj.content) &&
        obj.content.forEach((u: Element) => {
          if (u.type === "group") {
            _hGroup(u, obj.variants);
          } else {
            // utility
            const variants = [
              ...parentVariants,
              ...obj.variants,
              ...u.variants,
            ];
            const selector = [...variants, u.content].join(":");
            typeof u.content === "string" &&
              _gStyle(this.removePrefix(u.content), variants, selector);
          }
        });
    };

    ast.forEach((obj) => {
      if (!(ignoreProcessed && this._cache.utilities.includes(obj.raw))) {
        this._cache.utilities.push(obj.raw);
        if (obj.type === "utility") {
          if (Array.isArray(obj.content)) {
            // #functions stuff
          } else if (obj.content) {
            _gStyle(this.removePrefix(obj.content), obj.variants, obj.raw);
          }
        } else if (obj.type === "group") {
          _hGroup(obj);
        } else {
          ignored.push(obj.raw);
        }
      }
    });

    return {
      success,
      ignored,
      styleSheet, //.sort()
    };
  }

  compile(
    classNames: string,
    prefix = "windi-",
    showComment = false,
    ignoreGenerated = false
  ): {
    success: string[];
    ignored: string[];
    className?: string;
    styleSheet: StyleSheet;
  } {
    // Compile tailwind css classes to one combined class.
    const ast = new ClassParser(
      classNames,
      this.config("separator", ":") as string
    ).parse();
    const success: string[] = [];
    const ignored: string[] = [];
    const styleSheet = new StyleSheet();
    let className: string | undefined =
      prefix +
      hash(JSON.stringify([...ast].sort((a, b) => (a.raw > b.raw ? 1 : -1))));
    if (ignoreGenerated && this._cache.classes.includes(className))
      return { success, ignored, styleSheet, className };
    const buildSelector = "." + className;

    const _gStyle = (
      baseClass: string,
      variants: string[],
      selector: string
    ) => {
      const result = this.extract(baseClass, showComment);
      if (result) {
        success.push(selector);
        if (Array.isArray(result)) {
          result.forEach((i) => {
            i.selector = buildSelector;
            this.markAsImportant(i);
          });
        } else {
          result.selector = buildSelector;
          this.markAsImportant(result);
        }
        styleSheet.add(this.wrapWithVariants(variants, result));
      } else {
        ignored.push(selector);
      }
    };

    const _hGroup = (obj: Element, parentVariants: string[] = []) => {
      Array.isArray(obj.content) &&
        obj.content.forEach((u) => {
          if (u.type === "group") {
            _hGroup(u, obj.variants);
          } else {
            // utility
            const variants = [
              ...parentVariants,
              ...obj.variants,
              ...u.variants,
            ];
            const selector = [...variants, u.content].join(":");
            typeof u.content === "string" &&
              _gStyle(this.removePrefix(u.content), variants, selector);
          }
        });
    };

    ast.forEach((obj) => {
      if (obj.type === "utility") {
        if (Array.isArray(obj.content)) {
          // #functions stuff
        } else if (obj.content) {
          _gStyle(this.removePrefix(obj.content), obj.variants, obj.raw);
        }
      } else if (obj.type === "group") {
        _hGroup(obj);
      } else {
        ignored.push(obj.raw);
      }
    });

    className = success.length > 0 ? className : undefined;
    if (className) this._cache.classes.push(className);
    return {
      success,
      ignored,
      className,
      styleSheet,
    };
  }

  loadPlugin({
    handler,
    config,
  }: PluginOutput): void {
    if (config) {
      config = this._resolveFunction(config);
      this._config = combineConfig(
        config as { [key: string]: unknown },
        this._config as { [key: string]: unknown }
      );
      this._theme = this._config.theme;
      this._variants = this.resolveVariants();
    }
    handler(this.pluginUtils);
  }

  loadPluginWithOptions(optionsFunction: PluginWithOptionsOutput, userOptions?:DictStr): void {
    const plugin = optionsFunction(userOptions ?? {});
    this.loadPlugin(plugin);
  }

  // tailwind interfaces
  config(path: string, defaultValue?: unknown): unknown {
    return getNestedValue(this._config, path) ?? defaultValue;
  }

  theme(path: string, defaultValue?: unknown): unknown {
    return this._theme
      ? getNestedValue(this._theme, path) ?? defaultValue
      : undefined;
  }

  corePlugins(path: string): boolean {
    if (Array.isArray(this._config.corePlugins)) {
      return this._config.corePlugins.includes(path);
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
    return selector.replace(/(?=[\w])/, this._config.prefix ?? "");
  }

  addUtilities(
    utilities: DeepNestObject,
    options: PluginUtilOptions = {
      variants: [],
      respectPrefix: true,
      respectImportant: true,
    }
  ): Style[] {
    if (Array.isArray(options)) options = { variants: options };
    let output: Style[] = [];
    for (const [key, value] of Object.entries(utilities)) {
      const styles = Style.generate(options.respectPrefix?this.prefix(key):key, value);
      if (options.respectImportant && this._config.important) styles.forEach(style => style.important = true);
      output = [...output, ...styles];
      this._plugin.utilities[key] = styles;
    }
    return output;
  }

  addDynamic(
    key: string,
    generator: UtilityGenerator,
    options: PluginUtilOptions = {
      variants: [],
      respectPrefix: true,
      respectImportant: true,
    }
  ): UtilityGenerator {
    const uOptions = Array.isArray(options)? { variants:options } : options;
    const style = (
      selector: string,
      property?: Property | Property[],
      important:boolean = uOptions.respectImportant && this._config.important ? true : false
    ) => new Style(selector, property, important);
    const prop = (
      name: string | string[],
      value?: string,
      comment?: string,
      important = uOptions.respectImportant && this._config.important ? true : false
    ) => new Property(name, value, comment, important);
    style.generate = Style.generate;
    prop.parse = Property.parse;
    if (key in this._plugin.dynamic) {
      // handle duplicated key;
      this._plugin.dynamic[key] = (Utility: Utility) => deepCopy(this._plugin.dynamic[key])(Utility) || generator({ Utility, Style: style, Property: prop });
    } else {
      this._plugin.dynamic[key] = (Utility: Utility) => generator({ Utility, Style: style, Property: prop });
    }
    return generator;
  }

  addComponents(
    components: DeepNestObject | DeepNestObject[],
    options: PluginUtilOptions = { variants: [], respectPrefix: false }
  ): Style[] {
    if (Array.isArray(options)) options = { variants: options };
    let output: Style[] = [];
    if (Array.isArray(components)) {
      components = components.reduce((previous: {[key:string]:unknown}, current) => {
        return combineConfig(previous, current);
      }, {}) as DeepNestObject;
    }
    for (const [key, value] of Object.entries(components)) {
      const pkey = options.respectPrefix ? this.prefix(key): key;
      const styles = Style.generate(pkey, value);
      this._replaceStyleVariants(styles);
      output = [...output, ...styles];
      this._plugin.components[pkey] = styles;
    }
    return output;
  }

  addBase(baseStyles: DeepNestObject): Style[] {
    let output: Style[] = [];
    for (const [key, value] of Object.entries(baseStyles)) {
      const styles = Style.generate(key, value);
      this._replaceStyleVariants(styles);
      output = [...output, ...styles];
      this._plugin.preflights[key] = styles;
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
      separator: this.config("separator", ":") as string,
      style: new Style(),
    });
    this._plugin.variants[name] = () => style;
    return style;
  }
}
