import type { Utility } from './lib/utilities/handler';

import type { Property, Style, InlineAtRule, Keyframes } from './utils/style';

export type DictStr = { [key: string]: string };

export type DeepNestDictStr = { [key: string]: string | DeepNestDictStr };

export type NestObject = { [key: string]: string | string[] | NestObject };

export type DeepNestObject = { [key: string]: NestObject };

export type GenericNestObject<T> = { [key: string]: T | GenericNestObject<T> };

export type AnyObject = Record<string, unknown>;

export type AnyValue<T> = T;

export type Output = Property | Style | Style[] | undefined;

export type FontSize =
  | string
  | [fontSize: string, letterSpacing?: string]
  | [
      fontSize?: string,
      options?: { letterSpacing?: string; lineHeight?: string }
    ];

export type DefaultFontSize = [
  fontSize: string,
  options: { letterSpacing?: string; lineHeight: string }
];

export type ThemeUtil = (path: string, defaultValue?: unknown) => any;

export type ConfigUtil = (
  theme: ThemeUtil,
  {
    negative,
    breakpoints,
  }: {
    negative: (config: DictStr) => DictStr;
    breakpoints: (config: DictStr) => DictStr;
  }
) => { [key:string]: any };

export type PluginFunction = (utils: PluginUtils) => void;

export type PluginUtilOptions =
  | string[]
  | {
      variants?: string[];
      respectPrefix?: boolean;
      respectImportant?: boolean;
    };

export interface PluginBuilder {
  (handler: PluginFunction, config?: Config): PluginOutput;
  withOptions: <T = DictStr>(
    pluginFunction: (options: T) => PluginFunction,
    configFunction?: (options: T) => Config
  ) => PluginWithOptions<T>;
}

export interface PluginOutput {
  handler: PluginFunction;
  config?: Config;
  __isOptionsFunction?: false;
}

export interface PluginWithOptions<T = DictStr> {
  (options?: T): PluginOutputWithOptions<T>;
  __isOptionsFunction: true;
  __pluginFunction: (options: T) => PluginFunction;
  __configFunction: (options: T) => Config;
}

export interface PluginOutputWithOptions<T = DictStr> extends PluginOutput {
  __options: T;
}

export type ThemeType = ConfigUtil | Record<string, any> | undefined

export interface BaseTheme {
  screens: ThemeType
  colors: ThemeType
  spacing: ThemeType
  animation: ThemeType
  backgroundImage: ThemeType
  backgroundPosition: ThemeType
  backgroundSize: ThemeType
  borderRadius: ThemeType
  borderWidth: ThemeType
  boxShadow: ThemeType
  cursor: ThemeType
  flex: ThemeType
  flexGrow: ThemeType
  flexShrink: ThemeType
  fontWeight: ThemeType
  gridAutoColumns: ThemeType
  gridAutoRows: ThemeType
  gridColumn: ThemeType
  gridColumnEnd: ThemeType
  gridColumnStart: ThemeType
  gridRow: ThemeType
  gridRowStart: ThemeType
  gridRowEnd: ThemeType
  transformOrigin: ThemeType
  gridTemplateColumns: ThemeType
  gridTemplateRows: ThemeType
  letterSpacing: ThemeType
  lineHeight: ThemeType
  listStyleType: ThemeType
  objectPosition: ThemeType
  opacity: ThemeType
  order: ThemeType
  outline: ThemeType
  outlineColor: ThemeType
  ringOffsetWidth: ThemeType
  ringWidth: ThemeType
  rotate: ThemeType
  scale: ThemeType
  skew: ThemeType
  strokeWidth: ThemeType
  transitionDuration: ThemeType
  transitionDelay: ThemeType
  transitionProperty: ThemeType
  transitionTimingFunction: ThemeType
  zIndex: ThemeType
  container: ThemeType
  fontFamily: ThemeType
  fontSize: ThemeType
  keyframes: ThemeType
  backgroundColor: ThemeType
  backgroundOpacity: ThemeType
  borderColor: ThemeType
  borderOpacity: ThemeType
  divideColor: ThemeType
  divideOpacity: ThemeType
  divideWidth: ThemeType
  fill: ThemeType
  gap: ThemeType
  gradientColorStops: ThemeType
  height: ThemeType
  inset: ThemeType
  margin: ThemeType
  maxHeight: ThemeType
  maxWidth: ThemeType
  minHeight: ThemeType
  minWidth: ThemeType
  padding: ThemeType
  placeholderColor: ThemeType
  placeholderOpacity: ThemeType
  ringColor: ThemeType
  ringOffsetColor: ThemeType
  ringOpacity: ThemeType
  space: ThemeType
  stroke: ThemeType
  textColor: ThemeType
  textOpacity: ThemeType
  translate: ThemeType
  width: ThemeType

