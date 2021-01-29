import { resolve } from "path";
import { getNestedValue, escape, hash, deepCopy } from "../utils/tools";
import { negative, breakpoints } from "../utils/helpers";
import { Style, StyleSheet } from "../utils/style";
import { ClassParser } from "../utils/parser";
import { resolveVariants } from "./variants";

import extract from "./extract";
import preflight from "./preflight";
import baseConfig from "../config/base";

import type {
  Config,
  DefaultConfig,
  ConfigUtil,
  Theme,
  DefaultTheme,
  AnyObject,
  Element,
} from "../interfaces";

export class Processor {
  private _config: Config;
  private _theme: Config["theme"];
  private _variants: { [key: string]: () => Style } = {};
  private _screens: { [key: string]: () => Style } = {};
  private _states: { [key: string]: () => Style } = {};
  private _themes: { [key: string]: () => Style } = {};
  private _processedUtilities: string[] = [];
  private _processedTags: string[] = [];
  private _generatedClasses: string[] = [];

  constructor(config?: string | Config) {
    this._config = this.resolveConfig(config);
    this._theme = this._config.theme;
  }

  private _resolveConfig(userConfig: Config) {
    const presets = userConfig.presets
      ? this._resolvePresets(userConfig.presets)
      : baseConfig;
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
      config = { ...config, ...this._resolveConfig(p) };
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

  resolveConfig(config: string | Config | undefined): Config {
    this._config = this._resolveConfig(
      deepCopy(
        config
          ? typeof config === "string"
            ? require(resolve(config))
            : config
          : {}
      )
    ); // deep copy
    this._theme = this._config.theme; // update theme to make sure theme() function works.
    this._config = this._resolveFunction(this._config);
    this._variants = this.resolveVariants(undefined, true);
    return this._config;
  }

  resolveVariants(
    type?: "screen" | "theme" | "state",
    recreate = false
  ): { [key: string]: () => Style } {
    if (recreate) {
      const variants = resolveVariants(this._config);
      this._screens = variants.screen;
      this._themes = variants.theme;
      this._states = variants.state;
    }
    switch (type) {
      case "screen":
        return this._screens;
      case "theme":
        return this._themes;
      case "state":
        return this._states;
      default:
        return { ...this._screens, ...this._themes, ...this._states };
    }
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
    return styles.map((style) => {
      return variants
        .map((i) => this._variants[i]())
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
    const theme = (path: string, defaultValue?: unknown) =>
      this.theme(path, defaultValue);
    return extract(theme, className, addComment);
  }

  preflight(
    tags?: string[],
    global = true,
    ignoreProcessed = false
  ): StyleSheet {
    if (ignoreProcessed && tags)
      tags = tags.filter((i) => !this._processedTags.includes(i));
    const theme = (path: string, defaultValue?: unknown) =>
      this.theme(path, defaultValue);
    this._processedTags = [...this._processedTags, ...(tags ?? [])];
    return preflight(theme, tags, global);
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
          result.selector = "." + selector;
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
      if (!(ignoreProcessed && this._processedUtilities.includes(obj.raw))) {
        this._processedUtilities.push(obj.raw);
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
    if (ignoreGenerated && this._generatedClasses.includes(className))
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
    if (className) this._generatedClasses.push(className);
    return {
      success,
      ignored,
      className,
      styleSheet,
    };
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

  variants(path: string, defaultValue?: unknown): unknown {
    if (Array.isArray(this._config.variants)) {
      return this._config.variants;
    }
    return this.config(`variants.${path}`, defaultValue);
  }

  e(selector: string): string {
    return escape(selector);
  }

  prefix(selector: string): string {
    return selector.replace(/(?=[\w])/, this._config.prefix ?? "");
  }

  addUtilities(
    utilities: { [key: string]: { [key: string]: string } },
    options: string[] | AnyObject = []
  ): void {
    options && utilities;
    return;
  }

  addComponents(
    components: { [key: string]: string | { [key: string]: string } },
    options: string[] | AnyObject = []
  ): void {
    options && components;
    return;
  }

  addBase(baseStyles: {
    [key: string]: string | { [key: string]: string };
  }): void {
    baseStyles;
    return;
  }

  addVariant(
    name: string,
    generator: (selector: string) => Style,
    options = {}
  ): void {
    name && generator && options;
    return;
  }
}
