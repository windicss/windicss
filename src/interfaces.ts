export type ThemeUtil = (path: string, defaultValue?: string) => any;

export type ThemeUtilStr = (path: string, defaultValue?: string) => string;

export type DictStr = { [key: string]: string };

export interface ConfigUtils {
  negative: (config: DictStr) => DictStr;
  breakpoints: (config: DictStr) => DictStr;
}

export type Theme = {
  [key: string]:
    | ((theme: ThemeUtil, { negative, breakpoints }: ConfigUtils) => DictStr)
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

export interface ConfigValue {
  path: string;
  defaultValue?: any;
}

export interface StaticUtility {
  [key: string]: { [key: string]: string | string[] };
}

export interface PluginUtils {
  theme: (path: string, defaultValue?: any) => any;
}

export type FontSize = [
  fontSize?: string,
  options?: { letterSpacing?: string; lineHeight?: string }
];
