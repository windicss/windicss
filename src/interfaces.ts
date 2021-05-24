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

export type colorOpacity = {
  opacityVariable?: string
  opacityValue?: string
}
export type colorCallback = (colorOpacity: colorOpacity) => string;
export type colorObject = { [key: string]: string | colorCallback | colorObject };

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

export type Layer = 'base' | 'utilities' | 'components'

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
      completions?: string[];
      respectPrefix?: boolean;
      respectImportant?: boolean;
      respectSelector?: boolean;
      layer?: Layer;
      order?: number;
      group?: string;
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
  vars: ThemeType
  screens: ThemeType
  colors: ThemeType
  spacing: ThemeType
  animation: ThemeType
  backdropBlur: ThemeType
  backdropBrightness: ThemeType
  backdropContrast: ThemeType
  backdropGrayscale: ThemeType
  backdropHueRotate: ThemeType
  backdropInvert: ThemeType
  backdropOpacity: ThemeType
  backdropSaturate: ThemeType
  backdropSepia: ThemeType
  backgroundColor: ThemeType
  backgroundImage: ThemeType
  backgroundOpacity: ThemeType
  backgroundPosition: ThemeType
  backgroundSize: ThemeType
  blur: ThemeType
  borderColor: ThemeType
  borderOpacity: ThemeType
  borderRadius: ThemeType
  borderWidth: ThemeType
  boxShadow: ThemeType
  boxShadowColor: ThemeType
  brightness: ThemeType
  caretColor: ThemeType
  caretOpacity: ThemeType
  container: ThemeType
  contrast: ThemeType
  cursor: ThemeType
  divideColor: ThemeType
  divideOpacity: ThemeType
  divideWidth: ThemeType
  dropShadow: ThemeType
  fill: ThemeType
  flex: ThemeType
  flexGrow: ThemeType
  flexShrink: ThemeType
  fontFamily: ThemeType
  fontSize: ThemeType
  fontWeight: ThemeType
  gap: ThemeType
  gradientColorStops: ThemeType
  grayscale: ThemeType
  gridAutoColumns: ThemeType
  gridAutoRows: ThemeType
  gridColumn: ThemeType
  gridColumnEnd: ThemeType
  gridColumnStart: ThemeType
  gridRow: ThemeType
  gridRowStart: ThemeType
  gridRowEnd: ThemeType
  gridTemplateColumns: ThemeType
  gridTemplateRows: ThemeType
  height: ThemeType
  hueRotate: ThemeType
  inset: ThemeType
  invert: ThemeType
  keyframes: ThemeType
  letterSpacing: ThemeType
  lineHeight: ThemeType
  listStyleType: ThemeType
  margin: ThemeType
  maxHeight: ThemeType
  maxWidth: ThemeType
  minHeight: ThemeType
  minWidth: ThemeType
  objectPosition: ThemeType
  opacity: ThemeType
  order: ThemeType
  outline: ThemeType
  outlineColor: ThemeType
  perspective: ThemeType
  perspectiveOrigin: ThemeType
  padding: ThemeType
  placeholderColor: ThemeType
  placeholderOpacity: ThemeType
  ringColor: ThemeType
  ringOffsetColor: ThemeType
  ringOffsetWidth: ThemeType
  ringOpacity: ThemeType
  ringWidth: ThemeType
  rotate: ThemeType
  saturate: ThemeType
  scale: ThemeType
  sepia: ThemeType
  skew: ThemeType
  space: ThemeType
  stroke: ThemeType
  strokeWidth: ThemeType
  strokeDashArray: ThemeType
  strokeDashOffset: ThemeType
  tabSize: ThemeType
  textColor: ThemeType
  textOpacity: ThemeType
  textShadow: ThemeType
  textStrokeColor: ThemeType
  textStrokeWidth: ThemeType
  textDecorationColor: ThemeType
  textDecorationOpacity: ThemeType
  textDecorationLength: ThemeType
  textDecorationOffset: ThemeType
  textIndent: ThemeType
  transformOrigin: ThemeType
  transitionDuration: ThemeType
  transitionDelay: ThemeType
  transitionProperty: ThemeType
  transitionTimingFunction: ThemeType
  translate: ThemeType
  width: ThemeType
  zIndex: ThemeType

  // contributed by extensions
  aspectRatio: ThemeType
  filter: ThemeType
  backdropFilter: ThemeType
  lineClamp: ThemeType
  snapMargin: ThemeType
  snapPadding:ThemeType
  typography: ThemeType
}

export type Theme = Partial<BaseTheme> | ({ [ key:string ]: ThemeType } & { extend?: Theme & { extend?: undefined } })

export type Plugin =
  | PluginFunction
  | PluginOutput
  | PluginWithOptions<unknown>
  | PluginOutputWithOptions<unknown>;

export type Shortcut = string | NestObject;
// '@apply': 'font-bold hover:bg-red-500',
// 'background': 'white',

export type DarkModeConfig = 'class' | 'media' | false;

