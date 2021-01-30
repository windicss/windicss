import type { Style } from "./utils/style";

export type DictStr = { [key: string]: string };

export type NestObject = { [key: string]: string | NestObject };

export type DeepNestObject = { [key: string]: NestObject };

export type GenericNestObject<T> = { [key: string]: T | GenericNestObject<T> };

export type AnyObject = Record<string, unknown>;

export type AnyValue<T> = T;

export type FontSize = [
  fontSize?: string,
  options?: { letterSpacing?: string; lineHeight?: string }
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
  pluginFunction: (options: DictStr) => NestObject,
  configFunction?: (options: DictStr) => NestObject
) => {
  (options: DictStr): {
    __options: DictStr;
    handler: NestObject;
    config: NestObject;
  };
  __isOptionsFunction: boolean;
  __pluginFunction: (options: DictStr) => NestObject;
  __configFunction: (options: DictStr) => NestObject;
};

export interface Plugin {
  (handler: (utils: PluginUtils) => void, config?: Config): {
    handler: (utils: PluginUtils) => void;
    config?: Config;
  };
  withOptions: withOptions;
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
  plugins?: Plugin[];
  corePlugins?: string[];
  prefix?: string;
}

export interface DefaultTheme {
  colors: { [key: string]: string | { [key: string]: string } };
  container: { [key: string]: string | { [key: string]: string } };
  fontFamily: { [key: string]: string[] };
  fontSize: { [key: string]: FontSize };
  keyframes: { [key: string]: { [key: string]: string } };
  outline: { [key: string]: [outline: string, outlineOffset: string] };
}

export interface DefaultTheme {
  [key: string]:
    | DictStr
    | { [key: string]: string | { [key: string]: string } }
    | { [key: string]: string[] }
    | { [key: string]: FontSize };
}

export interface DefaultConfig {
  presets: string[];
  darkMode: "class" | "media" | false;
  theme: DefaultTheme;
  variantOrder: string[];
  variants: { [key: string]: string[] };
  plugins: Plugin[];
}

export interface StaticUtility {
  [key: string]: { [key: string]: string | string[] };
}

export interface PluginUtils {
  addUtilities: (utilities: DeepNestObject, options?: PluginUtilOptions) => Style[];
  addComponents: (components: DeepNestObject, options?: PluginUtilOptions) => Style[];
  addBase: (baseStyles: DeepNestObject) => Style[];
  addVariant: (
    name: string,
    generator: () => Style,
    options?: NestObject
  ) => Style;
  e: (selector: string) => string;
  prefix: (selector: string) => string;
  theme: (path: string, defaultValue?: unknown) => unknown;
  variants: (path: string, defaultValue?: unknown) => unknown;
  config: (path: string, defaultValue?: unknown) => unknown;
}

export interface Element {
  raw: string;
  variants: string[];
  content?: Element[] | string;
  func?: string;
  type: "group" | "func" | "utility";
}
