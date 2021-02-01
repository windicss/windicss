import { parseDocument } from "htmlparser2";
import { selectOne } from "css-select";
import { Style, StyleSheet } from "../style";
import type { Document } from "domhandler";

function _matchSelector(selector: string, dom: Document): boolean {
  if (/^[:*]/.test(selector)) {
    return true;
  } else {
    const pseudo = selector.match(/([^\\]):/);
    if (pseudo?.index) {
      if (selectOne(selector.substring(0, pseudo.index + 1), dom)) return true;
    } else {
      if (selectOne(selector, dom)) return true;
    }
  }
  return false;
}

export default function purgeBase(
  html: string,
  styles: Style[],
  minify?: boolean
): Style[];
export default function purgeBase(
  html: string,
  styles: StyleSheet,
  minify?: boolean
): StyleSheet;
export default function purgeBase(
  html: string,
  styles: Style[] | StyleSheet,
  minify = false
): Style[] | StyleSheet {
  const dom = parseDocument(html);
  const output: Style[] = [];
  (Array.isArray(styles) ? styles : styles.children).forEach((style) => {
    const selector = style.selector;
    if (selector) {
      if (/\s*,\s*/.test(selector)) {
        const multiSelector = selector
          .split(/\s*,\s*/g)
          .filter((i) => _matchSelector(i, dom))
          .join(minify ? "," : ",\n");
        if (multiSelector) {
          style.selector = multiSelector;
          output.push(style);
        }
      } else {
        if (_matchSelector(selector, dom)) output.push(style);
      }
    } else {
      output.push(style);
    }
  });
  return Array.isArray(styles)? output : new StyleSheet(output);
}
