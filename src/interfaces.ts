export type DictStr = { [key: string]: string };

export type NestObject = { [key: string]: string | NestObject };

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
  plugins?: (() => unknown)[];
  corePlugins?: string[];
  prefix?: string;
}

export interface DefaultTheme {
  colors: { [key: string]: string | { [key: string]: string } };
  container: { [key: string]: string | { [key: string]: string } };
  fontFamily: { [key: string]: string[] };
  fontSize: { [key: string]: FontSize };
  keyframes: { [key: string]: { [key: string]: string } };
  outline: {[key:string]: [outline: string, outlineOffset: string]};
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
  plugins: unknown[];
}

export interface StaticUtility {
  [key: string]: { [key: string]: string | string[] };
}

export interface PluginUtils {
  theme: ThemeUtil;
}

export interface Element {
  raw: string;
  variants: string[];
  content?: Element[] | string;
  func?: string;
  type: "group" | "func" | "utility";
}