  // contributed by extensions
  aspectRatio: ThemeType
  filter: ThemeType,
  backdropFilter: ThemeType,
  blur: ThemeType,
  lineClamp: ThemeType
  snapMargin: ThemeType
  snapPadding:ThemeType
  typography: ThemeType
}

export type ResolvedTheme = Partial<BaseTheme> | { [ key:string ]: ThemeType }

export type Theme = { extend: ResolvedTheme & { extend?: undefined } } | (ResolvedTheme & { extend?: undefined })

export type Plugin =
  | PluginFunction
  | PluginOutput
  | PluginWithOptions<unknown>
  | PluginOutputWithOptions<unknown>;

export type Shortcut = string | NestObject;
// '@apply': 'font-bold hover:bg-red-500',
// 'background': 'white',

export interface Config {
  presets?: Config[];
  separator?: string;
  important?: boolean | string;
  darkMode?: 'media' | 'class' | false;
  theme?: Theme;
  variantOrder?: string[];
  plugins?: Plugin[];
  corePlugins?: string[];
  prefix?: string;
  exclude?: RegExp[];
  shortcuts?: {[key:string]: Shortcut};
  [key:string]: any;
  /**
   * @deprecated no longer needed for Windi CSS
   */
  purge?: unknown;
  /**
   * @deprecated no longer needed for Windi CSS
   */
  variants?: { [key: string]: string[] };
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
  darkMode: 'class' | 'media' | false;
  theme: DefaultTheme;
  variantOrder: string[];
  variants: { [key: string]: string[] };
  plugins: Plugin[];
}

export interface StaticUtility {
  [key: string]: { [key: string]: string | string[] };
}

export interface DynamicUtility {
  [key: string]: (utility: Utility, { theme }: PluginUtils) => Output;
}

export interface PluginUtils {
  addDynamic: (
    key: string,
    generator: UtilityGenerator,
    options?: PluginUtilOptions
  ) => UtilityGenerator;
  addUtilities: (
    utilities: DeepNestObject,
    options?: PluginUtilOptions
  ) => Style[];
  addComponents: (
    components: DeepNestObject | DeepNestObject[],
    options?: PluginUtilOptions
  ) => Style[];
  addBase: (baseStyles: DeepNestObject) => Style[];
  addVariant: (name: string, generator: VariantGenerator) => Style | Style[];
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
}) => Style;

export type UtilityGenerator = (generator: {
  Utility: Utility;
  Style: {
    (selector: string, property?: Property | Property[] | undefined, important?: boolean): Style;
    generate: (
      parent?: string | undefined,
      property?: NestObject | undefined,
      root?: Style | undefined
    ) => Style[];
  };
  Keyframes: {
    (selector: string, property?: Property | Property[] | undefined, important?: boolean): Keyframes;
    generate: (name: string, children: {
        [key: string]: {
            [key: string]: string;
        };
    }) => Keyframes[];
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
  start: number;
  end: number;
  variants: string[];
  content?: Element[] | string;
  func?: string;
  type: 'group' | 'func' | 'utility';
  important: boolean;
}

export function defineConfig(config: Config): Config {
  return config;
}
