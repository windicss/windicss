import { Utility } from './utilities/handler';
import { deepCopy } from '../utils/tools';
import { Style, Property } from '../utils/style';
import { pluginOrder } from '../config/order';
import { staticUtilities, dynamicUtilities } from './utilities';
import type { Processor } from './index';

export function generateStaticStyle(processor: Processor, className:string, addComment = false): Style | undefined {
  const style = new Style('.' + className);
  const comment = addComment ? className : undefined;
  const { utility, meta } = staticUtilities[className];
  for (const [key, value] of Object.entries(utility)) {
    style.add(
      Array.isArray(value)
        ? value.map((i) => new Property(key, i, comment))
        : new Property(key, value, comment)
    );
  }
  if (processor._plugin.core && !processor._plugin.core[meta.group]) return;
  return style.updateMeta({
    type: 'utilities',
    corePlugin: true,
    group: meta.group,
    order: pluginOrder[meta.group] + meta.order,
  });
}

export default function extract(
  processor: Processor,
  className: string,
  addComment = false,
  variants?: string[],
  prefix?: string,
): Style | Style[] | undefined {

  // handle static base utilities
  if (!prefix && className in staticUtilities) return generateStaticStyle(processor, className, addComment);
  if (prefix && className.startsWith(prefix)) {
    className = className.replace(new RegExp(`^${prefix}`), '');
    if (className in staticUtilities) return generateStaticStyle(processor, className, addComment);
  }
  // handle static plugin utilities & components
  const staticPlugins = { ...processor._plugin.utilities, ...processor._plugin.components, ...processor._plugin.shortcuts };
  if (className in staticPlugins) return deepCopy(staticPlugins[className]);

  const utility = new Utility(className);


  // handle dynamic plugin utilities
  for (const [key, generator] of Object.entries(processor._plugin.dynamic)) {
    if (className.match(new RegExp(`^-?${key}`))) {
      let style = generator(utility);
      if (style instanceof Property) style = style.toStyle(utility.class);
      if (style && addComment)
        Array.isArray(style)
          ? style.map((i) => i.property.forEach((p) => (p.comment = className)))
          : style.property.forEach((p) => (p.comment = className));
      if (style) return style;
    }
  }

  // handle dynamic base utilities
  const matches = className.match(/\w+/);
  const key = matches ? matches[0] : undefined;
  // eslint-disable-next-line no-prototype-builtins
  if (key && dynamicUtilities.hasOwnProperty(key)) {
    let style = dynamicUtilities[key](utility, processor.pluginUtils, variants ?? []);
    if (!style) return;
    if (processor._plugin.core && !processor._plugin.core[Array.isArray(style) ? style[0].meta.group : style.meta.group]) return;
    if (style instanceof Property) style = style.toStyle(utility.class);
    if (addComment) Array.isArray(style)? style.map((i) => i.property.forEach((p) => (p.comment = className))): style.property.forEach((p) => (p.comment = className));
    return style;
  }
}
