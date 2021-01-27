import { Utility } from "./utilities/handler";
import { Style, Property } from "../utils/style";
import { staticUtilities, dynamicUtilities } from "./utilities";
import type { ThemeUtil } from "../interfaces";

export default function extract(
  theme: ThemeUtil,
  className: string,
  addComment = false
): Style | Style[] | undefined {
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
  if (key && key in dynamicUtilities) {
    let style = dynamicUtilities[key](new Utility(className), { theme });
    if (!style) return;
    if (style instanceof Property) style = style.toStyle("." + className);
    if (addComment)
      Array.isArray(style)
        ? style.map((i) => i.property.forEach((p) => (p.comment = className)))
        : style.property.forEach((p) => (p.comment = className));
    return style;
  }
}
