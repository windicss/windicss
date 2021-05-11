import sortMediaQuery from './sortMediaQuery';
import { sortMeta } from './sortSelector';
import { Keyframes, Container, Style } from '../style/base';
import { wrapit, hash, isSpace } from '../../utils/tools';
import type { AnyObject } from '../../interfaces';

export function combineObject(
  a: { [key: string]: unknown },
  b: { [key: string]: unknown }
): { [key: string]: unknown } {
  const output = { ...a };
  for (const [key_of_b, value_of_b] of Object.entries(b)) {
    if (key_of_b in a) {
      const value_of_a = a[key_of_b];
      if (value_of_a !== value_of_b) {
        if (
          value_of_b !== null &&
          (value_of_b as string).constructor !== Object
        ) {
          output[key_of_b] = [value_of_a, value_of_b];
        } else if (
          value_of_a !== null &&
          (value_of_a as { [key: string]: unknown }).constructor === Object
        ) {
          output[key_of_b] = combineObject(
            value_of_a as { [key: string]: unknown },
            value_of_b as { [key: string]: unknown }
          );
        } else {
          output[key_of_b] = [
            value_of_a,
            combineObject(
              value_of_a as { [key: string]: unknown },
              value_of_b as { [key: string]: unknown }
            ),
          ];
        }
      }
    } else {
      output[key_of_b] = value_of_b;
    }
  }
  return output;
}

export function deepList<T>(
  list: string[],
  value?: T
): { [key: string]: unknown } {
  const key = list.pop();
  const current = value ? value : {};
  if (!key) return current;
  const dict: { [key: string]: AnyObject } = {};
  dict[key] = current;
  return deepList(list, dict);
}

export function handleNest(item: unknown): unknown[] {
  let output: unknown[] = [];
  if (Array.isArray(item)) {
    item.forEach((i) => {
      output = [...output, ...handleNest(i)];
    });
  } else {
    if ((item as { build?: () => '' }).build)
      output.push((item as { build: () => '' }).build());
  }
  return output;
}

export function buildMap(obj: unknown, minify = false, prefixer = true): string {
  let output: unknown[] = [];
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      if (item.constructor === Object) {
        output.push(buildMap(item));
      } else if (Array.isArray(item)) {
        output = [...output, ...handleNest(item)];
      } else {
        if (item.build) output.push(item.build(minify));
      }
    });
  } else if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      const _gstyle = (v: string) =>
        (minify ? key.replace(/\n/g, '') : key + ' ') +
        wrapit(v, undefined, undefined, undefined, minify);
      if (value instanceof Style) {
        output.push(_gstyle(value.build(minify, prefixer)));
      } else if (value && typeof value === 'object') {
        output.push(_gstyle(buildMap(value, minify, prefixer)));
      }
    }
  }
  return output.join(minify ? '' : '\n');
}

export function combineSelector(styleList: Style[]): Style[] {
  const styleMap: { [key: string]: Style } = {};
  const passed: Style[] = [];
  styleList.forEach((style) => {
    const rule = style.rule;
    if (rule) {
      const hashValue = hash(rule);
      if (hashValue in styleMap) {
        styleMap[hashValue] = styleMap[hashValue].extend(style, true);
      } else {
        styleMap[hashValue] = style;
      }
    } else {
      passed.push(style);
    }
  });
  return [...passed, ...Object.values(styleMap).map((style) => style.clean())];
}

export function buildAtRule(styleList: Style[], minify = false, prefixer = true, reverse = false): string {
  const ruleMap = styleList
    .map(i => {
      const list = [
        ...reverse ? (i.atRules ?? []).sort(sortMediaQuery) : (i.atRules ?? []).sort(sortMediaQuery).reverse(),
        i.rule,
      ];
      const style = new Style(undefined, i.property, i.important);
      style.meta = i.meta;
      i.wrapProperties && i.wrapProperties.forEach(wrap => style.wrapProperty(wrap));
      return deepList(list, style);
    })
    .sort((a, b) => {
      const akey = Object.keys(a)[0];
      const bkey = Object.keys(b)[0];
      return sortMediaQuery(akey, bkey);
    });
  return buildMap(ruleMap.reduce((previousValue, currentValue) => combineObject(previousValue, currentValue), {}), minify, prefixer);
}

export default function compileStyleSheet(
  styleList: Style[],
  minify = false,
  prefixer = true,
): string {
  const head = combineSelector(styleList.filter((i) => !(i.selector && i.atRules) && !(i instanceof Container)).sort(sortMeta)).map((i) => i.build(minify, prefixer)).join(minify ? '' : '\n');
  const containers: {[key:string]: Container[]} = {};
  styleList.filter(i => i instanceof Container).forEach(i => {
    if (i.selector && i.selector in containers) {
      containers[i.selector].push(i);
    } else if (i.selector) {
      containers[i.selector] = [i];
    }
  });
  const topStyles = Object.values(containers).map(i => buildAtRule(i, minify, prefixer, true));
  const keyframes = buildAtRule(styleList.filter(i => i instanceof Keyframes), minify, prefixer);
  if (keyframes) topStyles.unshift(keyframes);
  const top = topStyles.join(minify? '' : '\n');
  const body = buildAtRule(styleList.filter((i) => i.selector && i.atRules && !(i instanceof Keyframes || i instanceof Container)).sort(sortMeta), minify, prefixer);
  return minify
    ? (top + head + body).replace(/;\}/g, '}')
    : [top, head, body].filter((i) => !isSpace(i)).join('\n');
}
