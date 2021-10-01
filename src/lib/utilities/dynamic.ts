import { Utility } from './handler';
import { pluginOrder } from '../../config/order';
import { dashToCamel, toType } from '../../utils/tools';
import { Property, Style, Keyframes, Container } from '../../utils/style';
import { linearGradient, minMaxContent } from '../../utils/style/prefixer';
import {
  generatePlaceholder,
  generateFontSize,
  isString,
  expandDirection,
} from '../../utils/helpers';

import type { PluginUtils, FontSize, Output, DynamicUtility } from '../../interfaces';

function isNumberLead(i:string) {
  return /^\d/.test(i) ? i : undefined;
}

function notNumberLead(i:string) {
  return /^\d/.test(i) ? undefined : i;
}

// https://windicss.org/utilities/container.html
function container(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === 'container') {
    const className = utility.class;
    const baseStyle = new Container(utility.class, new Property('width', '100%'));
    const paddingDefault = toType(theme('container.padding'), 'string') ? toType(theme('container.padding'), 'string') : toType(theme('container.padding.DEFAULT'), 'string');

    if (paddingDefault) {
      baseStyle.add(new Property('padding-left', paddingDefault));
      baseStyle.add(new Property('padding-right', paddingDefault));
    }

    const center = theme('container.center');

    if (center && typeof center === 'boolean'){
      baseStyle.add(new Property(['margin-left', 'margin-right'], 'auto'));
    }

    const output: Container[] = [baseStyle];
    const screens = toType(theme('container.screens', theme('screens')), 'object');

    for (const [screen, size] of Object.entries(screens)) {
      if (!isString(size)) continue;
      const props = [new Property('max-width', `${size}`)];
      const padding = theme(`container.padding.${screen}`);
      if (padding && typeof padding === 'string') {
        props.push(new Property('padding-left', padding));
        props.push(new Property('padding-right', padding));
      }
      output.push(new Container(className, props).atRule(`@media (min-width: ${size})`));
    }

    output.forEach(style => style.updateMeta('utilities', 'container', pluginOrder.container, 0, true));

    return output;
  }
}

// https://windicss.org/utilities/positioning.html#object-position
function objectPosition(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('objectPosition'))
    .createProperty(['-o-object-position', 'object-position'])
    ?.updateMeta('utilities', 'objectPosition', pluginOrder.objectPosition, 0, true);
}

// https://windicss.org/utilities/positioning.html#top-right-bottom-left
function inset(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler.catchPrefix(/^-?(top|left|bottom|right|inset(-(x|y))?)/, true);
  return handler
    ?.handleStatic(theme('inset'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .callback(value => {
      switch (utility.identifier) {
      case 'top':
      case 'right':
      case 'bottom':
      case 'left':
        return new Property(utility.identifier, value).updateMeta('utilities', 'inset', pluginOrder.inset, 4, true);
      case 'inset':
        if (handler.prefix?.endsWith('inset-x')) return new Property(['right', 'left'], value).updateMeta('utilities', 'inset', pluginOrder.inset, 3, true);
        if (handler.prefix?.endsWith('inset-y')) return new Property(['top', 'bottom'], value).updateMeta('utilities', 'inset', pluginOrder.inset, 2, true);
        return new Property(['top', 'right', 'bottom', 'left'], value).updateMeta('utilities', 'inset', pluginOrder.inset, 1, true);
      }
    });
}

// https://windicss.org/utilities/positioning.html#z-index
function zIndex(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^-?z/)
    ?.handleBody(theme('zIndex'))
    .handleNumber(0, 99999, 'int')
    .handleNegative()
    .handleVariable()
    .createProperty('z-index')
    ?.updateMeta('utilities', 'zIndex', pluginOrder.zIndex, 0, true);
}

// https://windicss.org/utilities/flexbox.html#flex
// https://windicss.org/utilities/flexbox.html#flex-grow
// https://windicss.org/utilities/flexbox.html#flex-shrink
function flex(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler;
  if (handler.catchPrefix(/^flex-grow/, true)) {
    const map = toType(theme('flexGrow'), 'object') as { [key: string]: string };
    const amount = utility.raw.replace(/flex-grow-?/, '') || 'DEFAULT';
    if (amount === 'DEFAULT' || handler.isStatic(map, amount)) return new Property(['-webkit-box-flex', '-ms-flex-positive', '-webkit-flex-grow', 'flex-grow'], map[amount]).toStyle(utility.class).updateMeta('utilities', 'flexGrow', pluginOrder.flexGrow, 0, true);
    return handler.handleSquareBrackets().createProperty(['-webkit-box-flex', '-ms-flex-positive', '-webkit-flex-grow', 'flex-grow'])?.updateMeta('utilities', 'flexGrow', pluginOrder.flexGrow, 1, true);
  } else if (handler.catchPrefix(/^flex-shrink/, true)) {
    const map = toType(theme('flexShrink'), 'object') as { [key: string]: string };
    const amount = utility.raw.replace(/flex-shrink-?/, '') || 'DEFAULT';
    if (amount === 'DEFAULT' || handler.isStatic(map, amount)) return new Property(['-ms-flex-negative', '-webkit-flex-shrink', 'flex-shrink'], map[amount]).toStyle(utility.class).updateMeta('utilities', 'flexShrink', pluginOrder.flexShrink, 0, true);
    return handler.handleSquareBrackets().createProperty(['-ms-flex-negative', '-webkit-flex-shrink', 'flex-shrink'])?.updateMeta('utilities', 'flexShrink', pluginOrder.flexShrink, 1, true);
  } else {
    return handler.catchPrefix(/^flex/)?.handleStatic(theme('flex')).handleSquareBrackets().createStyle(utility.class, value => {
      value = value.trim();
      return [
        new Property('-webkit-box-flex', value.startsWith('0') || value === 'none' ? '0' : '1'),
        new Property(['-ms-flex', '-webkit-flex', 'flex'], value),
      ];
    })?.updateMeta('utilities', 'flex', pluginOrder.flex, 0, true);
  }
}

// https://windicss.org/utilities/positioning.html#order
function order(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^-?order/)
    ?.handleStatic(theme('order'))
    .handleNumber(1, 9999, 'int')
    .handleNegative()
    .handleVariable()
    .createStyle(utility.class, (value) => [
      new Property('-webkit-box-ordinal-group', value.includes('var') ? `calc(${value}+1)` : (parseInt(value) + 1).toString()),
      new Property(['-webkit-order', '-ms-flex-order', 'order'], value),
    ])
    ?.updateMeta('utilities', 'order', pluginOrder.order, utility.raw.charAt(0) === '-' ? 2 : 1, true);
}

// https://windicss.org/utilities/grid.html#grid-template-columns
// https://windicss.org/utilities/grid.html#grid-template-rows
function gridTemplate(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler.catchPrefix(/^grid-(rows|cols)/, true);
  if (!handler) return;
  const type = handler.prefix === 'grid-rows' ? 'rows' : 'columns';
  const group = handler.prefix === 'grid-rows' ? 'gridTemplateRows': 'gridTemplateColumns';
  return handler
    .handleStatic(theme(group))
    .handleSquareBrackets(i => i.replace(/\(.*?\)|,/g, (r) => r === ',' ? ' ' : r /* ignore content inside nested-brackets */ ))
    .createProperty(`grid-template-${type}`, (value) => value === 'none' ? 'none' : value)
    ?.updateMeta('utilities', group, pluginOrder[group], 1, true)
  || handler
    .handleNumber(1, undefined, 'int')
    .handleVariable()
    .createProperty(`grid-template-${type}`, (value) => `repeat(${value}, minmax(0, 1fr))`)
    ?.updateMeta('utilities', group, pluginOrder[group], 2, true);
}

// https://windicss.org/utilities/grid.html#grid-column-span
// https://windicss.org/utilities/grid.html#grid-column-start
// https://windicss.org/utilities/grid.html#grid-column-end
function gridColumn(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  // col span
  const spans = toType(theme('gridColumn'), 'object') as { [key: string]: string };
  if (Object.keys(spans).includes(body)) return new Property(['-ms-grid-column-span', 'grid-column'], spans[body]).updateMeta('utilities', 'gridColumn', pluginOrder.gridColumn, 1, true);
  return utility.handler
    .catchPrefix(/^col-span/, true)
    ?.handleNumber(1, undefined, 'int')
    .handleVariable()
    .createProperty(['-ms-grid-column-span', 'grid-column'], (value) => `span ${value} / span ${value}`)
    ?.updateMeta('utilities', 'gridColumn', pluginOrder.gridColumn, 1, true)
  || utility.handler
    .catchPrefix(/^col-end/, true)
    ?.handleStatic(theme('gridColumnEnd'))
    .handleSquareBrackets()
    .handleNumber(1, undefined, 'int')
    .handleVariable()
    .createProperty('grid-column-end')
    ?.updateMeta('utilities', 'gridColumnEnd', pluginOrder.gridColumnEnd, 1, true)
  || utility.handler
    .catchPrefix(/^col-start/, true)
    ?.handleStatic(theme('gridColumnStart'))
    .handleSquareBrackets()
    .handleNumber(1, undefined, 'int')
    .handleVariable()
    .createProperty('grid-column-start')
    ?.updateMeta('utilities', 'gridColumnStart', pluginOrder.gridColumnStart, 1, true)
  || utility.handler
    .catchPrefix(/^col/)
    ?.handleSquareBrackets()
    .createProperty(['-ms-grid-column-span', 'grid-column'], (value) => `span ${value} / span ${value}`)
    ?.updateMeta('utilities', 'gridColumn', pluginOrder.gridColumn, 1, true);
}