export type Handlers = {
  static?: boolean
  number?: boolean
  bracket?: boolean
  hex?: boolean
  nxl?: boolean
  fraction?: boolean
  size?: boolean
  variable?: boolean
  negative?: boolean
}

export type StyleArrayObject = { [key: string]: Style[] }
export type ResolvedVariants = { [key: string]: () => Style }
export type VariantTypes = 'screen' | 'theme' | 'state'
export type AddPluginType = 'static' | 'utilities' | 'components' | 'preflights' | 'shortcuts'

export interface ExtractorResultDetailed {
  attributes?: {
    names: string[];
    values: string[];
  };
  classes?: string[];
  ids?: string[];
  tags?: string[];
  undetermined?: string[];
}

export interface Extractor {
  extractor: (content: string, id?: string) => ExtractorResultDetailed | Promise<ExtractorResultDetailed>,
  extensions: string[]
}

export interface ExtractOptions {
  /**
   * Globs of files to be included from extractions
   */
  include?: string[]
  /**
   * Globs of files to be excluded from extractions
   *
   * @default ['node_modules', '.git']
   */
  exclude?: string[]
  /**
   * Extractors to handle different file types.
   * Compatible with PurgeCSS
   */
  extractors?: Extractor[]
}

export interface PreflightOptions {
  /**
   * Include all the preflight regardless the template
   *
   * @default false
   */
  includeAll?: boolean

  /**
   * Safelist of preflight that will always be included in the generated CSS
   */
  safelist?: string | (string | string[])[];

  /**
   * Blocklist of preflight that will always be excluded in the generated CSS
   */
  blocklist?: string | (string | string[])[]

  /**
   * Alias for resolving preflight
   */
  alias?: Record<string, string>

  /**
   * @default true
   */
  includeBase?: boolean

  /**
   * @default true
   */
  includeGlobal?: boolean

  /**
   * @default true
   */
  includePlugin?: boolean
}

export interface Config {
  presets?: Config[];
  prefixer?: boolean;
  attributify?: boolean | {
    prefix?: string
    disable?: string[]
  }
  separator?: string;
  important?: boolean | string;
  darkMode?: DarkModeConfig;
  theme?: Theme;
  variantOrder?: string[];
  plugins?: Plugin[];
  handlers?: Handlers;
  corePlugins?: (keyof BaseTheme)[] | string[] | { [ T in keyof BaseTheme ] : boolean } | { [ key:string ] : boolean };
  prefix?: string;
  exclude?: RegExp[];
  alias?: {[key:string]: string};
  shortcuts?: {[key:string]: Shortcut};

  // ===== Depreacted =====
  /**
   * @deprecated no longer needed for Windi CSS
   */
  purge?: unknown;
  /**
   * @deprecated no longer needed for Windi CSS
   */
  variants?: { [key: string]: string[] };
  /**
   * Fallback
   */
  [key:string]: any;
}

export interface FullConfig extends Config {
  /**
   * Safelist of utilities that will always be included in the generated CSS
   */
  safelist?: string | (string | string[])[];
  /**
   * Blocklist of utilities that will always be excluded in the generated CSS
   */
  blocklist?: string | (string | string[])[]
  /**
   * Extractions options
   */
  extract?: ExtractOptions
  /**
   * Preflight options
   * Set `false` to disable preflight
   *
   * @default true
   */
  preflight?: PreflightOptions | boolean
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
  darkMode: DarkModeConfig;
  theme: DefaultTheme;
  variantOrder: string[];
  variants: { [key: string]: string[] };
  plugins: Plugin[];
}

export interface StaticUtility {
  [key: string]: {
    meta: { group: string, order: number },
    utility: { [key: string]: string | string[] };
  }
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
  type: 'group' | 'func' | 'utility' | 'alias';
  important: boolean;
}

export interface Validata {
  className: string;
  raw: string;
  start: number;
  end: number;
  variants: string[];
  content?: string | Element[] | undefined;
  func?: string | undefined;
  type: 'group' | 'func' | 'utility' | 'alias';
  important: boolean;
  parent: Element | undefined;
}

export interface ProcessorCache {
  html: string[];
  attrs: string[];
  classes: string[];
  variants: string[];
  utilities: string[];
}

export interface PluginCache {
  core?: { [key:string]:boolean };
  static: StyleArrayObject; // utilities that don't need dynamically generated
  dynamic: { [key: string]: ((utility: Utility) => Output)};
  utilities: StyleArrayObject;
  components: StyleArrayObject;
  preflights: StyleArrayObject;
  shortcuts: StyleArrayObject;
  alias: { [key: string]: Element[] };
  completions: { [key: string]: string[] };
}

export interface VariantUtils {
  modifySelectors: (modifier: ({ className }: {
      className: string;
  }) => string) => Style;
  atRule: (name: string) => Style;
  pseudoClass: (name: string) => Style;
  pseudoElement: (name: string) => Style;
  parent: (name: string) => Style;
  child: (name: string) => Style;
}
