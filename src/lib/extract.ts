import { Utility } from "./utilities/handler";
import { Style, Property } from "../utils/style";
import { staticUtilities, dynamicUtilities } from "./utilities";
import type { Processor } from "./index";

export default function extract(
  processor: Processor,
  className: string,
  addComment = false
): Style | Style[] | undefined {
  // handle static base utilities
  if (className in staticUtilities) {
    const style = new Style("." + className);
    const comment = addComment ? className : undefined;
    for (const [key, value] of Object.entries(staticUtilities[className])) {
      style.add(
        Array.isArray(value)
          ? value.map((i) => new Property(key, i, comment))
          : new Property(key, value, comment)
      );
    }
    return style;
  }

  const matches = className.match(/\w+/);
  const key = matches ? matches[0] : undefined;
  const utility = new Utility(className);

  // handle static plugin utilities & components
  const staticPlugins = {...processor._plugin.utilities, ...processor._plugin.components};
  if (utility.class in staticPlugins) return staticPlugins[utility.class];

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
  if (key && key in dynamicUtilities) {
    let style = dynamicUtilities[key](utility, processor.pluginUtils);
    if (!style) return;
    if (style instanceof Property) style = style.toStyle(utility.class);
    if (addComment)
      Array.isArray(style)
        ? style.map((i) => i.property.forEach((p) => (p.comment = className)))
        : style.property.forEach((p) => (p.comment = className));
    return style;
  }
}
