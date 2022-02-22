import { baseUtilities } from './utilities';
import { Style, Property, StyleSheet } from '../utils/style';
import type { ThemeUtil } from '../interfaces';
import type { Processor } from './index';

export default function preflight(
  processor: Processor,
  html?: string,
  includeBase = true,
  includeGlobal = true,
  includePlugins = true,
): StyleSheet {
  // Generate preflight style based on html tags.
  const globalSheet = new StyleSheet();
  const styleSheet = new StyleSheet();
  const pluginSheet = new StyleSheet();

  const createStyle = (
    selector: string | undefined,
    properties: {
      [key: string]: string | string[] | ((theme: ThemeUtil) => string);
    },
    isGlobal = false
  ) => {
    const style = new Style(selector, undefined, false);
    for (const [key, value] of Object.entries(properties)) {
      style.add(
        Array.isArray(value)
          ? value.map((v) => new Property(key, v))
          : new Property(key, typeof value === 'function' ? value((path: string, defaultValue?: unknown) => processor.theme(path, defaultValue)) : value)
      );
    }
    style.updateMeta('base', 'preflight', 0, isGlobal? 1 : 2, true);
    return style;
  };

  const safelist = processor.config('preflight.safelist', []) as string[];
  const tags = html ? safelist.concat(Array.from(new Set(html.match(/<\w+/g))).map((i) => i.substring(1))) : undefined;

  // handle base style
  includeBase && (processor.config('prefixer') ? baseUtilities : baseUtilities.filter(i => !i.selector || !/::?(webkit-input|-moz|-ms-input)-placeholder$/.test(i.selector))).forEach(p => {
    if (includeGlobal && p.global) {
      // global style, such as * or html, body
      globalSheet.add(createStyle(p.selector, p.properties, true));
    } else if (tags !== undefined) {
      // only generate matched styles
      const includeTags = tags.filter((i) => p.keys.includes(i));
      if (includeTags.length > 0) styleSheet.add(createStyle(p.selector ? p.selector : includeTags.join(', '), p.properties));
    } else {
      // if no tags input, generate all styles
      styleSheet.add(createStyle(p.selector ? p.selector : p.keys.join(', '), p.properties));
    }
  });

  // handle plugin style
  if (includePlugins) {
    // base Styles
    let preflightList: Style[] = [];
    Object.values(processor._plugin.preflights).forEach((styles) => {
      preflightList = preflightList.concat(styles);
    });
    pluginSheet.add(preflightList);

    // always generated styles
    let staticList: Style[] = [];
    Object.values(processor._plugin.static).forEach((styles) => {
      staticList = staticList.concat(styles);
    });
    pluginSheet.add(staticList);
  }

  const result = styleSheet.combine().sort().extend(pluginSheet.combine().sort());
  return includeGlobal ? result.extend(globalSheet.combine().sort(), false) : result;
}