// https://windicss.org/utilities/grid.html#grid-row-span
// https://windicss.org/utilities/grid.html#grid-row-start
// https://windicss.org/utilities/grid.html#grid-row-end
function gridRow(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  // row span
  const spans = toType(theme('gridRow'), 'object') as { [key: string]: string };
  if (Object.keys(spans).includes(body)) return new Property(['-ms-grid-row-span', 'grid-row'], spans[body]).updateMeta('utilities', 'gridRow', pluginOrder.gridRow, 1, true);
  return utility.handler
    .catchPrefix(/^row-span/, true)
    ?.handleNumber(1, undefined, 'int')
    .handleVariable()
    .createProperty(['-ms-grid-row-span', 'grid-row'], (value: string) => `span ${value} / span ${value}`)
    ?.updateMeta('utilities', 'gridRow', pluginOrder.gridRow, 2, true)
  ||
  utility.handler
    .catchPrefix(/^row-end/, true)
    ?.handleStatic(theme('gridRowEnd'))
    .handleSquareBrackets()
    .handleNumber(1, undefined, 'int')
    .handleVariable()
    .createProperty('grid-row-end')
    ?.updateMeta('utilities', 'gridRowEnd', pluginOrder.gridRowEnd, 1, true)
  ||
  utility.handler
    .catchPrefix(/^row-start/, true)
    ?.handleStatic(theme('gridRowStart'))
    .handleSquareBrackets()
    .handleNumber(1, undefined, 'int')
    .handleVariable()
    .createProperty('grid-row-start')
    ?.updateMeta('utilities', 'gridRowStart', pluginOrder.gridRowStart, 1, true)
  ||
  utility.handler
    .catchPrefix(/^row/)
    ?.handleSquareBrackets()
    .createProperty(['-ms-grid-row-span', 'grid-row'], (value: string) => `span ${value} / span ${value}`)
    ?.updateMeta('utilities', 'gridRow', pluginOrder.gridRow, 2, true);
}

// https://windicss.org/utilities/grid.html#grid-auto-columns
// https://windicss.org/utilities/grid.html#grid-auto-rows
function gridAuto(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler.catchPrefix(/^auto-(rows|cols)/, true);
  if (!handler) return;
  const type = handler.prefix === 'auto-rows' ? 'rows' : 'columns';
  const group = handler.prefix === 'auto-rows' ? 'gridAutoRows': 'gridAutoColumns';
  const value = handler.handleStatic(theme(group)).value;
  if (value) {
    const prefixer = minMaxContent(value);
    if (typeof prefixer === 'string') return new Property(`grid-auto-${type}`, prefixer).updateMeta('utilities', group, pluginOrder[group], 1, true);
    return new Style(utility.class, prefixer.map((i) => new Property(`grid-auto-${type}`, i))).updateMeta('utilities', group, pluginOrder[group], 2, true);
  }
}

