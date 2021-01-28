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
  Theme,
  AnyObject,
  GenericNestObject,
  AnyValue,
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
    const extendTheme: { [key: string]: Theme } = userTheme?.extend ?? {};
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
    const theme = (path: string, defaultValue?: any) =>
      this.theme(path, defaultValue);
    for (const [key, value] of Object.entries(config.theme)) {
      if (typeof value === "function") {
        config.theme[key] = value(theme, { negative, breakpoints });
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

  resolveConfig(config: string | Config | undefined) {
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

  resolveVariants(type?: "screen" | "theme" | "state", recreate = false) {
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

  extract(className: string, addComment = false) {
    const theme = (path: string, defaultValue?: any) =>
      this.theme(path, defaultValue);
    return extract(theme, className, addComment);
  }

  preflight(tags?: string[], global = true, ignoreProcessed = false) {
    if (ignoreProcessed && tags)
      tags = tags.filter((i) => !this._processedTags.includes(i));
    const theme = (path: string, defaultValue?: any) =>
      this.theme(path, defaultValue);
    this._processedTags = [...this._processedTags, ...(tags ?? [])];
    return preflight(theme, tags, global);
  }

  interpret(classNames: string, ignoreProcessed = false) {
    // Interpret tailwind class then generate raw tailwind css.
    const ast = new ClassParser(classNames).parse();
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
        if (result instanceof Style) result.selector = "." + selector;
        styleSheet.add(this.wrapWithVariants(variants, result));
      } else {
        ignored.push(selector);
      }
    };

    const _hGroup = (
      obj: { [key: string]: any },
      parentVariants: string[] = []
    ) => {
      obj.content.forEach((u: { [key: string]: any }) => {
        if (u.type === "group") {
          _hGroup(u, obj.variants);
        } else {
          // utility
          const variants = [...parentVariants, ...obj.variants, ...u.variants];
          const selector = [...variants, u.content].join(":");
          _gStyle(u.content, variants, selector);
        }
      });
    };

    ast.forEach((obj:any) => {
      if (!(ignoreProcessed && this._processedUtilities.includes(obj.raw))) {
        this._processedUtilities.push(obj.raw);
        if (obj.type === "utility") {
          if (Array.isArray(obj.content)) {
            // #functions stuff
          } else {
            _gStyle(obj.content, obj.variants, obj.raw);
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
  ) {
    // Compile tailwind css classes to one combined class.
    const ast = new ClassParser(classNames).parse();
    const success: string[] = [];
    const ignored: string[] = [];
    const styleSheet = new StyleSheet();
    let className: string | undefined =
      prefix +
      hash(
        JSON.stringify(
          ast.sort(
            (a: { [key: string]: any }, b: { [key: string]: any }) =>
              a.raw - b.raw
          )
        )
      );
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
          });
        } else {
          result.selector = buildSelector;
        }
        styleSheet.add(this.wrapWithVariants(variants, result));
      } else {
        ignored.push(selector);
      }
    };

    const _hGroup = (
      obj: { [key: string]: any },
      parentVariants: string[] = []
    ) => {
      obj.content.forEach((u: { [key: string]: any }) => {
        if (u.type === "group") {
          _hGroup(u, obj.variants);
        } else {
          // utility
          const variants = [...parentVariants, ...obj.variants, ...u.variants];
          const selector = [...variants, u.content].join(":");
          _gStyle(u.content, variants, selector);
        }
      });
    };

    ast.forEach((obj:any) => {
      if (obj.type === "utility") {
        if (Array.isArray(obj.content)) {
          // #functions stuff
        } else {
          _gStyle(obj.content, obj.variants, obj.raw);
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
  config<T>(path: string, defaultValue?: T): T | undefined {
    return getNestedValue(this._config, path) ?? defaultValue;
  }

  theme(path: string, defaultValue?: any): any {
    return this._theme
      ? getNestedValue(this._theme, path) ?? defaultValue
      : undefined;
  }

  corePlugins(path: string) {
    if (Array.isArray(this._config.corePlugins)) {
      return this._config.corePlugins.includes(path);
    }
    return this.config(`corePlugins.${path}`, true);
  }

  variants(path: string, defaultValue?: any) {
    if (Array.isArray(this._config.variants)) {
      return this._config.variants;
    }
    return this.config(`variants.${path}`, defaultValue);
  }

  e(selector: string) {
    return escape(selector);
  }

  prefix(selector: string) {
    return selector.replace(/(?=[\w])/, this._config.prefix ?? "");
  }

  addUtilities(
    utilities: { [key: string]: { [key: string]: string } },
    options: string[] | AnyObject = []
  ): undefined {
    return;
  }

  addComponents(
    components: { [key: string]: string | { [key: string]: string } },
    options: string[] | AnyObject = []
  ) {
    return;
  }

  addBase(baseStyles: { [key: string]: string | { [key: string]: string } }) {
    return;
  }

  addVariant(
    name: string,
    generator: (selector: string) => Style,
    options = {}
  ) {
    return;
  }
}
