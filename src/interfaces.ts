export type ThemeUtil = (path: string, defaultValue?: unknown) => unknown;

export type ThemeUtilStr = (path: string, defaultValue?: string) => string;

export type DictStr = { [key: string]: string };

export type GenericNestObject<T> = { [key: string]: T | GenericNestObject<T> };

export type AnyObject = Record<string, unknown>;

export interface ConfigUtils {
  negative: (config: DictStr) => DictStr;
  breakpoints: (config: DictStr) => DictStr;
}

export type Theme = {
  [key: string]:
    | ((theme: ThemeUtil, { negative, breakpoints }: ConfigUtils) => DictStr)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { [key: string]: any };
};

export type Config = {
  presets?: Config[];
  darkMode?: "media" | "class" | false;
  theme?: Theme;
  variantOrder?: string[];
  variants?: { [key: string]: string[] };
  plugins?: any[];
  corePlugins?: string[];
  prefix?: string;
};

export type AnyValue<T> = T;

export interface StaticUtility {
  [key: string]: { [key: string]: string | string[] };
}

export interface PluginUtils {
  theme: ThemeUtil;
}

export type FontSize = [
  fontSize?: string,
  options?: { letterSpacing?: string; lineHeight?: string }
];