// https://windicss.org/utilities/grid.html#gap
function gap(utility: Utility, { theme, config }: PluginUtils): Output {
  const handler = utility.handler.catchPrefix(/^gap(-(x|y))?/, true);
  if (handler) return handler
    .handleStatic(theme('gap'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleSize()
    .handleVariable()
    .callback(value => {
      if (handler.prefix === 'gap-x') return new Property(config('prefixer') ? ['-webkit-column-gap', '-moz-column-gap', 'grid-column-gap', 'column-gap'] : 'column-gap', value).updateMeta('utilities', 'gap', pluginOrder.gap, 2, true);
      if (handler.prefix === 'gap-y') return new Property(config('prefixer') ? ['-webkit-row-gap', '-moz-row-gap', 'grid-row-gap', 'row-gap'] : 'row-gap', value).updateMeta('utilities', 'gap', pluginOrder.gap, 3, true);
      return new Property(config('prefixer') ? ['grid-gap', 'gap'] : 'gap', value).updateMeta('utilities', 'gap', pluginOrder.gap, 1, true);
    });
}

// https://windicss.org/utilities/spacing.html#padding
function padding(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^p(x|y|t|l|b|r)?/)
    ?.handleStatic(theme('padding'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleVariable()
    .callback(value => {
      const directions = expandDirection(utility.identifier.substring(1), false);
      if (directions) {
        if (directions[0] === '*') return new Property('padding', value).updateMeta('utilities', 'padding', pluginOrder.padding, -4, true);
        return new Property(directions.map((i) => `padding-${i}`), value).updateMeta('utilities', 'padding', pluginOrder.padding, -directions.length, true);
      }
    });
}

// https://windicss.org/utilities/spacing.html#margin
function margin(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^-?m(x|y|t|l|b|r)?/)
    ?.handleStatic(theme('margin'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .callback(value => {
      const directions = expandDirection(utility.identifier.substring(1), false);
      if (directions) {
        if (directions[0] === '*') return new Property('margin', value).updateMeta('utilities', 'margin', pluginOrder.margin, -4, true);
        return new Property(directions.map((i) => `margin-${i}`), value).updateMeta('utilities', 'margin', pluginOrder.margin, -directions.length, true);
      }
    });
}

// https://windicss.org/utilities/spacing.html#space-between-y
function space(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === 'space-x-reverse') {
    return new Style(utility.class, [
      new Property('--tw-space-x-reverse', '1'),
    ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, 6, true);
  }
  if (utility.raw === 'space-y-reverse') {
    return new Style(utility.class, [
      new Property('--tw-space-y-reverse', '1'),
    ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, 5, true);
  }
  const handler = utility.handler;
  return handler
    .catchPrefix(/^-?space-(x|y)/, true)
    ?.handleStatic(theme('space'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .callback(value => {
      if (handler.prefix?.endsWith('space-x')) {
        return new Style(utility.class, [
          new Property('--tw-space-x-reverse', '0'),
          new Property('margin-right', `calc(${value} * var(--tw-space-x-reverse))`),
          new Property('margin-left', `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`),
        ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, (utility.raw.charAt(0) === '-' ? 4 : 2), true);
      }
      return new Style(utility.class, [
        new Property('--tw-space-y-reverse', '0'),
        new Property('margin-top', `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`),
        new Property('margin-bottom', `calc(${value} * var(--tw-space-y-reverse))`),
      ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, (utility.raw.charAt(0) === '-' ? 3 : 1), true);
    });
}

// https://windicss.org/utilities/sizing.html#width
// https://windicss.org/utilities/sizing.html#height
function size(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler.catchPrefix(/^(w|h)/);
  if (!handler) return;
  const name = utility.identifier === 'w' ? 'width' : 'height';
  const sizes = toType(theme(name), 'object') as { [key: string]: string };
  // handle static
  if (utility.body in sizes) {
    switch (sizes[utility.body]) {
    case 'min-content':
      return new Style(utility.class, [
        new Property(name, '-webkit-min-content'),
        new Property(name, '-moz-min-content'),
        new Property(name, 'min-content'),
      ]).updateMeta('utilities', name, pluginOrder[name], 2, true);
    case 'max-content':
      return new Style(utility.class, [
        new Property(name, '-webkit-max-content'),
        new Property(name, '-moz-max-content'),
        new Property(name, 'max-content'),
      ]).updateMeta('utilities', name, pluginOrder[name], 3, true);
    default:
      return new Style(utility.class, new Property(name, sizes[utility.body])).updateMeta('utilities', name, pluginOrder[name], 1, true);
    }
  }
  return handler
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNxl((number: number) => `${(number - 3) * 8 + 48}rem`)
    .handleVariable()
    .createProperty(name)
    ?.updateMeta('utilities', name, pluginOrder[name], 4, true);
}

// https://windicss.org/utilities/sizing.html#min-width
// https://windicss.org/utilities/sizing.html#min-height
// https://windicss.org/utilities/sizing.html#max-width
// https://windicss.org/utilities/sizing.html#max-height
function minMaxSize(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler.catchPrefix(/^(min|max)-(w|h)/, true);
  if (!handler || !handler.prefix) return;
  const key = utility.raw.substring(handler.prefix.length + 1);
  const prop = handler.prefix.replace('h', 'height').replace('w', 'width');
  const group = dashToCamel(prop) as ('minHeight'|'maxHeight'|'minWidth'|'maxWidth');
  const sizes = toType(theme(group), 'object') as { [key: string]: string };
  // handle static
  if (key in sizes) {
    const value = sizes[key];
    switch (sizes[key]) {
    case 'min-content':
      return new Style(utility.class, [
        new Property(prop, '-webkit-min-content'),
        new Property(prop, '-moz-min-content'),
        new Property(prop, 'min-content'),
      ]).updateMeta('utilities', group, pluginOrder[group], 2, true);
    case 'max-content':
      return new Style(utility.class, [
        new Property(prop, '-webkit-max-content'),
        new Property(prop, '-moz-max-content'),
        new Property(prop, 'max-content'),
      ]).updateMeta('utilities', group, pluginOrder[group], 3, true);
    default:
      return new Style(utility.class, new Property(prop, value)).updateMeta('utilities', group, pluginOrder[group], 1, true);
    }
  }

  return handler
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNxl((number: number) => `${(number - 3) * 8 + 48}rem`)
    .handleVariable()
    .createProperty(prop)
    ?.updateMeta('utilities', group, pluginOrder[group], 4, true);
}

// https://windicss.org/utilities/typography.html#text-opacity
// https://windicss.org/utilities/typography.html#text-shadow
// https://windicss.org/utilities/typography.html#text-stroke
// https://windicss.org/utilities/typography.html#text-color
// https://windicss.org/utilities/typography.html#font-size
function text(utility: Utility, { theme }: PluginUtils): Output {
  // handle font opacity
  const handler = utility.handler;
  return handler.catchPrefix(/^text-opacity/, true)
    ?.handleStatic(theme('textOpacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-text-opacity')
    ?.updateMeta('utilities', 'textOpacity', pluginOrder.textOpacity, 1, true)

    || handler.catchPrefix(/^text-shadow/, true)?.then(() => (utility.raw === 'text-shadow'
      ? new Property('text-shadow', theme('textShadow.DEFAULT', '0px 0px 1px rgb(0 0 0 / 20%), 0px 0px 1px rgb(1 0 5 / 10%)') as string)
      : utility.handler
        .handleStatic(theme('textShadow'))
        .createProperty('text-shadow')
    )?.updateMeta('utilities', 'textShadow', pluginOrder.textShadow, 1, true))

    || handler
      .catchPrefix(/^text-stroke-opacity/, true)
      ?.handleStatic(theme('opacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-ring-offset-opacity')
      ?.updateMeta('utilities', 'textStrokeColor', pluginOrder.textStrokeColor, 3, true)

    || handler.catchPrefix(/^text-stroke/, true)?.then(() => {
      if (utility.raw === 'text-stroke') return new Style('text-stroke', [
        new Property('-webkit-text-stroke-color', theme('textStrokeColor.DEFAULT', '#e4e4e7') as string),
        new Property('-webkit-text-stroke-width', theme('textStrokeWidth.DEFAULT', 'medium') as string),
      ]).updateMeta('utilities', 'textStrokeColor', pluginOrder.textStrokeColor, 1, true);

      return utility.clone('textStroke' + utility.raw.slice(11)).handler
        ?.handleColor(theme('textStrokeColor'))
        .handleOpacity(theme('opacity'))
        .handleVariable()
        .createColorStyle(utility.class, '-webkit-text-stroke-color', '--tw-text-stroke-opacity')
        ?.updateMeta('utilities', 'textStrokeColor', pluginOrder.textStrokeColor, 2, true)

        || handler
          ?.handleStatic(theme('textStrokeWidth'))
          .handleNumber(0, undefined, 'int', (number) => `${number}px`)
          .handleSize()
          .createProperty('-webkit-text-stroke-width')
          ?.updateMeta('utilities', 'textStrokeWidth', pluginOrder.textStrokeWidth, 1, true);
    })

    // handle text size variable
    || handler.catchPrefix(/^text-size/, true)
      ?.handleVariable()
      .createStyle(utility.class, (value) => [ new Property('font-size', value), new Property('line-height', '1') ])
      ?.updateMeta('utilities', 'fontSize', pluginOrder.fontSize, 2, true)

    // handle text color
    || handler.catchPrefix(/^text/)
      ?.handleColor(theme('textColor'))
      .handleOpacity(theme('textOpacity'))
      .handleSquareBrackets(notNumberLead)
      .handleVariable()
      .createColorStyle(utility.class, 'color', '--tw-text-opacity')
      ?.updateMeta('utilities', 'textColor', pluginOrder.textColor, 0, true)

    // handle font sizes
    || handler.then(() => {
      const fontSizes = toType(theme('fontSize'), 'object') as { [key: string]: FontSize };
      if (utility.amount in fontSizes) return new Style(utility.class, generateFontSize(fontSizes[utility.amount])).updateMeta('utilities', 'fontSize', pluginOrder.fontSize, 1, true);

      return handler.handleSquareBrackets(isNumberLead).handleNxl((number: number) => `${number}rem`).handleSize()
        .createStyle(utility.class, (value) => [ new Property('font-size', value), new Property('line-height', '1') ])
        ?.updateMeta('utilities', 'fontSize', pluginOrder.fontSize, 2, true);
    });
}

// https://windicss.org/utilities/typography.html#font-family
// https://windicss.org/utilities/typography.html#font-weight
function font(utility: Utility, { theme }: PluginUtils): Output {
  const fonts = theme('fontFamily') as { [ key : string ] : string | string[] };
  const map:{ [ key : string ] : string } = {};
  for (const [key, value] of Object.entries(fonts)) {
    map[key] = Array.isArray(value)? value.join(',') : value;
  }
  return utility.handler.catchPrefix(/^font/)?.then((handler) => (
    handler
      .handleStatic(map)
      .createProperty('font-family')
      ?.updateMeta('utilities', 'fontFamily', pluginOrder.fontFamily, 1, true)
    || handler
      .handleStatic(theme('fontWeight'))
      .handleNumber(0, 900, 'int')
      .handleVariable()
      .createProperty('font-weight')
      ?.updateMeta('utilities', 'fontWeight', pluginOrder.fontWeight, 1, true)
  ));
}

// https://windicss.org/utilities/typography.html#letter-spacing
function letterSpacing(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^-?tracking/)
    ?.handleStatic(theme('letterSpacing'))
    .handleSquareBrackets()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .createProperty('letter-spacing')
    ?.updateMeta('utilities', 'letterSpacing', pluginOrder.letterSpacing, 1, true);
}

// https://windicss.org/utilities/typography.html#text-decoration
function textDecoration(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler;
  return handler.catchPrefix(/^underline-opacity/, true)
    ?.handleStatic(theme('textDecorationOpacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-line-opacity')
    ?.updateMeta('utilities', 'textDecorationOpacity', pluginOrder.textDecorationOpacity, 1, true)

  || handler.catchPrefix(/^underline-offset/, true)
    ?.handleStatic(theme('textDecorationOffset'))
    .handleNumber(0, undefined, 'int', number => `${number}px`)
    .handleSize()
    .createProperty('text-underline-offset')
    ?.updateMeta('utilities', 'textDecorationOffset', pluginOrder.textDecorationOffset, 1, true)

  || handler.catchPrefix(/^underline/)
    ?.handleColor(theme('textDecorationColor'))
    .handleOpacity(theme('opacity'))
    .handleVariable()
    .createColorStyle(utility.class, ['-webkit-text-decoration-color', 'text-decoration-color'], '--tw-line-opacity')
    ?.updateMeta('utilities', 'textDecorationColor', pluginOrder.textDecorationColor, 0, true)

  || handler
    .handleStatic(theme('textDecorationLength'))
    .handleNumber(0, undefined, 'int', (number: number) => `${number}px`)
    .handleSize()
    .createProperty('text-decoration-thickness')
    ?.updateMeta('utilities', 'textDecorationLength', pluginOrder.textDecorationLength, 1, true);
}

// https://windicss.org/utilities/typography.html#line-height
function lineHeight(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^leading/)
    ?.handleStatic(theme('lineHeight'))
    .handleNumber(0, undefined, 'int', (number: number) => `${number * 0.25}rem`)
    .handleSquareBrackets()
    .handleSize()
    .handleVariable()
    .createProperty('line-height')
    ?.updateMeta('utilities', 'lineHeight', pluginOrder.lineHeight, 1, true);
}

// https://windicss.org/utilities/behaviors.html#list-style-type
function listStyleType(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('listStyleType'))
    .createProperty('list-style-type')
    ?.updateMeta('utilities', 'listStyleType', pluginOrder.listStyleType, 1, true);
}

// https://windicss.org/utilities/behaviors.html#placeholder-color
// https://windicss.org/utilities/behaviors.html#placeholder-opacity
function placeholder(utility: Utility, { theme, config }: PluginUtils): Output {
  const handler = utility.handler;
  return handler.catchPrefix(/^placeholder-opacity/, true)
    ?.handleStatic(theme('placeholderOpacity'))
    .handleSquareBrackets()
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .callback(value => generatePlaceholder(utility.class, new Property('--tw-placeholder-opacity', value), config('prefixer') as boolean)
      .map(style => style.updateMeta('utilities', 'placeholderOpacity', pluginOrder.placeholderOpacity, 1, true))
    )

  || handler.catchPrefix(/^placeholder/)
    ?.handleColor(theme('placeholderColor'))
    .handleOpacity(theme('placeholderOpacity'))
    .handleSquareBrackets()
    .handleVariable()
    .then((handler) => {
      const color = handler.createColorStyle(utility.class, 'color', '--tw-placeholder-opacity');
      if (color) return generatePlaceholder(color.selector || '', color.property, config('prefixer') as boolean).map(i => i.updateMeta('utilities', 'placeholderColor', pluginOrder.placeholderColor, 2, true));
    });
}

// https://windicss.org/utilities/behaviors.html#caret-color
// https://windicss.org/utilities/behaviors.html#caret-opacity
function caret(utility: Utility, { theme }: PluginUtils): Output {
  // handle caret opacity
  const handler = utility.handler;
  return handler.catchPrefix(/^caret-opacity/, true)
    ?.handleStatic(theme('caretOpacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-caret-opacity')
    ?.updateMeta('utilities', 'caretOpacity', pluginOrder.caretOpacity, 1, true)

  || handler.catchPrefix(/^caret/)
    ?.handleColor(theme('caretColor'))
    .handleOpacity(theme('caretOpacity'))
    .handleVariable()
    .createColorStyle(utility.class, 'caret-color', '--tw-caret-opacity')
    ?.updateMeta('utilities', 'caretColor', pluginOrder.caretColor, 0, true);
}

// https://windicss.org/utilities/typography.html#tab-size
function tabSize(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^tab/)
    ?.handleStatic(theme('tabSize'))
    .handleNumber(0, undefined, 'int')
    .handleSize()
    .createProperty(['-moz-tab-size', '-o-tab-size', 'tab-size'])
    ?.updateMeta('utilities', 'tabSize', pluginOrder.tabSize, 1, true);
}

// https://windicss.org/utilities/typography.html#text-indent
function textIndent(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^-?indent/)
    ?.handleStatic(theme('textIndent'))
    .handleSize()
    .handleFraction()
    .handleNegative()
    .createProperty('text-indent')
    ?.updateMeta('utilities', 'textIndent', pluginOrder.textIndent, 1, true);
}

// https://windicss.org/utilities/backgrounds.html#background-color
// https://windicss.org/utilities/backgrounds.html#background-opacity
// https://windicss.org/utilities/backgrounds.html#background-position
// https://windicss.org/utilities/backgrounds.html#background-size
// https://windicss.org/utilities/backgrounds.html#background-image
function background(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  // handle background positions
  const positions = toType(theme('backgroundPosition'), 'object') as { [key: string]: string };
  if (body in positions) return new Property('background-position', positions[body]).updateMeta('utilities', 'backgroundPosition', pluginOrder.backgroundPosition, 1, true);
  // handle background sizes
  const sizes = toType(theme('backgroundSize'), 'object') as { [key: string]: string };
  if (body in sizes) return new Property('background-size', sizes[body]).updateMeta('utilities', 'backgroundSize', pluginOrder.backgroundSize, 1, true);
  // handle background image
  const images = toType(theme('backgroundImage'), 'object') as { [key: string]: string };
  if (body in images) {
    const prefixer = linearGradient(images[body]);
    if (Array.isArray(prefixer)) return new Style(utility.class, prefixer.map((i) => new Property('background-image', i))).updateMeta('utilities', 'backgroundImage', pluginOrder.backgroundImage, 2, true);
    return new Property('background-image', prefixer).updateMeta('utilities', 'backgroundImage', pluginOrder.backgroundImage, 1, true);
  }
  // handle background opacity
  return utility.handler
    .catchPrefix(/^bg-opacity/, true)
    ?.handleStatic(theme('backgroundOpacity'))
    .handleSquareBrackets()
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-bg-opacity')
    ?.updateMeta('utilities', 'backgroundOpacity', pluginOrder.backgroundOpacity, 1, true)

  // handle background color
  || utility.handler.catchPrefix(/^bg/)
    ?.handleColor(theme('backgroundColor'))
    .handleOpacity(theme('backgroundOpacity'))
    .handleSquareBrackets(notNumberLead)
    .handleVariable()
    .createColorStyle(utility.class, 'background-color', '--tw-bg-opacity')
    ?.updateMeta('utilities', 'backgroundColor', pluginOrder.backgroundColor, 0, true);
}

// https://windicss.org/utilities/backgrounds.html#gradient-from
function gradientColorFrom(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler;
  return handler.catchPrefix(/^from-opacity/, true)
    ?.handleStatic(theme('opacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-from-opacity')
    ?.updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 2, true)

  || handler.catchPrefix(/^from/)
    ?.handleColor(theme('gradientColorStops'))
    .handleOpacity(theme('opacity'))
    .handleVariable()
    .handleSquareBrackets()
    .then(handler => {
      if (handler.color || handler.value) {
        return new Style(utility.class, [
          new Property('--tw-gradient-from', handler.createColorValue('var(--tw-from-opacity, 1)')),
          new Property('--tw-gradient-stops', 'var(--tw-gradient-from), var(--tw-gradient-to, rgba(255, 255, 255, 0))'),
        ]).updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 1, true);
      }
    });
}

// https://windicss.org/utilities/backgrounds.html#gradient-via
function gradientColorVia(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler;
  return handler.catchPrefix(/^via-opacity/, true)
    ?.handleStatic(theme('opacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-via-opacity')
    ?.updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 4, true)

  || handler.catchPrefix(/^via/, true)
    ?.handleColor(theme('gradientColorStops'))
    .handleOpacity(theme('opacity'))
    .handleVariable()
    .handleSquareBrackets()
    .then(handler => {
      if (handler.color || handler.value) {
        return new Style(utility.class,
          new Property('--tw-gradient-stops', `var(--tw-gradient-from), ${handler.createColorValue('var(--tw-via-opacity, 1)')}, var(--tw-gradient-to, rgba(255, 255, 255, 0))`)
        )?.updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 3, true);
      }
    });
}

// https://windicss.org/utilities/backgrounds.html#gradient-to
function gradientColorTo(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler;
  return handler.catchPrefix(/^to-opacity/, true)
    ?.handleStatic(theme('opacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-to-opacity')
    ?.updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 6, true)

  || handler.catchPrefix(/^to/, true)
    ?.handleColor(theme('gradientColorStops'))
    .handleOpacity(theme('opacity'))
    .handleVariable()
    .handleSquareBrackets()
    .then(handler => {
      if (handler.color || handler.value) {
        return new Style(utility.class,
          new Property('--tw-gradient-to', handler.createColorValue('var(--tw-to-opacity, 1)'))
        )?.updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 5, true);
      }
    });
}

// https://windicss.org/utilities/borders.html#border-radius
function borderRadius(utility: Utility, { theme }: PluginUtils): Output {
  let raw = utility.raw;
  if (utility.match(/^rounded(-[trbl][trbl]?)?$/)) raw += '-DEFAULT';
  const directions = expandDirection(raw.match(/rounded-[trbl][trbl]?-/)?.[0].slice(8, -1) || '', true);
  if (!directions) return;
  return utility.handler.catchPrefix(/^rounded(-[trbl][trbl]?)?/)
    ?.handleStatic(theme('borderRadius'))
    .handleSquareBrackets()
    .handleFraction()
    .handleNxl((number: number) => `${number * 0.5}rem`)
    .handleSize()
    .handleVariable()
    .createProperty(directions[0] === '*' ? 'border-radius' : directions.map((i) => `border-${i}-radius`))
    ?.updateMeta('utilities', 'borderRadius', pluginOrder.borderRadius, -(directions[0] === '*' ? 3 : directions.length), true);
}

// https://windicss.org/utilities/borders.html#border-width
// https://windicss.org/utilities/borders.html#border-color
// https://windicss.org/utilities/borders.html#border-opacity
function border(utility: Utility, plugin: PluginUtils, dir = '*', real?: Utility): Output {
  // handle border opacity
  const handler = utility.handler;
  const borders = toType(plugin.theme('borderWidth'), 'object') as { [key: string]: string };
  return handler.catchPrefix(/^border-opacity/, true)
    ?.handleStatic(plugin.theme('borderOpacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-border-opacity')
    ?.updateMeta('utilities', 'borderOpacity', pluginOrder.borderOpacity, 1, true)

  // handle border side
  || dir === '*' && handler.catchPrefix(/^border-[tlbr]/, true)
    ?.then(() => border(utility.clone('border' + utility.raw.slice(8)), plugin, expandDirection(handler.prefix?.slice(-1) as string, false)?.[0], utility))

  // handle border color
  || handler.catchPrefix(/^border/)
    ?.handleColor(plugin.theme('borderColor'))
    .handleOpacity(plugin.theme('borderOpacity'))
    .handleSquareBrackets(notNumberLead)
    .handleVariable((variable: string) => utility.raw.startsWith('border-$') ? `var(--${variable})` : undefined)
    .then(() => {
      if (dir !== '*' && handler.opacity)
        return new Property(`border-${dir}-color`, handler.createColorValue(handler.opacity)).updateMeta('utilities', 'borderColor', pluginOrder.borderColor, 5, true);
      return handler.createColorStyle((real || utility).class, dir === '*' ? 'border-color': `border-${dir}-color`, '--tw-border-opacity')
        ?.updateMeta('utilities', 'borderColor', pluginOrder.borderColor, dir === '*' ? (handler.opacity ? 3 : 2) : 4, true);
    })


  // handle border width
  || handler.catchPrefix(/^border(-width)?/)
    ?.handleStatic(borders)
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'int', (number: number) => `${number}px`)
    .handleSize()
    .handleVariable()
    .createProperty(dir === '*' ? 'border-width': `border-${dir}-width`)
    ?.updateMeta('utilities', 'borderWidth', pluginOrder.borderWidth, dir === '*' ? 1 : 2, true);
}

// https://windicss.org/utilities/borders.html#divide-width
// https://windicss.org/utilities/borders.html#divide-color
// https://windicss.org/utilities/borders.html#divide-opacity
// https://windicss.org/utilities/borders.html#divide-style
function divide(utility: Utility, { theme }: PluginUtils): Output {
  // handle divide style
  const handler = utility.handler;
  if (/^divide-(solid|dashed|dotted|double|none)$/.test(utility.raw)) return new Property('border-style', utility.amount).toStyle(utility.class).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideStyle', pluginOrder.divideStyle, 1, true);
  if (utility.raw === 'divide-y-reverse')  return new Style(utility.class, new Property('--tw-divide-y-reverse', '1')).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 5, true);
  if (utility.raw === 'divide-x-reverse')  return new Style(utility.class, new Property('--tw-divide-x-reverse', '1')).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 6, true);
  if (handler._amount === 'x' || handler._amount === 'y') handler._amount = ''; // fix divide-x and divide-y
  // handle divide opacity
  return handler.catchPrefix(/^divide-opacity/, true)
    ?.handleStatic(theme('divideOpacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-divide-opacity')
    ?.toStyle(utility.class)
    .child('> :not([hidden]) ~ :not([hidden])')
    .updateMeta('utilities', 'divideOpacity', pluginOrder.divideOpacity, 1, true)

  // handle divide color
  || handler
    .catchPrefix(/^divide/)
    ?.handleColor(theme('divideColor'))
    .handleOpacity(theme('divideOpacity'))
    .handleVariable((variable: string) => utility.raw.startsWith('divide-$') ? `var(--${variable})` : undefined)
    .createColorStyle(utility.class, 'border-color', '--tw-divide-opacity')
    ?.child('> :not([hidden]) ~ :not([hidden])')
    .updateMeta('utilities', 'divideColor', pluginOrder.divideColor, 0, true)
  // handle divide width dynamic
  || handler.catchPrefix(/^divide-[xy]/, true)
    ?.handleStatic(theme('divideWidth'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'float', (number: number) => `${number}px`)
    .handleSize()
    .handleVariable()
    .callback(value => {
      switch (handler.prefix?.slice(-1)) {
      case 'x':
        return new Style(utility.class, [
          new Property('--tw-divide-x-reverse', '0'),
          new Property('border-right-width', `calc(${value} * var(--tw-divide-x-reverse))`),
          new Property('border-left-width', `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`),
        ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 2, true);
      case 'y':
        return new Style(utility.class, [
          new Property('--tw-divide-y-reverse', '0'),
          new Property('border-top-width', `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`),
          new Property('border-bottom-width', `calc(${value} * var(--tw-divide-y-reverse))`),
        ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 1, true);
      }
    });
}

// https://windicss.org/utilities/borders.html#ring-offset-width
// https://windicss.org/utilities/borders.html#ring-offset-color
function ringOffset(utility: Utility, { theme }: PluginUtils): Output {
  // handle ring offset width variable
  const handler = utility.handler;
  return handler.catchPrefix(/^ringOffset-width/, true)
    ?.handleVariable()
    .createStyle(utility.class.replace('ringOffset', 'ring-offset'), value => new Property('--tw-ring-offset-width', value))
    ?.updateMeta('utilities', 'ringOffsetWidth', pluginOrder.ringOffsetWidth, 2, true)

  || handler.catchPrefix(/^ringOffset-opacity/, true)
    ?.handleStatic(theme('opacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-ring-offset-opacity')
    ?.updateMeta('utilities', 'ringOffsetColor', pluginOrder.ringOffsetColor, 2, true)

  // handle ring offset color
  || handler.catchPrefix(/^ringOffset/)
    ?.handleColor(theme('ringOffsetColor'))
    .handleOpacity('ringOpacity')
    .handleVariable()
    .handleSquareBrackets()
    .createColorStyle(utility.class.replace('ringOffset', 'ring-offset'), '--tw-ring-offset-color', '--tw-ring-offset-opacity')
    ?.updateMeta('utilities', 'ringOffsetColor', pluginOrder.ringOffsetColor, 1, true)

  // handle ring offset width
  || handler
    .handleStatic(theme('ringOffsetWidth'))
    .handleSquareBrackets(isNumberLead)
    .handleNumber(0, undefined, 'float', (number: number) => `${number}px`)
    .handleSize()
    .createStyle(utility.class.replace('ringOffset', 'ring-offset'), value => new Property('--tw-ring-offset-width', value))
    ?.updateMeta('utilities', 'ringOffsetWidth', pluginOrder.ringOffsetWidth, 1, true);
}

// https://windicss.org/utilities/borders.html#ring-width
// https://windicss.org/utilities/borders.html#ring-color
// https://windicss.org/utilities/borders.html#ring-opacity
function ring(utility: Utility, utils: PluginUtils): Output {
  if (utility.raw === 'ring-inset') return new Property('--tw-ring-inset', 'inset').updateMeta('utilities', 'ringWidth', pluginOrder.ringWidth, 3, true);

  // handle ring offset
  const handler = utility.handler;
  return handler.catchPrefix(/^ring-offset/, true)
    ?.then(() => ringOffset(utility.clone(utility.raw.replace('ring-offset', 'ringOffset')), utils))

  // handle ring opacity
  || handler.catchPrefix(/^ring-opacity/, true)
    ?.handleStatic(utils.theme('ringOpacity'))
    .handleSquareBrackets()
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-ring-opacity')
    ?.updateMeta('utilities', 'ringOpacity', pluginOrder.ringOpacity, 1, true)

  // handle ring color
  || handler.catchPrefix(/^ring/)
    ?.handleColor(utils.theme('ringColor'))
    .handleOpacity(utils.theme('ringOpacity'))
    .handleSquareBrackets(notNumberLead)
    .handleVariable((variable: string) => utility.raw.startsWith('ring-$') ? `var(--${variable})` : undefined)
    .createColorStyle(utility.class, '--tw-ring-color', '--tw-ring-opacity')
    ?.updateMeta('utilities', 'ringColor', pluginOrder.ringColor, 0, true)

  // handle ring width
  || handler.catchPrefix(/^ring(-width)?/)
    ?.handleStatic(utils.theme('ringWidth'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'float', (number: number) => `${number}px`)
    .handleSize()
    .handleVariable()
    .createStyle(utility.class, value => [
      new Property('--tw-ring-offset-shadow', 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)'),
      new Property('--tw-ring-shadow', `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`),
      new Property(['-webkit-box-shadow', 'box-shadow'], 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)'),
    ])
    ?.updateMeta('utilities', 'ringWidth', pluginOrder.ringWidth, (utility.raw === 'ring' ? 1 : 2), true);
}

// https://windicss.org/utilities/filters.html#filter-blur
function blur(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^blur/)
    ?.handleBody(theme('blur'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'int', (number) => `${number}px`)
    .handleSize()
    .createProperty('--tw-blur', value => `blur(${value})`)
    ?.updateMeta('utilities', 'blur', pluginOrder.blur, 1, true);
}

// https://windicss.org/utilities/filters.html#filter-brightness
function brightness(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^brightness/)
    ?.handleBody(theme('brightness'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'int', (number) => `${number/100}`)
    .createProperty('--tw-brightness', value => `brightness(${value})`)
    ?.updateMeta('utilities', 'brightness', pluginOrder.brightness, 1, true);
}

// https://windicss.org/utilities/filters.html#filter-contrast
function contrast(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^contrast/)
    ?.handleBody(theme('contrast'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'int', (number) => `${number/100}`)
    .createProperty('--tw-contrast', value => `contrast(${value})`)
    ?.updateMeta('utilities', 'contrast', pluginOrder.contrast, 1, true);
}

// https://windicss.org/utilities/filters.html#filter-drop-shadow
function dropShadow(utility: Utility, { theme }: PluginUtils): Output {
  let value;
  if (utility.raw === 'drop-shadow') {
    value = theme('dropShadow.DEFAULT', ['0 1px 2px rgba(0, 0, 0, 0.1)', '0 1px 1px rgba(0, 0, 0, 0.06)']) as string | string[];
  } else {
    const dropShadows = theme('dropShadow') as {[key:string]:string|string[]};
    const amount = utility.amount;
    if (utility.handler.isStatic(dropShadows, amount)) value = dropShadows[amount];
  }
  if (value) return new Property('--tw-drop-shadow', Array.isArray(value)? value.map(i => `drop-shadow(${i})`).join(' '): `drop-shadow(${value})`).updateMeta('utilities', 'dropShadow', pluginOrder.dropShadow, 1, true);
}

// https://windicss.org/utilities/filters.html#filter-grayscale
function grayscale(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^grayscale/)
    ?.handleBody(theme('grayscale'))
    .handleSquareBrackets()
    .handleNumber(0, 100, 'int', (number) => `${number/100}`)
    .createProperty('--tw-grayscale', value => `grayscale(${value})`)
    ?.updateMeta('utilities', 'grayscale', pluginOrder.grayscale, 1, true);
}

// https://windicss.org/utilities/filters.html#filter-hue-rotate
function hueRotate(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^-?hue-rotate/)
    ?.handleBody(theme('hueRotate'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'float', (number) => `${number}deg`)
    .handleNegative()
    .createProperty('--tw-hue-rotate', value => `hue-rotate(${value})`)
    ?.updateMeta('utilities', 'hueRotate', pluginOrder.hueRotate, 1, true);
}

// https://windicss.org/utilities/filters.html#filter-invert
function invert(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^invert/)
    ?.handleBody(theme('invert'))
    .handleSquareBrackets()
    .handleNumber(0, 100, 'int', (number) => `${number/100}`)
    .createProperty('--tw-invert', value => `invert(${value})`)
    ?.updateMeta('utilities', 'invert', pluginOrder.invert, 1, true);
}

// https://windicss.org/utilities/filters.html#filter-saturate
function saturate(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^saturate/)
    ?.handleBody(theme('saturate'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'int', (number) => `${number/100}`)
    .createProperty('--tw-saturate', value => `saturate(${value})`)
    ?.updateMeta('utilities', 'saturate', pluginOrder.saturate, 1, true);
}

// https://windicss.org/utilities/filters.html#filter-sepia
function sepia(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^sepia/)
    ?.handleBody(theme('sepia'))
    .handleSquareBrackets()
    .handleNumber(0, 100, 'int', (number) => `${number/100}`)
    .createProperty('--tw-sepia', value => `sepia(${value})`)
    ?.updateMeta('utilities', 'sepia', pluginOrder.sepia, 1, true);
}

// https://windicss.org/utilities/filters.html#backdrop-filter
// https://windicss.org/utilities/filters.html#backdrop-blur
// https://windicss.org/utilities/filters.html#backdrop-brightness
// https://windicss.org/utilities/filters.html#backdrop-contrast
// https://windicss.org/utilities/filters.html#backdrop-grayscale
// https://windicss.org/utilities/filters.html#backdrop-hue-rotate
// https://windicss.org/utilities/filters.html#backdrop-invert
// https://windicss.org/utilities/filters.html#backdrop-opacity
// https://windicss.org/utilities/filters.html#backdrop-saturate
// https://windicss.org/utilities/filters.html#backdrop-sepia
function backdrop(utility: Utility, { theme }: PluginUtils): Output {
  utility = utility.clone(utility.raw.slice(9));
  switch (utility.match(/[^-]+/)) {
  case 'blur':
    return utility.handler
      .catchPrefix(/^blur/)
      ?.handleBody(theme('backdropBlur'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'int', (number) => `${number}px`)
      .handleSize()
      .createProperty('--tw-backdrop-blur', value => `blur(${value})`)
      ?.updateMeta('utilities', 'backdropBlur', pluginOrder.backdropBlur, 1, true);
  case 'brightness':
    return utility.handler
      .catchPrefix(/^brightness/)
      ?.handleBody(theme('backdropBrightness'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-brightness', value => `brightness(${value})`)
      ?.updateMeta('utilities', 'backdropBrightness', pluginOrder.backdropBrightness, 1, true);
  case 'contrast':
    return utility.handler
      .catchPrefix(/^contrast/)
      ?.handleBody(theme('backdropContrast'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-contrast', value => `contrast(${value})`)
      ?.updateMeta('utilities', 'backdropContrast', pluginOrder.backdropContrast, 1, true);
  case 'grayscale':
    return utility.handler
      .catchPrefix(/^grayscale/)
      ?.handleBody(theme('backdropGrayscale'))
      .handleSquareBrackets()
      .handleNumber(0, 100, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-grayscale', value => `grayscale(${value})`)
      ?.updateMeta('utilities', 'backdropGrayscale', pluginOrder.backdropGrayscale, 1, true);
  case 'hue':
    return utility.handler
      .catchPrefix(/^-?hue-rotate/)
      ?.handleBody(theme('backdropHueRotate'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'float', (number) => `${number}deg`)
      .handleNegative()
      .createProperty('--tw-backdrop-hue-rotate', value => `hue-rotate(${value})`)
      ?.updateMeta('utilities', 'backdropHueRotate', pluginOrder.backdropHueRotate, 1, true);
  case 'invert':
    return utility.handler
      .catchPrefix(/^invert/)
      ?.handleBody(theme('backdropInvert'))
      .handleSquareBrackets()
      .handleNumber(0, 100, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-invert', value => `invert(${value})`)
      ?.updateMeta('utilities', 'backdropInvert', pluginOrder.backdropInvert, 1, true);
  case 'opacity':
    return utility.handler
      .catchPrefix(/^opacity/)
      ?.handleBody(theme('backdropOpacity'))
      .handleSquareBrackets()
      .handleNumber(0, 100, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-opacity', value => `opacity(${value})`)
      ?.updateMeta('utilities', 'backdropOpacity', pluginOrder.backdropOpacity, 1, true);
  case 'saturate':
    return utility.handler
      .catchPrefix(/^saturate/)
      ?.handleBody(theme('backdropSaturate'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-saturate', value => `saturate(${value})`)
      ?.updateMeta('utilities', 'backdropSaturate', pluginOrder.backdropSaturate, 1, true);
  case 'sepia':
    return utility.handler
      .catchPrefix(/^sepia/)
      ?.handleBody(theme('backdropSepia'))
      .handleSquareBrackets()
      .handleNumber(0, 100, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-sepia', value => `sepia(${value})`)
      ?.updateMeta('utilities', 'backdropSepia', pluginOrder.backdropSepia, 1, true);
  }
}

// https://windicss.org/utilities/effects.html#box-shadow
function boxShadow(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^box-shadow/)
    ?.handleBody(theme('boxShadow'))
    .createStyle(utility.class, value => [
      new Property('--tw-shadow-color', '0, 0, 0'),
      new Property('--tw-shadow', value.replace(/rgba\s*\(\s*0\s*,\s*0\s*,\s*0/g, 'rgba(var(--tw-shadow-color)')),
      new Property(['-webkit-box-shadow', 'box-shadow'], 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)'),
    ])?.updateMeta('utilities', 'boxShadow', pluginOrder.boxShadow, 0, true)

  || utility.handler
    .handleColor(theme('boxShadowColor'))
    .handleOpacity(theme('opacity'))
    .handleSquareBrackets()
    .handleVariable()
    .createColorStyle(utility.class, '--tw-shadow-color', undefined, false)
    ?.updateMeta('utilities', 'boxShadowColor', pluginOrder.boxShadowColor, 0, true);
}

// https://windicss.org/utilities/effects.html#opacity
function opacity(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^opacity/)
    ?.handleStatic(theme('opacity'))
    .handleSquareBrackets()
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('opacity')
    ?.updateMeta('utilities', 'opacity', pluginOrder.opacity, 0, true);
}

// https://windicss.org/utilities/transitions.html#transition-property
function transition(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  const props = toType(theme('transitionProperty'), 'object') as { [key: string]: string };
  for (const [key, value] of Object.entries(props)) {
    if (body === key || (body === '' && key === 'DEFAULT')) {
      if (value === 'none') return new Property(['-webkit-transition-property', '-o-transition-property', 'transition-property'], 'none').updateMeta('utilities', 'transitionProperty', pluginOrder.transitionProperty, 1, true);
      return new Style(utility.class, [
        new Property('-webkit-transition-property', value.replace(/(?=(transform|box-shadow))/g, '-webkit-')),
        new Property('-o-transition-property', value),
        new Property('transition-property', value.replace(/transform/g, 'transform, -webkit-transform').replace(/box-shadow/g, 'box-shadow, -webkit-box-shadow')),
        new Property(['-webkit-transition-timing-function', '-o-transition-timing-function', 'transition-timing-function'], toType(theme('transitionTimingFunction.DEFAULT'), 'string') ?? 'cubic-bezier(0.4, 0, 0.2, 1)'),
        new Property(['-webkit-transition-duration', '-o-transition-duration', 'transition-duration' ], toType(theme('transitionDuration.DEFAULT'), 'string') ?? '150ms'),
      ]).updateMeta('utilities', 'transitionProperty', pluginOrder.transitionProperty, 2, true);
    }
  }
}

// https://windicss.org/utilities/transitions.html#transition-duration
function duration(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^duration/)
    ?.handleStatic(theme('transitionDuration'))
    .handleSquareBrackets()
    .handleTime(0, undefined, 'float')
    .handleNumber(0, undefined, 'int', (number: number) => `${number}ms`)
    .handleVariable()
    .createProperty(['-webkit-transition-duration', '-o-transition-duration', 'transition-duration'])
    ?.updateMeta('utilities', 'transitionDuration', pluginOrder.transitionDuration, 1, true);
}

// https://windicss.org/utilities/transitions.html#transition-timing-function
function transitionTimingFunction(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('transitionTimingFunction'))
    .createProperty(['-webkit-transition-timing-function', '-o-transition-timing-function', 'transition-timing-function'])
    ?.updateMeta('utilities', 'transitionTimingFunction', pluginOrder.transitionTimingFunction, 1, true);
}

// https://windicss.org/utilities/transitions.html#transition-delay
function delay(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^delay/)
    ?.handleStatic(theme('transitionDelay'))
    .handleSquareBrackets()
    .handleTime(0, undefined, 'float')
    .handleNumber(0, undefined, 'int', (number: number) => `${number}ms`)
    .handleVariable()
    .createProperty(['-webkit-transition-delay', '-o-transition-delay', 'transition-delay'])
    ?.updateMeta('utilities', 'transitionDelay', pluginOrder.transitionDelay, 0, true);
}

// https://windicss.org/utilities/behaviors.html#animation
function animation(utility: Utility, { theme, config }: PluginUtils): Output {
  if (utility.raw.startsWith('animate-ease')) {
    return utility.clone(utility.raw.slice(8)).handler
      .catchPrefix(/^ease/)
      ?.handleBody(theme('animationTimingFunction'))
      .handleSquareBrackets()
      .createProperty(['-webkit-animation-timing-function', 'animation-timing-function'])
      ?.updateMeta('utilities', 'animation', pluginOrder.animation, 20, true);
  }
  if (utility.raw.startsWith('animate-duration')) {
    return utility.clone(utility.raw.slice(8)).handler
      .catchPrefix(/^duration/)
      ?.handleStatic(theme('animationDuration'))
      .handleSquareBrackets()
      .handleTime(0, undefined, 'float')
      .handleNumber(0, undefined, 'int', (number: number) => `${number}ms`)
      .handleVariable()
      .createProperty(['-webkit-animation-duration', 'animation-duration'])
      ?.updateMeta('utilities', 'animation', pluginOrder.animation, 21, true);
  }
  if (utility.raw.startsWith('animate-delay')) {
    return utility.clone(utility.raw.slice(8)).handler
      .catchPrefix(/^delay/)
      ?.handleStatic(theme('animationDelay'))
      .handleSquareBrackets()
      .handleTime(0, undefined, 'float')
      .handleNumber(0, undefined, 'int', (number: number) => `${number}ms`)
      .handleVariable()
      .createProperty(['-webkit-animation-delay', 'animation-delay'])
      ?.updateMeta('utilities', 'animation', pluginOrder.animation, 22, true);
  }
  const animateIterationCount = utility.handler.catchPrefix(/^animate/, true)?.handleBody(theme('animationIterationCount')).value || utility.handler.catchPrefix(/^animate-repeat/)?.handleNumber(0, undefined, 'int').handleSquareBrackets().value;
  if (animateIterationCount) return new Property(['-webkit-animation-iteration-count', 'animation-iteration-count'], animateIterationCount).updateMeta('utilities', 'animation', pluginOrder.animation, 23, true);
  const animations = toType(theme('animation'), 'object') as { [key: string]: string | { [key: string]: string } };
  const body = utility.body;
  if (body in animations) {
    let value = animations[body];
    const prop = config('prefixer') ? ['-webkit-animation', 'animation'] : 'animation';
    if (value === 'none') return new Property(prop, 'none').updateMeta('utilities', 'animation', pluginOrder.animation, 1, true);
    let styles, keyframe;
    if (typeof value === 'string') {
      keyframe = value.match(/^\w+/)?.[0];
      styles = [ new Style(utility.class, new Property(prop, value)) ];
    } else {
      keyframe = value['animation'] || value['animationName'] || value['animation-name'];
      if (config('prefixer')) {
        const props: { [ key:string ]: string } = {};
        for (const [k, v] of Object.entries(value)) {
          if (k.startsWith('animation') || k.startsWith('backface')) {
            props['-webkit-' + k] = v;
          } else if (k.startsWith('transform')) {
            props['-webkit-' + k] = v;
            props['-ms-' + k] = v;
          }
          props[k] = v;
        }
        value = props;
      }
      styles = Style.generate(utility.class, value).map(i => i.updateMeta('utilities', 'animation', pluginOrder.animation, 2, true));
    }

    if (styles) {
      return [
        ...styles.map(i => i.updateMeta('utilities', 'animation', pluginOrder.animation, 2, true)),
        ... keyframe ? Keyframes.generate(
          keyframe,
        (theme(`keyframes.${keyframe}`) ?? {}) as { [key: string]: { [key: string]: string } },
        undefined,
        config('prefixer', false) as boolean
        ).map(i => i.updateMeta('utilities', 'keyframes', pluginOrder.keyframes, 1, true)) : [],
      ];
    }
  }
}

// https://windicss.org/utilities/transforms.html#transform-origin
function transformOrigin(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  const origins = toType(theme('transformOrigin'), 'object') as { [key: string]: string };
  if (body in origins) return new Property(['-webkit-transform-origin', '-ms-transform-origin', 'transform-origin'], origins[body]).updateMeta('utilities', 'transformOrigin', pluginOrder.transformOrigin, 0, true);
}

// https://windicss.org/utilities/transforms.html#transform-scale
function scale(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler;
  return handler.catchPrefix(/^scale(-[xyz])?/, true)
    ?.handleStatic(theme('scale'))
    .handleNumber(0, undefined, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .callback(value => {
      switch (handler.prefix?.slice(-1)) {
      case 'x': return new Property('--tw-scale-x', value).updateMeta('utilities', 'scale', pluginOrder.scale, 2, true);
      case 'y': return new Property('--tw-scale-y', value).updateMeta('utilities', 'scale', pluginOrder.scale, 3, true);
      case 'z': return new Property('--tw-scale-z', value).updateMeta('utilities', 'scale', pluginOrder.scale, 4, true);
      default: return new Property(['--tw-scale-x', '--tw-scale-y', '--tw-scale-z'], value).updateMeta('utilities', 'scale', pluginOrder.scale, 1, true);
      }
    });
}

// https://windicss.org/utilities/transforms.html#transform-rotate
function rotate(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler;
  return handler.catchPrefix(/^-?rotate(-[xyz])?/, true)
    ?.handleStatic(theme('rotate'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'float', (number: number) => `${number}deg`)
    .handleNegative()
    .handleVariable()
    .callback(value => {
      switch (handler.prefix?.slice(-1)) {
      case 'x': return new Property('--tw-rotate-x', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 2, true);
      case 'y': return new Property('--tw-rotate-y', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 3, true);
      case 'z': return new Property('--tw-rotate-z', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 4, true);
      default: return new Property('--tw-rotate', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 1, true);
      }
    });
}

// https://windicss.org/utilities/transforms.html#transform-translate
function translate(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler;
  return handler.catchPrefix(/^-?translate-[xyz]/, true)
    ?.handleStatic(theme('translate'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .createProperty(`--tw-translate-${handler.prefix?.slice(-1)}`)
    ?.updateMeta('utilities', 'translate', pluginOrder.translate, utility.raw.charAt(0) === '-' ? 2 : 1, true);
}

// https://windicss.org/utilities/transforms.html#transform-skew
function skew(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler;
  return handler.catchPrefix(/^-?skew-[xy]/, true)
    ?.handleStatic(theme('skew'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'float', (number: number) => `${number}deg`)
    .handleNegative()
    .handleVariable()
    .createProperty(`--tw-skew-${handler.prefix?.slice(-1)}`)
    ?.updateMeta('utilities', 'skew', pluginOrder.skew, utility.raw.charAt(0) === '-' ? 2 : 1, true);
}

// https://windicss.org/utilities/transforms.html#perspective
function perspective(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler.catchPrefix(/^perspect-origin/, true)
    ?.then(() => {
      const origin = utility.clone('perspectOrigin' + utility.raw.slice(15)).handler
        .handleBody(theme('perspectiveOrigin'))
        .handleSquareBrackets()
        .createProperty(['-webkit-perspective-origin', 'perspective-origin'])
        ?.updateMeta('utilities', 'perspectiveOrigin', pluginOrder.perspectiveOrigin, 0, true);
      if (origin) return origin;
    })
    || utility.handler.catchPrefix(/^perspect/)
      ?.handleStatic(theme('perspective'))
      .handleNumber(0, undefined, 'int', number => `${number}px`)
      .handleSize()
      .handleSquareBrackets()
      .createProperty(['-webkit-perspective', 'perspective'])
      ?.updateMeta('utilities', 'perspective', pluginOrder.perspective, 0, true);
}

// https://windicss.org/utilities/behaviors.html#cursor
function cursor(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  const cursors = toType(theme('cursor'), 'object') as { [key: string]: string };
  if (body in cursors) return new Property('cursor', cursors[body]).updateMeta('utilities', 'cursor', pluginOrder.cursor, 1, true);
}

// https://windicss.org/utilities/behaviors.html#outline
function outline(utility: Utility, { theme }: PluginUtils): Output {
  const amount = utility.amount;
  const handler = utility.handler;
  const staticMap = toType(theme('outline'), 'object') as { [key: string]: [outline: string, outlineOffset: string] };
  if (amount in staticMap)
    return new Style(utility.class, [ new Property('outline', staticMap[amount][0]), new Property('outline-offset', staticMap[amount][1]) ]).updateMeta('utilities', 'outline', pluginOrder.outline, 1, true);

  return handler.catchPrefix(/^outline-opacity/, true)
    ?.handleStatic(theme('opacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-outline-opacity')
    ?.updateMeta('utilities', 'outline', pluginOrder.outline, 4, true)

  || handler.catchPrefix(/^outline-(solid|dotted)/, true)
    ?.then(() => {
      const newUtility = utility.clone(utility.raw.replace('outline-', ''));
      const outlineColor = newUtility.handler
        .handleStatic({ none: 'transparent', white: 'white', black: 'black' })
        .handleColor()
        .handleOpacity(theme('opacity'))
        .handleVariable()
        .createColorValue('var(--tw-outline-opacity, 1)');

      if (outlineColor) return new Style(utility.class, [
        new Property('outline', `2px ${newUtility.identifier} ${outlineColor}`),
        new Property('outline-offset', '2px') ]
      ).updateMeta('utilities', 'outline', pluginOrder.outline, 3, true);
    })

  || handler.catchPrefix(/^outline/)
    ?.handleColor()
    .handleOpacity(theme('opacity'))
    .handleSquareBrackets()
    .handleVariable((variable: string) => utility.raw.startsWith('outline-$') ? `var(--${variable})` : undefined)
    .then(() => {
      const color = handler.createColorValue();
      if (color) return new Style(utility.class, [
        new Property('outline', `2px ${ handler.value === 'transparent' ? 'solid' : 'dotted'} ${color}`),
        new Property('outline-offset', '2px'),
      ])?.updateMeta('utilities', 'outline', pluginOrder.outline, 2, true);
    });
}

// https://windicss.org/utilities/svg.html#fill-color
function fill(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler.catchPrefix(/^fill-opacity/, true)
    ?.handleStatic(theme('opacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-fill-opacity')
    ?.updateMeta('utilities', 'fill', pluginOrder.ringOffsetColor, 2, true)

  || utility.handler.catchPrefix(/^fill/)
    ?.handleColor(theme('fill'))
    .handleOpacity(theme('opacity'))
    .handleSquareBrackets()
    .handleVariable()
    .createColorStyle(utility.class, 'fill', '--tw-fill-opacity')
    ?.updateMeta('utilities', 'fill', pluginOrder.fill, 1, true);
}

// https://windicss.org/utilities/svg.html#stroke-color
// https://windicss.org/utilities/svg.html#stroke-width
function stroke(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler;
  return handler.catchPrefix(/^stroke-dash/, true)
    ?.handleNumber().createProperty('stroke-dasharray')?.updateMeta('utilities', 'strokeDashArray', pluginOrder.strokeDashArray, 0, true)

  || handler.catchPrefix(/^stroke-offset/, true)
    ?.handleNumber().createProperty('stroke-dashoffset')?.updateMeta('utilities', 'strokeDashOffset', pluginOrder.strokeDashOffset, 0, true)

  || handler.catchPrefix(/^stroke-opacity/, true)
    ?.handleStatic(theme('opacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('--tw-stroke-opacity')
    ?.updateMeta('utilities', 'stroke', pluginOrder.stroke, 2, true)

  || handler.catchPrefix(/^stroke/)
    ?.handleColor(theme('stroke'))
    .handleOpacity(theme('opacity'))
    .handleVariable()
    .handleSquareBrackets()
    .createColorStyle(utility.class, 'stroke', '--tw-stroke-opacity')
    ?.updateMeta('utilities', 'stroke', pluginOrder.stroke, 1, true)

  || handler.catchPrefix(/^stroke(-width)?/)
    ?.handleStatic(theme('strokeWidth'))
    .handleNumber(0, undefined, 'int')
    .handleVariable()
    .createProperty('stroke-width')
    ?.updateMeta('utilities', 'strokeWidth', pluginOrder.strokeWidth, 1, true);
}

function content(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .catchPrefix(/^content/)
    ?.handleBody(theme('content'))
    .handleSquareBrackets()
    .handleVariable()
    .handleString((string) => `"${string}"`)
    .createProperty('content')
    ?.updateMeta('utilities', 'content', pluginOrder.content, 1, true);
}

export const dynamicUtilities: DynamicUtility = {
  container: container,
  space: space,
  divide: divide,
  bg: background,
  from: gradientColorFrom,
  via: gradientColorVia,
  to: gradientColorTo,
  border: border,
  rounded: borderRadius,
  cursor: cursor,
  flex: flex,
  order: order,
  font: font,
  h: size,
  leading: lineHeight,
  list: listStyleType,
  m: margin,
  my: margin,
  mx: margin,
  mt: margin,
  mr: margin,
  mb: margin,
  ml: margin,
  min: minMaxSize,
  max: minMaxSize,
  object: objectPosition,
  opacity: opacity,
  outline: outline,
  p: padding,
  py: padding,
  px: padding,
  pt: padding,
  pr: padding,
  pb: padding,
  pl: padding,
  placeholder: placeholder,
  caret: caret,
  tab: tabSize,
  indent: textIndent,
  inset: inset,
  top: inset,
  right: inset,
  bottom: inset,
  left: inset,
  shadow: boxShadow,
  ring: ring,
  blur: blur,
  brightness: brightness,
  contrast: contrast,
  drop: dropShadow,
  grayscale: grayscale,
  hue: hueRotate,
  invert: invert,
  saturate: saturate,
  sepia: sepia,
  backdrop: backdrop,
  fill: fill,
  stroke: stroke,
  text: text,
  tracking: letterSpacing,
  underline: textDecoration,
  w: size,
  z: zIndex,
  gap: gap,
  auto: gridAuto,
  grid: gridTemplate,
  col: gridColumn,
  row: gridRow,
  origin: transformOrigin,
  scale: scale,
  rotate: rotate,
  translate: translate,
  skew: skew,
  perspect: perspective,
  transition: transition,
  ease: transitionTimingFunction,
  duration: duration,
  delay: delay,
  content: content,
  animate: animation,
};
