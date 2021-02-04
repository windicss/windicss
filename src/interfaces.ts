import type { Utility } from "./lib/utilities/handler";

import type { Property, Style, InlineAtRule } from "./utils/style";

export type DictStr = { [key: string]: string };

export type NestObject = { [key: string]: string | string[] |NestObject };

export type DeepNestObject = { [key: string]: NestObject };

export type GenericNestObject<T> = { [key: string]: T | GenericNestObject<T> };

export type AnyObject = Record<string, unknown>;

export type AnyValue<T> = T;

export type Output = Property | Style | Style[] | undefined;

export type FontSize = [
  fontSize?: string,
  options?: { letterSpacing?: string; lineHeight?: string }
];

export type DefaultFontSize = [
  fontSize: string,
  options: { letterSpacing?: string; lineHeight: string }
];

export type ThemeUtil = (path: string, defaultValue?: unknown) => unknown;

export type ConfigUtil = (
  theme: ThemeUtil,
  {
    negative,
    breakpoints,
  }: {
    negative: (config: DictStr) => DictStr;
    breakpoints: (config: DictStr) => DictStr;
  }
) => unknown;

export type PluginUtilOptions =
  | string[]
  | {
      variants?: string[];
      respectPrefix?: boolean;
      respectImportant?: boolean;
    };

export type withOptions = (
  pluginFunction: (options: DictStr) => ((utils: PluginUtils) => void),
  configFunction?: (options: DictStr) => Config,
) => PluginWithOptionsOutput;

export interface Plugin {
  (handler: (utils: PluginUtils) => void, config?: Config): PluginOutput;
  withOptions: withOptions;
}

export interface PluginOutput {
  handler: (utils: PluginUtils) => void;
  config?: Config;
  __isOptionsFunction?: false;
}

export interface PluginWithOptionsOutput {
  (options: DictStr): {
    __options: DictStr;
    handler: ((utils: PluginUtils) => void);
    config: Config;
  };
  __isOptionsFunction: true;
  __pluginFunction: (options: DictStr) => ((utils: PluginUtils) => void);
  __configFunction: (options: DictStr) => Config;
}

export interface Theme {
  [key: string]: ConfigUtil | { [key: string]: unknown } | undefined;
}

export interface Config {
  presets?: Config[];
  separator?: string;
  important?: boolean | string;
  darkMode?: "media" | "class" | false;
  theme?: Theme;
  variantOrder?: string[];
  variants?: { [key: string]: string[] };
  plugins?: (PluginOutput|PluginWithOptionsOutput)[];
  corePlugins?: string[];
  prefix?: string;
}

export interface DefaultTheme {
  colors: { [key: string]: string | { [key: string]: string } };
  container: { [key: string]: string | { [key: string]: string } };
  fontFamily: { [key: string]: string[] };
  fontSize: { [key: string]: DefaultFontSize };
  keyframes: { [key: string]: { [key: string]: string } };
  outline: { [key: string]: [outline: string, outlineOffset: string] };
}

export interface DefaultTheme {
  [key: string]:
    | DictStr
    | { [key: string]: string | { [key: string]: string } }
    | { [key: string]: string[] }
    | { [key: string]: DefaultFontSize };
}

export interface DefaultConfig {
  presets: string[];
  darkMode: "class" | "media" | false;
  theme: DefaultTheme;
  variantOrder: string[];
  variants: { [key: string]: string[] };
  plugins: (PluginOutput|PluginWithOptionsOutput)[];
}

export interface StaticUtility {
  [key: string]: { [key: string]: string | string[] };
}

export interface PluginUtils {
  addDynamic: (key: string, generator: UtilityGenerator, options?: PluginUtilOptions) => UtilityGenerator;
  addUtilities: (
    utilities: DeepNestObject,
    options?: PluginUtilOptions
  ) => Style[];
  addComponents: (
    components: DeepNestObject | DeepNestObject[],
    options?: PluginUtilOptions
  ) => Style[];
  addBase: (baseStyles: DeepNestObject) => Style[];
  addVariant: (
    name: string,
    generator: VariantGenerator,
    options?: NestObject
  ) => Style | Style[];
  e: (selector: string) => string;
  prefix: (selector: string) => string;
  theme: (path: string, defaultValue?: unknown) => unknown;
  variants: (path: string, defaultValue?: string[]) => string[];
  config: (path: string, defaultValue?: unknown) => unknown;
}

export type VariantGenerator = (generator: {
  modifySelectors: (
    modifier: ({ className }: { className: string }) => string
  ) => Style;
  atRule: (name: string) => Style;
  pseudoClass: (name: string) => Style;
  pseudoElement: (name: string) => Style;
  parent: (name: string) => Style;
  child: (name: string) => Style;
  separator: string;
  style: Style;
}) => Style | Style[];

export type UtilityGenerator = (generator: {
  Utility: Utility;
  Style: {
    (
      selector: string,
      property?: Property | Property[] | undefined,
      important?: boolean
    ): Style;
    generate: (
      parent?: string | undefined,
      property?: NestObject | undefined,
      root?: Style | undefined
    ) => Style[];
  };
  Property: {
    (
      name: string | string[],
      value?: string | undefined,
      comment?: string | undefined,
      important?: boolean
    ): Property;
    parse: (
      css: string
    ) => Property | InlineAtRule | (Property | InlineAtRule)[] | undefined;
  };
}) => Output;

export interface Element {
  raw: string;
  variants: string[];
  content?: Element[] | string;
  func?: string;
  type: "group" | "func" | "utility";
}
