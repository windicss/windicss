import type { DefaultFontSize, ConfigUtil, PluginOutput, PluginWithOptionsOutput } from "../interfaces";

export interface Screens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

export type Colors = Record<string, string | Record<number | string, string>>

export interface BaseTheme {
  screens: Screens
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
  backgroundColor: ConfigUtil
  backgroundOpacity: ConfigUtil
  borderColor: ConfigUtil
  borderOpacity: ConfigUtil
  divideColor: ConfigUtil
  divideOpacity: ConfigUtil
  divideWidth: ConfigUtil
  fill: ConfigUtil
  gap: ConfigUtil
  gradientColorStops: ConfigUtil
  height: ConfigUtil
  inset: ConfigUtil
  margin: ConfigUtil
  maxHeight: ConfigUtil
  maxWidth: ConfigUtil
  minHeight: ConfigUtil
  minWidth: ConfigUtil
  padding: ConfigUtil
  placeholderColor: ConfigUtil
  placeholderOpacity: ConfigUtil
  ringColor: ConfigUtil
  ringOffsetColor: ConfigUtil
  ringOpacity: ConfigUtil
  space: ConfigUtil
  stroke: ConfigUtil
  textColor: ConfigUtil
  textOpacity: ConfigUtil
  translate: ConfigUtil
  width: ConfigUtil
}

export type UserTheme = Partial<BaseTheme>

export interface BaseConfig {
  darkMode: "class" | "media" | false
  theme: BaseTheme
  variantOrder: string[]
  plugins: (PluginOutput|PluginWithOptionsOutput)[]
  prefix: string
}