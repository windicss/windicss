import type { DefaultFontSize, ConfigUtil, PluginOutput, PluginWithOptionsOutput } from "../interfaces";

export type Colors = Record<string, string | Record<string | number, string>>

interface BasicTheme {
  screens: Record<string, string>
  colors: Colors;
  spacing: Record<string, string>
  animation: Record<string, string>
  backgroundImage: Record<string, string>
  backgroundPosition: Record<string, string>
  backgroundSize: Record<string, string>
  borderRadius: Record<string, string>
  borderWidth: Record<string, string>
  boxShadow: Record<string, string>
  cursor: Record<string, string>
  flex: Record<string, string>
  flexGrow: Record<string, string>
  flexShrink: Record<string, string>
  fontWeight: Record<string, string>
  gridAutoColumns: Record<string, string>
  gridAutoRows: Record<string, string>
  gridColumn: Record<string, string>
  gridColumnEnd: Record<string, string>
  gridColumnStart: Record<string, string>
  gridRow: Record<string, string>
  gridRowStart: Record<string, string>
  gridRowEnd: Record<string, string>
  transformOrigin: Record<string, string>
  gridTemplateColumns: Record<string, string>
  gridTemplateRows: Record<string, string>
  letterSpacing: Record<string, string>
  lineHeight: Record<string, string>
  listStyleType: Record<string, string>
  objectPosition: Record<string, string>
  opacity: Record<string, string>
  order: Record<string, string>
  outline: Record<string, [outline: string, outlineOffset: string]>
  ringOffsetWidth: Record<string, string>
  ringWidth: Record<string, string>
  rotate: Record<string, string>
  scale: Record<string, string>
  skew: Record<string, string>
  strokeWidth: Record<string, string>
  transitionDuration: Record<string, string>
  transitionDelay: Record<string, string>
  transitionProperty: Record<string, string>
  transitionTimingFunction: Record<string, string>
  zIndex: Record<string, string>
  container: { [key: string]: string | Record<string, string> };
  fontFamily: Record<string, string[]>;
  fontSize: { [key: string]: DefaultFontSize };
  keyframes: Record<string, any>;
  [key: string]: any
}

export interface BaseTheme extends BasicTheme {
  backgroundColor: ConfigUtil | Colors
  backgroundOpacity: ConfigUtil | Record<string, string>
  borderColor: ConfigUtil | Colors
  borderOpacity: ConfigUtil | Record<string, string>
  divideColor: ConfigUtil | Colors
  divideOpacity: ConfigUtil | Record<string, string>
  divideWidth: ConfigUtil | Record<string, string>
  fill: ConfigUtil | Colors
  gap: ConfigUtil | Record<string, string>
  gradientColorStops: ConfigUtil | Colors
  height: ConfigUtil | Record<string, string>
  inset: ConfigUtil | Record<string, string>
  margin: ConfigUtil | Record<string, string>
  maxHeight: ConfigUtil | Record<string, string>
  maxWidth: ConfigUtil | Record<string, string>
  minHeight: ConfigUtil | Record<string, string>
  minWidth: ConfigUtil | Record<string, string>
  padding: ConfigUtil | Record<string, string>
  placeholderColor: ConfigUtil | Colors
  placeholderOpacity: ConfigUtil | Record<string, string>
  ringColor: ConfigUtil | Colors
  ringOffsetColor: ConfigUtil | Colors
  ringOpacity: ConfigUtil | Record<string, string>
  space: ConfigUtil | Record<string, string>
  stroke: ConfigUtil | Colors
  textColor: ConfigUtil | Colors
  textOpacity: ConfigUtil | Record<string, string>
  translate: ConfigUtil | Record<string, string>
  width: ConfigUtil | Record<string, string>
}

export interface ResolvedTheme extends BasicTheme {
  backgroundColor: Colors
  backgroundOpacity: Record<string, string>
  borderColor: Colors
  borderOpacity: Record<string, string>
  divideColor: Colors
  divideOpacity: Record<string, string>
  divideWidth: Record<string, string>
  fill: Colors
  gap: Record<string, string>
  gradientColorStops: Colors
  height: Record<string, string>
  inset: Record<string, string>
  margin: Record<string, string>
  maxHeight: Record<string, string>
  maxWidth: Record<string, string>
  minHeight: Record<string, string>
  minWidth: Record<string, string>
  padding: Record<string, string>
  placeholderColor: Colors
  placeholderOpacity: Record<string, string>
  ringColor: Colors
  ringOffsetColor: Colors
  ringOpacity: Record<string, string>
  space: Record<string, string>
  stroke: Colors
  textColor: Colors
  textOpacity: Record<string, string>
  translate: Record<string, string>
  width: Record<string, string>
}

export interface UserTheme extends Partial<BaseTheme> {
  extend?: UserTheme
}

export interface BaseConfig {
  presets?: BaseConfig[];
  separator?: string;
  important?: boolean | string;
  darkMode?: "class" | "media" | false
  theme?: Partial<BaseTheme>
  variantOrder?: string[]
  variants?: Record<string, string[]>
  plugins?: (PluginOutput|PluginWithOptionsOutput)[]
  corePlugins?: string[]
  prefix?: string
}

type StringKey = { [key: string]: any }

export interface ResolvedConfig extends Omit<BaseConfig, 'theme'>, StringKey {
  theme: ResolvedTheme
}

export interface UserConfig extends Omit<BaseConfig, 'theme'> {
  theme?: UserTheme
}