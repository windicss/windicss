import { Utility } from './handler';
import { pluginOrder } from '../../config/order';
import { dashToCamel, toType } from '../../utils/tools';
import { Property, Style, Keyframes, Container } from '../../utils/style';
import { linearGradient, minMaxContent } from '../../utils/style/prefixer';
import {
  generatePlaceholder,
  generateFontSize,
  expandDirection,
} from '../../utils/helpers';

import type { PluginUtils, FontSize, Output, DynamicUtility } from '../../interfaces';

function isNumberLead(i:string) {
  return /^\d/.test(i) ? i : undefined;
}

function notNumberLead(i:string) {
  return /^\d/.test(i) ? undefined : i;
}

// https://tailwindcss.com/docs/container
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

// https://tailwindcss.com/docs/object-position
function objectPosition(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('objectPosition'))
    .createProperty(['-o-object-position', 'object-position'])
    ?.updateMeta('utilities', 'objectPosition', pluginOrder.objectPosition, 0, true);
}

// https://tailwindcss.com/docs/top-right-bottom-left
function inset(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('inset'))
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
        if (utility.raw.match(/^-?inset-x/)) return new Property(['right', 'left'], value).updateMeta('utilities', 'inset', pluginOrder.inset, 3, true);
        if (utility.raw.match(/^-?inset-y/)) return new Property(['top', 'bottom'], value).updateMeta('utilities', 'inset', pluginOrder.inset, 2, true);
        return new Property(['top', 'right', 'bottom', 'left'], value).updateMeta('utilities', 'inset', pluginOrder.inset, 1, true);
      }
    });
}

// https://tailwindcss.com/docs/z-index
function zIndex(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('zIndex'))
    .handleNumber(0, 99999, 'int')
    .handleNegative()
    .handleVariable()
    .createProperty('z-index')
    ?.updateMeta('utilities', 'zIndex', pluginOrder.zIndex, 0, true);
}

// https://tailwindcss.com/docs/flex
// https://tailwindcss.com/docs/flex-grow
// https://tailwindcss.com/docs/flex-shrink
function flex(utility: Utility, { theme }: PluginUtils): Output {
  const className = utility.raw;
  if (className.startsWith('flex-grow')) {
    const map = toType(theme('flexGrow'), 'object') as { [key: string]: string };
    const amount = className.replace(/flex-grow-?/, '') || 'DEFAULT';
    if (Object.keys(map).includes(amount)) return new Property(['-webkit-box-flex', '-ms-flex-positive', '-webkit-flex-grow', 'flex-grow'], map[amount]).toStyle(utility.class).updateMeta('utilities', 'flexGrow', pluginOrder.flexGrow, 0, true);
  } else if (className.startsWith('flex-shrink')) {
    const map = toType(theme('flexShrink'), 'object') as { [key: string]: string };
    const amount = className.replace(/flex-shrink-?/, '') || 'DEFAULT';
    if (Object.keys(map).includes(amount)) return new Property(['-ms-flex-negative', '-webkit-flex-shrink', 'flex-shrink'], map[amount]).toStyle(utility.class).updateMeta('utilities', 'flexShrink', pluginOrder.flexShrink, 0, true);
  } else {
    return utility.handler.handleStatic(theme('flex')).createStyle(utility.class, value => {
      value = value.trim();
      return [
        new Property('-webkit-box-flex', value.startsWith('0') || value === 'none' ? '0' : '1'),
        new Property(['-ms-flex', '-webkit-flex', 'flex'], value),
      ];
    })?.updateMeta('utilities', 'flex', pluginOrder.flex, 0, true);
  }
}

// https://tailwindcss.com/docs/order
function order(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('order'))
    .handleNumber(1, 9999, 'int')
    .handleNegative()
    .handleVariable()
    .createStyle(utility.class, (value) => [
      new Property('-webkit-box-ordinal-group', value.includes('var') ? `calc(${value}+1)` : (parseInt(value) + 1).toString()),
      new Property(['-webkit-order', '-ms-flex-order', 'order'], value),
    ])
    ?.updateMeta('utilities', 'order', pluginOrder.order, utility.raw.charAt(0) === '-' ? 2 : 1, true);
}

// https://tailwindcss.com/docs/grid-template-columns
// https://tailwindcss.com/docs/grid-template-rows
function gridTemplate(utility: Utility, { theme }: PluginUtils): Output {
  const type = utility.raw.match(/^grid-rows-/) ? 'rows' : utility.raw.match(/^grid-cols-/) ? 'columns' : undefined;
  if (!type) return;
  const group = type === 'rows'? 'gridTemplateRows' : 'gridTemplateColumns';
  return utility.handler
    .handleStatic(theme(group))
    .handleSquareBrackets(i => i.replace(/\(.*?\)|,/g, (r) => r === ',' ? ' ' : r /* ignore content inside nested-brackets */ ))
    .createProperty(`grid-template-${type}`, (value) => value === 'none' ? 'none' : value)
    ?.updateMeta('utilities', group, pluginOrder[group], 1, true)
  || utility.handler
    .handleNumber(1, undefined, 'int')
    .handleVariable()
    .createProperty(`grid-template-${type}`, (value) => `repeat(${value}, minmax(0, 1fr))`)
    ?.updateMeta('utilities', group, pluginOrder[group], 2, true);
}

// https://tailwindcss.com/docs/grid-column
function gridColumn(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  // col span
  const spans = toType(theme('gridColumn'), 'object') as { [key: string]: string };
  if (Object.keys(spans).includes(body)) return new Property(['-ms-grid-column-span', 'grid-column'], spans[body]).updateMeta('utilities', 'gridColumn', pluginOrder.gridColumn, 1, true);
  if (utility.raw.startsWith('col-span')) {
    return utility.handler
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty(['-ms-grid-column-span', 'grid-column'], (value) => `span ${value} / span ${value}`)
      ?.updateMeta('utilities', 'gridColumn', pluginOrder.gridColumn, 1, true);
  }
  // col end
  if (utility.raw.startsWith('col-end')) {
    return utility.handler
      .handleStatic(theme('gridColumnEnd'))
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty('grid-column-end')
      ?.updateMeta('utilities', 'gridColumnEnd', pluginOrder.gridColumnEnd, 1, true);
  }
  // col start
  if (utility.raw.startsWith('col-start')) {
    return utility.handler
      .handleStatic(theme('gridColumnStart'))
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty('grid-column-start')
      ?.updateMeta('utilities', 'gridColumnStart', pluginOrder.gridColumnStart, 1, true);
  }
}

// https://tailwindcss.com/docs/grid-row
function gridRow(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  // row span
  const spans = toType(theme('gridRow'), 'object') as { [key: string]: string };
  if (Object.keys(spans).includes(body)) return new Property(['-ms-grid-row-span', 'grid-row'], spans[body]).updateMeta('utilities', 'gridRow', pluginOrder.gridRow, 1, true);
  if (utility.raw.startsWith('row-span')) {
    return utility.handler
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty(['-ms-grid-row-span', 'grid-row'], (value: string) => `span ${value} / span ${value}`)
      ?.updateMeta('utilities', 'gridRow', pluginOrder.gridRow, 2, true);
  }
  // row end
  if (utility.raw.startsWith('row-end')) {
    return utility.handler
      .handleStatic(theme('gridRowEnd'))
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty('grid-row-end')
      ?.updateMeta('utilities', 'gridRowEnd', pluginOrder.gridRowEnd, 1, true);
  }
  // row start
  if (utility.raw.startsWith('row-start')) {
    return utility.handler
      .handleStatic(theme('gridRowStart'))
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty('grid-row-start')
      ?.updateMeta('utilities', 'gridRowStart', pluginOrder.gridRowStart, 1, true);
  }
}

// https://tailwindcss.com/docs/grid-auto-columns
// https://tailwindcss.com/docs/grid-auto-rows
function gridAuto(utility: Utility, { theme }: PluginUtils): Output {
  const type = utility.raw.startsWith('auto-cols') ? 'columns' : utility.raw.startsWith('auto-rows') ? 'rows' : undefined;
  if (!type) return;
  const group = type === 'columns' ? 'gridAutoColumns' : 'gridAutoRows';
  const value = utility.handler.handleStatic(theme(group)).value;
  if (value) {
    const prefixer = minMaxContent(value);
    if (typeof prefixer === 'string') return new Property(`grid-auto-${type}`, prefixer).updateMeta('utilities', group, pluginOrder[group], 1, true);
    return new Style(utility.class, prefixer.map((i) => new Property(`grid-auto-${type}`, i))).updateMeta('utilities', group, pluginOrder[group], 2, true);
  }
}

// https://tailwindcss.com/docs/gap
function gap(utility: Utility, { theme, config }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('gap'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleSize()
    .handleVariable()
    .callback(value => {
      if (utility.raw.match(/^gap-x-/)) return new Property(config('prefixer') ? ['-webkit-column-gap', '-moz-column-gap', 'grid-column-gap', 'column-gap'] : 'column-gap', value).updateMeta('utilities', 'gap', pluginOrder.gap, 2, true);
      if (utility.raw.match(/^gap-y-/)) return new Property(config('prefixer') ? ['-webkit-row-gap', '-moz-row-gap', 'grid-row-gap', 'row-gap'] : 'row-gap', value).updateMeta('utilities', 'gap', pluginOrder.gap, 3, true);
      return new Property(config('prefixer') ? ['grid-gap', 'gap'] : 'gap', value).updateMeta('utilities', 'gap', pluginOrder.gap, 1, true);
    });
}

// https://tailwindcss.com/docs/padding
function padding(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('padding'))
    .handleSquareBrackets()
    .handleSpacing()
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

// https://tailwindcss.com/docs/margin
function margin(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('margin'))
    .handleSquareBrackets()
    .handleSpacing()
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

// https://tailwindcss.com/docs/space
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
  return utility.handler
    .handleStatic(theme('space'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .callback(value => {
      if (utility.raw.match(/^-?space-x-/)) {
        return new Style(utility.class, [
          new Property('--tw-space-x-reverse', '0'),
          new Property('margin-right', `calc(${value} * var(--tw-space-x-reverse))`),
          new Property('margin-left', `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`),
        ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, (utility.raw.charAt(0) === '-' ? 4 : 2), true);
      }
      if (utility.raw.match(/^-?space-y-/)) {
        return new Style(utility.class, [
          new Property('--tw-space-y-reverse', '0'),
          new Property('margin-top', `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`),
          new Property('margin-bottom', `calc(${value} * var(--tw-space-y-reverse))`),
        ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, (utility.raw.charAt(0) === '-' ? 3 : 1), true);
      }
    });
}

// https://tailwindcss.com/docs/width
// https://tailwindcss.com/docs/height
function size(utility: Utility, { theme }: PluginUtils): Output {
  const name = utility.identifier === 'w' ? 'width' : 'height';
  const body = utility.body;
  const sizes = toType(theme(name), 'object') as { [key: string]: string };
  // handle static
  if (Object.keys(sizes).includes(body)) {
    const value = sizes[body];
    if (value === 'min-content') {
      return new Style(utility.class, [
        new Property(name, '-webkit-min-content'),
        new Property(name, '-moz-min-content'),
        new Property(name, 'min-content'),
      ]).updateMeta('utilities', name, pluginOrder[name], 2, true);
    }
    if (value === 'max-content') {
      return new Style(utility.class, [
        new Property(name, '-webkit-max-content'),
        new Property(name, '-moz-max-content'),
        new Property(name, 'max-content'),
      ]).updateMeta('utilities', name, pluginOrder[name], 3, true);
    }
    return new Style(utility.class, new Property(name, value)).updateMeta('utilities', name, pluginOrder[name], 1, true);
  }
  return utility.handler
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNxl((number: number) => `${(number - 3) * 8 + 48}rem`)
    .handleVariable()
    .createProperty(name)
    ?.updateMeta('utilities', name, pluginOrder[name], 4, true);
}

// https://tailwindcss.com/docs/min-width
// https://tailwindcss.com/docs/min-height
// https://tailwindcss.com/docs/max-width
// https://tailwindcss.com/docs/max-height
function minMaxSize(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.raw.replace(/^(min|max)-[w|h]-/, '');
  const prop = utility.raw.substring(0, 5).replace('h', 'height').replace('w', 'width');
  const group = dashToCamel(prop) as ('minHeight'|'maxHeight'|'minWidth'|'maxWidth');
  const sizes = toType(theme(group), 'object') as { [key: string]: string };
  // handle static
  if (Object.keys(sizes).includes(body)) {
    const value = sizes[body];
    if (value === 'min-content') {
      return new Style(utility.class, [
        new Property(prop, '-webkit-min-content'),
        new Property(prop, '-moz-min-content'),
        new Property(prop, 'min-content'),
      ]).updateMeta('utilities', group, pluginOrder[group], 2, true);
    }
    if (value === 'max-content') {
      return new Style(utility.class, [
        new Property(prop, '-webkit-max-content'),
        new Property(prop, '-moz-max-content'),
        new Property(prop, 'max-content'),
      ]).updateMeta('utilities', group, pluginOrder[group], 3, true);
    }
    return new Style(utility.class, new Property(prop, value)).updateMeta('utilities', group, pluginOrder[group], 1, true);
  }

  return utility.handler
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNxl((number: number) => `${(number - 3) * 8 + 48}rem`)
    .handleVariable()
    .createProperty(prop)
    ?.updateMeta('utilities', group, pluginOrder[group], 4, true);
}

// https://tailwindcss.com/docs/font-size
// https://tailwindcss.com/docs/text-opacity
// https://tailwindcss.com/docs/text-color
function text(utility: Utility, { theme }: PluginUtils): Output {
  // handle font opacity
  if (utility.raw.startsWith('text-opacity')) {
    return utility.handler
      .handleStatic(theme('textOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-text-opacity')
      ?.updateMeta('utilities', 'textOpacity', pluginOrder.textOpacity, 1, true);
  }
  if (utility.raw.startsWith('text-shadow')) {
    return (utility.raw === 'text-shadow'
      ? new Property('text-shadow', theme('textShadow.DEFAULT', '0px 0px 1px rgb(0 0 0 / 20%), 0px 0px 1px rgb(1 0 5 / 10%)') as string)
      : utility.handler
        .handleStatic(theme('textShadow'))
        .createProperty('text-shadow')
    )?.updateMeta('utilities', 'textShadow', pluginOrder.textShadow, 1, true);
  }
  if (utility.raw.startsWith('text-stroke')) {
    if (utility.raw === 'text-stroke') return new Style('text-stroke', [
      new Property('-webkit-text-stroke-color', theme('textStrokeColor.DEFAULT', '#e4e4e7') as string),
      new Property('-webkit-text-stroke-width', theme('textStrokeWidth.DEFAULT', 'medium') as string),
    ]).updateMeta('utilities', 'textStrokeColor', pluginOrder.textStrokeColor, 1, true);
    return new Utility('textStroke' + utility.raw.slice(11)).handler
      .handleColor(theme('textStrokeColor'))
      .handleVariable()
      .createColorStyle(utility.class, '-webkit-text-stroke-color')
      ?.updateMeta('utilities', 'textStrokeColor', pluginOrder.textStrokeColor, 2, true)
  || utility.handler
    .handleStatic(theme('textStrokeWidth'))
    .handleNumber(0, undefined, 'int', (number) => `${number}px`)
    .handleSize()
    .createProperty('-webkit-text-stroke-width')
    ?.updateMeta('utilities', 'textStrokeWidth', pluginOrder.textStrokeWidth, 1, true);
  }
  // handle text colors
  const textColor = utility.handler
    .handleSquareBrackets(notNumberLead)
    .handleColor(theme('textColor'))
    .handleVariable()
    .createColorStyle(utility.class, 'color', '--tw-text-opacity')
    ?.updateMeta('utilities', 'textColor', pluginOrder.textColor, 0, true);
  if (textColor) return textColor;

  // handle font sizes
  const amount = utility.amount;
  const fontSizes = toType(theme('fontSize'), 'object') as { [key: string]: FontSize };
  if (Object.keys(fontSizes).includes(amount)) return new Style(utility.class, generateFontSize(fontSizes[amount])).updateMeta('utilities', 'fontSize', pluginOrder.fontSize, 1, true);
  let value = utility.handler
    .handleSquareBrackets(isNumberLead)
    .handleNxl((number: number) => `${number}rem`)
    .handleSize()
    .value;
  if (utility.raw.startsWith('text-size-$')) value = utility.handler.handleVariable().value;
  if (value) return new Style(utility.class, [ new Property('font-size', value), new Property('line-height', '1') ]).updateMeta('utilities', 'fontSize', pluginOrder.fontSize, 2, true);
}

// https://tailwindcss.com/docs/font-family
// https://tailwindcss.com/docs/font-weight
function font(utility: Utility, { theme }: PluginUtils): Output {
  const fonts = theme('fontFamily') as { [ key : string ] : string | string[] };
  const map:{ [ key : string ] : string } = {};
  for (const [key, value] of Object.entries(fonts)) {
    map[key] = Array.isArray(value)? value.join(',') : value;
  }
  return (
    utility.handler
      .handleStatic(map)
      .createProperty('font-family')
      ?.updateMeta('utilities', 'fontFamily', pluginOrder.fontFamily, 1, true)
    || utility.handler
      .handleStatic(theme('fontWeight'))
      .handleNumber(0, 900, 'int')
      .handleVariable()
      .createProperty('font-weight')
      ?.updateMeta('utilities', 'fontWeight', pluginOrder.fontWeight, 1, true)
  );
}

// https://tailwindcss.com/docs/letter-spacing
function letterSpacing(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('letterSpacing'))
    .handleSquareBrackets()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .createProperty('letter-spacing')
    ?.updateMeta('utilities', 'letterSpacing', pluginOrder.letterSpacing, 1, true);
}

// text decoration
function textDecoration(utility: Utility, { theme }: PluginUtils): Output {
  // handle text decoration opacity
  if (utility.raw.startsWith('underline-opacity')) {
    return utility.handler
      .handleStatic(theme('textDecorationOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-line-opacity')
      ?.updateMeta('utilities', 'textDecorationOpacity', pluginOrder.textDecorationOpacity, 1, true);
  }

  if (utility.raw.startsWith('underline-offset')) {
    return utility.handler
      .handleStatic(theme('textDecorationOffset'))
      .handleNumber(0, undefined, 'int', number => `${number}px`)
      .handleSize()
      .createProperty('text-underline-offset')
      ?.updateMeta('utilities', 'textDecorationOffset', pluginOrder.textDecorationOffset, 1, true);
  }
  // handle text decoration color or length
  return utility.handler
    .handleColor(theme('textDecorationColor'))
    .handleVariable()
    .createColorStyle(utility.class, ['-webkit-text-decoration-color', 'text-decoration-color'], '--tw-line-opacity')
    ?.updateMeta('utilities', 'textDecorationColor', pluginOrder.textDecorationColor, 0, true)
  || utility.handler
    .handleStatic(theme('textDecorationLength'))
    .handleNumber(0, undefined, 'int', (number: number) => `${number}px`)
    .handleSize()
    .createProperty('text-decoration-thickness')
    ?.updateMeta('utilities', 'textDecorationLength', pluginOrder.textDecorationLength, 1, true);
}

// https://tailwindcss.com/docs/line-height
function lineHeight(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('lineHeight'))
    .handleNumber(0, undefined, 'int', (number: number) => `${number * 0.25}rem`)
    .handleSquareBrackets()
    .handleSize()
    .handleVariable()
    .createProperty('line-height')
    ?.updateMeta('utilities', 'lineHeight', pluginOrder.lineHeight, 1, true);
}

// https://tailwindcss.com/docs/list-style-type
function listStyleType(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('listStyleType'))
    .createProperty('list-style-type')
    ?.updateMeta('utilities', 'listStyleType', pluginOrder.listStyleType, 1, true);
}

// https://tailwindcss.com/docs/placeholder-color
// https://tailwindcss.com/docs/placeholder-opacity
function placeholder(utility: Utility, { theme, config }: PluginUtils): Output {
  // handle placeholder opacity
  if (utility.raw.startsWith('placeholder-opacity')) {
    return utility.handler
      .handleStatic(theme('placeholderOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .callback(value => generatePlaceholder(utility.class, new Property('--tw-placeholder-opacity', value), config('prefixer') as boolean)
        .map(style => style.updateMeta('utilities', 'placeholderOpacity', pluginOrder.placeholderOpacity, 1, true)));
  }
  const color = utility.handler
    .handleColor(theme('placeholderColor'))
    .handleVariable()
    .createColorStyle(utility.class, 'color', '--tw-placeholder-opacity');
  if (color) return generatePlaceholder(color.selector || '', color.property, config('prefixer') as boolean).map(i => i.updateMeta('utilities', 'placeholderColor', pluginOrder.placeholderColor, 2, true));
}

function caret(utility: Utility, { theme }: PluginUtils): Output {
  // handle caret opacity
  if (utility.raw.startsWith('caret-opacity')) {
    return utility.handler
      .handleStatic(theme('caretOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-caret-opacity')
      ?.updateMeta('utilities', 'caretOpacity', pluginOrder.caretOpacity, 1, true);
  }
  return utility.handler
    .handleColor(theme('caretColor'))
    .handleVariable()
    .createColorStyle(utility.class, 'caret-color', '--tw-caret-opacity')
    ?.updateMeta('utilities', 'caretColor', pluginOrder.caretColor, 0, true);
}

function tabSize(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('tabSize'))
    .handleNumber(0, undefined, 'int')
    .handleSize()
    .createProperty(['-moz-tab-size', '-o-tab-size', 'tab-size'])
    ?.updateMeta('utilities', 'tabSize', pluginOrder.tabSize, 1, true);
}

function textIndent(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('textIndent'))
    .handleSize()
    .handleFraction()
    .handleNegative()
    .createProperty('text-indent')
    ?.updateMeta('utilities', 'textIndent', pluginOrder.textIndent, 1, true);
}

// https://tailwindcss.com/docs/background-color
// https://tailwindcss.com/docs/background-opacity
// https://tailwindcss.com/docs/background-position
// https://tailwindcss.com/docs/background-size
// https://tailwindcss.com/docs/background-image
function background(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  // handle background positions
  const positions = toType(theme('backgroundPosition'), 'object') as { [key: string]: string };
  if (Object.keys(positions).includes(body)) return new Property('background-position', positions[body]).updateMeta('utilities', 'backgroundPosition', pluginOrder.backgroundPosition, 1, true);
  // handle background sizes
  const sizes = toType(theme('backgroundSize'), 'object') as { [key: string]: string };
  if (Object.keys(sizes).includes(body)) return new Property('background-size', sizes[body]).updateMeta('utilities', 'backgroundSize', pluginOrder.backgroundSize, 1, true);
  // handle background image
  const images = toType(theme('backgroundImage'), 'object') as { [key: string]: string };
  if (Object.keys(images).includes(body)) {
    const prefixer = linearGradient(images[body]);
    if (Array.isArray(prefixer)) return new Style(utility.class, prefixer.map((i) => new Property('background-image', i))).updateMeta('utilities', 'backgroundImage', pluginOrder.backgroundImage, 2, true);
    return new Property('background-image', prefixer).updateMeta('utilities', 'backgroundImage', pluginOrder.backgroundImage, 1, true);
  }
  // handle background opacity
  if (utility.raw.startsWith('bg-opacity'))
    return utility.handler
      .handleStatic(theme('backgroundOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-bg-opacity')
      ?.updateMeta('utilities', 'backgroundOpacity', pluginOrder.backgroundOpacity, 1, true);

  // handle background color
  return utility.handler
    .handleSquareBrackets(notNumberLead)
    .handleColor(theme('backgroundColor'))
    .handleVariable()
    .createColorStyle(utility.class, 'background-color', '--tw-bg-opacity')
    ?.updateMeta('utilities', 'backgroundColor', pluginOrder.backgroundColor, 0, true);
}

// https://tailwindcss.com/docs/gradient-color-stops from
function gradientColorFrom(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler.handleColor(theme('gradientColorStops')).handleVariable();
  if (handler.color || handler.value) {
    return new Style(utility.class, [
      new Property('--tw-gradient-from', handler.createColorValue()),
      new Property('--tw-gradient-stops', `var(--tw-gradient-from), var(--tw-gradient-to, ${handler.createColorValue('0') || 'rgba(255, 255, 255, 0)'})`),
    ]).updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 1, true);
  }
}

// https://tailwindcss.com/docs/gradient-color-stops via
function gradientColorVia(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler.handleColor(theme('gradientColorStops')).handleVariable();
  if (handler.color || handler.value) {
    return new Style(utility.class,
      new Property('--tw-gradient-stops', `var(--tw-gradient-from), ${handler.createColorValue()}, var(--tw-gradient-to, ${handler.createColorValue('0') || 'rgba(255, 255, 255, 0)'})`)
    )?.updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 2, true);
  }
}

// https://tailwindcss.com/docs/gradient-color-stops to
function gradientColorTo(utility: Utility, { theme }: PluginUtils): Output {
  const handler = utility.handler.handleColor(theme('gradientColorStops')).handleVariable();
  if (handler.color || handler.value) {
    return new Style(utility.class,
      new Property('--tw-gradient-to', handler.createColorValue())
    )?.updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 3, true);
  }
}

// https://tailwindcss.com/docs/border-radius
function borderRadius(utility: Utility, { theme }: PluginUtils): Output {
  const raw = [ 'rounded', 'rounded-t', 'rounded-l', 'rounded-r', 'rounded-b', 'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl' ].includes(utility.raw) ? utility.raw + '-DEFAULT' : utility.raw;
  utility = new Utility(raw);
  const directions = expandDirection(utility.center.replace(/-?\$[\w-]+/, ''), true);
  if (!directions) return;
  return utility.handler
    .handleStatic(theme('borderRadius'))
    .handleSquareBrackets()
    .handleFraction()
    .handleNxl((number: number) => `${number * 0.5}rem`)
    .handleSize()
    .handleVariable()
    .createProperty(directions[0] === '*' ? 'border-radius' : directions.map((i) => `border-${i}-radius`))
    ?.updateMeta('utilities', 'borderRadius', pluginOrder.borderRadius, -(directions[0] === '*' ? 3 : directions.length), true);
}

// https://tailwindcss.com/docs/border-width
// https://tailwindcss.com/docs/border-color
// https://tailwindcss.com/docs/border-opacity
function border(utility: Utility, { theme }: PluginUtils): Output {
  // handle border opacity
  if (utility.raw.startsWith('border-opacity')) {
    return utility.handler
      .handleStatic(theme('borderOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-border-opacity')
      ?.updateMeta('utilities', 'borderOpacity', pluginOrder.borderOpacity, 1, true);
  }

  // handle border color
  const borderColor = utility.handler
    .handleSquareBrackets(notNumberLead)
    .handleColor(theme('borderColor'))
    .handleVariable((variable: string) => utility.raw.startsWith('border-$') ? `var(--${variable})` : undefined)
    .createColorStyle(utility.class, 'border-color', '--tw-border-opacity')
    ?.updateMeta('utilities', 'borderColor', pluginOrder.borderColor, 2, true);
  if (borderColor) return borderColor;

  // handle border width
  const directions = expandDirection(utility.raw.substring(7, 8), false) ?? [ '*' ];
  const borders = toType(theme('borderWidth'), 'object') as { [key: string]: string };
  const raw = [ 'border', 'border-t', 'border-r', 'border-b', 'border-l' ].includes(utility.raw) ? `${utility.raw}-${borders.DEFAULT ?? '1px'}` : utility.raw;
  utility = new Utility(raw);
  return utility.handler
    .handleStatic(borders)
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'int', (number: number) => /^border(-[tlbr])?$/.test(utility.key)? `${number}px`: undefined)
    .handleSize()
    .handleVariable()
    .createProperty(directions[0] === '*' ? 'border-width' : directions.map((i) => `border-${i}-width`))
    ?.updateMeta('utilities', 'borderWidth', pluginOrder.borderWidth, (directions[0] === '*' ? 1 : (directions.length + 1)), true);
}

// https://tailwindcss.com/docs/divide-width
// https://tailwindcss.com/docs/divide-color
// https://tailwindcss.com/docs/divide-opacity
// https://tailwindcss.com/docs/divide-style
function divide(utility: Utility, { theme }: PluginUtils): Output {
  // handle divide style
  if (['solid', 'dashed', 'dotted', 'double', 'none'].includes(utility.amount)) return new Property('border-style', utility.amount).toStyle(utility.class).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideStyle', pluginOrder.divideStyle, 1, true);
  // handle divide opacity
  if (utility.raw.startsWith('divide-opacity'))
    return utility.handler
      .handleStatic(theme('divideOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-divide-opacity')
      ?.toStyle(utility.class)
      .child('> :not([hidden]) ~ :not([hidden])')
      .updateMeta('utilities', 'divideOpacity', pluginOrder.divideOpacity, 1, true);
  // handle divide color
  const divideColor = utility.handler
    .handleColor(theme('divideColor'))
    .handleVariable((variable: string) => utility.raw.startsWith('divide-$') ? `var(--${variable})` : undefined)
    .createColorStyle(utility.class, 'border-color', '--tw-divide-opacity')
    ?.child('> :not([hidden]) ~ :not([hidden])')
    .updateMeta('utilities', 'divideColor', pluginOrder.divideColor, 0, true);
  if (divideColor) return divideColor;
  // handle divide width
  switch (utility.raw) {
  case 'divide-x-reverse':
    return new Style(utility.class, new Property('--tw-divide-x-reverse', '1')).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 6, true);
  case 'divide-y-reverse':
    return new Style(utility.class, new Property('--tw-divide-y-reverse', '1')).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 5, true);
  case 'divide-y':
    return new Style(utility.class, [
      new Property('--tw-divide-y-reverse', '0'),
      new Property('border-top-width', 'calc(1px * calc(1 - var(--tw-divide-y-reverse)))'),
      new Property('border-bottom-width', 'calc(1px * var(--tw-divide-y-reverse))'),
    ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 3, true);
  case 'divide-x':
    return new Style(utility.class, [
      new Property('--tw-divide-x-reverse', '0'),
      new Property('border-right-width', 'calc(1px * var(--tw-divide-x-reverse))'),
      new Property('border-left-width', 'calc(1px * calc(1 - var(--tw-divide-x-reverse)))'),
    ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 4, true);
  }
  return utility.handler
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'float', (number: number) => `${number}px`)
    .handleSize()
    .handleVariable()
    .callback(value => {
      const centerMatch = utility.raw.match(/^-?divide-[x|y]/);
      if (centerMatch) {
        const center = centerMatch[0].replace(/^-?divide-/, '');
        switch (center) {
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
      }
    });
}

// https://tailwindcss.com/docs/ring-offset-width
// https://tailwindcss.com/docs/ring-offset-color
function ringOffset(utility: Utility, { theme }: PluginUtils): Output {
  let value;
  // handle ring offset width variable
  if (utility.raw.startsWith('ringOffset-width-$')) {
    value = utility.handler.handleVariable().value;
    if (value) return new Property('--tw-ring-offset-width', value).toStyle(utility.class.replace('ringOffset', 'ring-offset')).updateMeta('utilities', 'ringOffsetWidth', pluginOrder.ringOffsetWidth, 2, true);
  }

  // handle ring offset color || ring offset width
  return utility.handler
    .handleColor(theme('ringOffsetColor'))
    .handleVariable()
    .createColorStyle(utility.class.replace('ringOffset', 'ring-offset'), '--tw-ring-offset-color')
    ?.updateMeta('utilities', 'ringOffsetColor', pluginOrder.ringOffsetColor, 1, true)
  || utility.handler
    .handleStatic(theme('ringOffsetWidth'))
    .handleSquareBrackets(isNumberLead)
    .handleNumber(0, undefined, 'float', (number: number) => `${number}px`)
    .handleSize()
    .createStyle(utility.class.replace('ringOffset', 'ring-offset'), value => new Property('--tw-ring-offset-width', value))
    ?.updateMeta('utilities', 'ringOffsetWidth', pluginOrder.ringOffsetWidth, 1, true);
}

// https://tailwindcss.com/docs/ring-width
// https://tailwindcss.com/docs/ring-color
// https://tailwindcss.com/docs/ring-opacity
function ring(utility: Utility, utils: PluginUtils): Output {
  // handle ring offset
  if (utility.raw.startsWith('ring-offset')) return ringOffset(new Utility(utility.raw.replace('ring-offset', 'ringOffset')), utils);
  // handle ring opacity
  if (utility.raw.startsWith('ring-opacity'))
    return utility.handler
      .handleStatic(utils.theme('ringOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-ring-opacity')
      ?.updateMeta('utilities', 'ringOpacity', pluginOrder.ringOpacity, 1, true);
  // handle ring color
  const ringColor = utility.handler
    .handleSquareBrackets(notNumberLead)
    .handleColor(utils.theme('ringColor'))
    .handleVariable((variable: string) => utility.raw.startsWith('ring-$') ? `var(--${variable})` : undefined)
    .createColorStyle(utility.class, '--tw-ring-color', '--tw-ring-opacity')
    ?.updateMeta('utilities', 'ringColor', pluginOrder.ringColor, 0, true);

  if (ringColor) return ringColor;
  // handle ring width
  if (utility.raw === 'ring-inset') return new Property('--tw-ring-inset', 'inset').updateMeta('utilities', 'ringWidth', pluginOrder.ringWidth, 3, true);
  const value = utility.raw === 'ring'
    ? (toType(utils.theme('ringWidth.DEFAULT'), 'string') ?? '3px')
    : utility.handler
      .handleStatic(utils.theme('ringWidth'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'float', (number: number) => `${number}px`)
      .handleSize()
      .handleVariable()
      .value;
  if (!value) return;
  return new Style(utility.class, [
    new Property('--tw-ring-offset-shadow', 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)'),
    new Property('--tw-ring-shadow', `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`),
    new Property(['-webkit-box-shadow', 'box-shadow'], 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)'),
  ]).updateMeta('utilities', 'ringWidth', pluginOrder.ringWidth, (utility.raw === 'ring' ? 1 : 2), true);
}

function blur(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === 'blur') utility.raw = 'blur-DEFAULT';
  return utility.handler
    .handleBody(theme('blur'))
    .handleNumber(0, undefined, 'int', (number) => `${number}px`)
    .handleSize()
    .createProperty('--tw-blur', value => `blur(${value})`)
    ?.updateMeta('utilities', 'blur', pluginOrder.blur, 1, true);
}

function brightness(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('brightness'))
    .handleNumber(0, undefined, 'int', (number) => `${number/100}`)
    .createProperty('--tw-brightness', value => `brightness(${value})`)
    ?.updateMeta('utilities', 'brightness', pluginOrder.brightness, 1, true);
}

function contrast(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('contrast'))
    .handleNumber(0, undefined, 'int', (number) => `${number/100}`)
    .createProperty('--tw-contrast', value => `contrast(${value})`)
    ?.updateMeta('utilities', 'contrast', pluginOrder.contrast, 1, true);
}

function dropShadow(utility: Utility, { theme }: PluginUtils): Output {
  let value;
  if (utility.raw === 'drop-shadow') {
    value = theme('dropShadow.DEFAULT', ['0 1px 2px rgba(0, 0, 0, 0.1)', '0 1px 1px rgba(0, 0, 0, 0.06)']) as string | string[];
  } else {
    const dropShadows = theme('dropShadow') as {[key:string]:string|string[]};
    const amount = utility.amount;
    if (utility.raw.startsWith('drop-shadow') && amount in dropShadows) value = dropShadows[amount];
  }
  if (value) return new Property('--tw-drop-shadow', Array.isArray(value)? value.map(i => `drop-shadow(${i})`).join(' '): `drop-shadow(${value})`).updateMeta('utilities', 'dropShadow', pluginOrder.dropShadow, 1, true);
}

function grayscale(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === 'grayscale') utility.raw = 'grayscale-DEFAULT';
  return utility.handler
    .handleBody(theme('grayscale'))
    .handleNumber(0, 100, 'int', (number) => `${number/100}`)
    .createProperty('--tw-grayscale', value => `grayscale(${value})`)
    ?.updateMeta('utilities', 'grayscale', pluginOrder.grayscale, 1, true);
}

function hueRotate(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('hueRotate'))
    .handleNumber(0, undefined, 'float', (number) => `${number}deg`)
    .handleNegative()
    .createProperty('--tw-hue-rotate', value => `hue-rotate(${value})`)
    ?.updateMeta('utilities', 'hueRotate', pluginOrder.hueRotate, 1, true);
}

function invert(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === 'invert') utility.raw = 'invert-DEFAULT';
  return utility.handler
    .handleBody(theme('invert'))
    .handleNumber(0, 100, 'int', (number) => `${number/100}`)
    .createProperty('--tw-invert', value => `invert(${value})`)
    ?.updateMeta('utilities', 'invert', pluginOrder.invert, 1, true);
}

function saturate(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('saturate'))
    .handleNumber(0, undefined, 'int', (number) => `${number/100}`)
    .createProperty('--tw-saturate', value => `saturate(${value})`)
    ?.updateMeta('utilities', 'saturate', pluginOrder.saturate, 1, true);
}

function sepia(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === 'sepia') utility.raw = 'sepia-DEFAULT';
  return utility.handler
    .handleBody(theme('sepia'))
    .handleNumber(0, 100, 'int', (number) => `${number/100}`)
    .createProperty('--tw-sepia', value => `sepia(${value})`)
    ?.updateMeta('utilities', 'sepia', pluginOrder.sepia, 1, true);
}

function backdrop(utility: Utility, { theme }: PluginUtils): Output {
  utility = new Utility(utility.raw.slice(9));
  switch (utility.match(/[^-]+/)) {
  case 'blur':
    if (utility.raw === 'blur') utility.raw = 'blur-DEFAULT';
    return utility.handler
      .handleBody(theme('backdropBlur'))
      .handleNumber(0, undefined, 'int', (number) => `${number}px`)
      .handleSize()
      .createProperty('--tw-backdrop-blur', value => `blur(${value})`)
      ?.updateMeta('utilities', 'backdropBlur', pluginOrder.backdropBlur, 1, true);
  case 'brightness':
    return utility.handler
      .handleBody(theme('backdropBrightness'))
      .handleNumber(0, undefined, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-brightness', value => `brightness(${value})`)
      ?.updateMeta('utilities', 'backdropBrightness', pluginOrder.backdropBrightness, 1, true);
  case 'contrast':
    return utility.handler
      .handleBody(theme('backdropContrast'))
      .handleNumber(0, undefined, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-contrast', value => `contrast(${value})`)
      ?.updateMeta('utilities', 'backdropContrast', pluginOrder.backdropContrast, 1, true);
  case 'grayscale':
    if (utility.raw === 'grayscale') utility.raw = 'grayscale-DEFAULT';
    return utility.handler
      .handleBody(theme('backdropGrayscale'))
      .handleNumber(0, 100, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-grayscale', value => `grayscale(${value})`)
      ?.updateMeta('utilities', 'backdropGrayscale', pluginOrder.backdropGrayscale, 1, true);
  case 'hue':
    return utility.handler
      .handleBody(theme('backdropHueRotate'))
      .handleNumber(0, undefined, 'float', (number) => `${number}deg`)
      .handleNegative()
      .createProperty('--tw-backdrop-hue-rotate', value => `hue-rotate(${value})`)
      ?.updateMeta('utilities', 'backdropHueRotate', pluginOrder.backdropHueRotate, 1, true);
  case 'invert':
    if (utility.raw === 'invert') utility.raw = 'invert-DEFAULT';
    return utility.handler
      .handleBody(theme('backdropInvert'))
      .handleNumber(0, 100, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-invert', value => `invert(${value})`)
      ?.updateMeta('utilities', 'backdropInvert', pluginOrder.backdropInvert, 1, true);
  case 'opacity':
    return utility.handler
      .handleBody(theme('backdropOpacity'))
      .handleNumber(0, 100, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-opacity', value => `opacity(${value})`)
      ?.updateMeta('utilities', 'backdropOpacity', pluginOrder.backdropOpacity, 1, true);
  case 'saturate':
    return utility.handler
      .handleBody(theme('backdropSaturate'))
      .handleNumber(0, undefined, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-saturate', value => `saturate(${value})`)
      ?.updateMeta('utilities', 'backdropSaturate', pluginOrder.backdropSaturate, 1, true);
  case 'sepia':
    if (utility.raw === 'sepia') utility.raw = 'sepia-DEFAULT';
    return utility.handler
      .handleBody(theme('backdropSepia'))
      .handleNumber(0, 100, 'int', (number) => `${number/100}`)
      .createProperty('--tw-backdrop-sepia', value => `sepia(${value})`)
      ?.updateMeta('utilities', 'backdropSepia', pluginOrder.backdropSepia, 1, true);
  }
}

// https://tailwindcss.com/docs/box-shadow/
function boxShadow(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body || 'DEFAULT';
  const shadows = toType(theme('boxShadow'), 'object') as { [key: string]: string };
  if (Object.keys(shadows).includes(body)) {
    const shadow = shadows[body].replace(/rgba\s*\(\s*0\s*,\s*0\s*,\s*0/g, 'rgba(var(--tw-shadow-color)');
    return new Style(utility.class, [
      new Property('--tw-shadow-color', '0, 0, 0'),
      new Property('--tw-shadow', shadow),
      new Property(['-webkit-box-shadow', 'box-shadow'], 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)'),
    ]).updateMeta('utilities', 'boxShadow', pluginOrder.boxShadow, 0, true);
  }
  // handle shadowColor
  return utility.handler
    .handleSquareBrackets()
    .handleColor(theme('boxShadowColor'))
    .handleVariable()
    .createColorStyle(utility.class, '--tw-shadow-color', undefined, false)
    ?.updateMeta('utilities', 'boxShadowColor', pluginOrder.boxShadowColor, 0, true);
}

// https://tailwindcss.com/docs/opacity
function opacity(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('opacity'))
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('opacity')
    ?.updateMeta('utilities', 'opacity', pluginOrder.opacity, 0, true);
}

// https://tailwindcss.com/docs/transition-property
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

// https://tailwindcss.com/docs/transition-duration
function duration(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('transitionDuration'))
    .handleNumber(0, undefined, 'int', (number: number) => `${number}ms`)
    .handleVariable()
    .createProperty(['-webkit-transition-duration', '-o-transition-duration', 'transition-duration'])
    ?.updateMeta('utilities', 'transitionDuration', pluginOrder.transitionDuration, 1, true);
}

// https://tailwindcss.com/docs/transition-timing-function
function transitionTimingFunction(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('transitionTimingFunction'))
    .createProperty(['-webkit-transition-timing-function', '-o-transition-timing-function', 'transition-timing-function'])
    ?.updateMeta('utilities', 'transitionTimingFunction', pluginOrder.transitionTimingFunction, 1, true);
}

// https://tailwindcss.com/docs/transition-delay
function delay(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('transitionDelay'))
    .handleNumber(0, undefined, 'int', (number: number) => `${number}ms`)
    .handleVariable()
    .createProperty(['-webkit-transition-delay', '-o-transition-delay', 'transition-delay'])
    ?.updateMeta('utilities', 'transitionDelay', pluginOrder.transitionDelay, 0, true);
}

// https://tailwindcss.com/docs/animation
function animation(utility: Utility, { theme, config }: PluginUtils): Output {
  const animations = toType(theme('animation'), 'object') as { [key: string]: string };
  if (Object.keys(animations).includes(utility.body)) {
    const value = animations[utility.body];
    const keyframe = value.match(/^\w+/)?.[0];
    const prop = config('prefixer') ? ['-webkit-animation', 'animation'] : 'animation';
    if (value === 'none') return new Property(prop, 'none').updateMeta('utilities', 'animation', pluginOrder.animation, 1, true);
    return [
      new Style(utility.class, new Property(prop, value)).updateMeta('utilities', 'animation', pluginOrder.animation, 2, true),
      ... keyframe ? Keyframes.generate(
        keyframe,
        (theme(`keyframes.${keyframe}`) ?? {}) as { [key: string]: { [key: string]: string } },
        undefined,
        config('prefixer', false) as boolean
      ).map(i => i.updateMeta('utilities', 'keyframes', pluginOrder.keyframes, 1, true)) : [],
    ];
  }
}

// https://tailwindcss.com/docs/transform-origin
function transformOrigin(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  const origins = toType(theme('transformOrigin'), 'object') as { [key: string]: string };
  if (Object.keys(origins).includes(body)) return new Property(['-webkit-transform-origin', '-ms-transform-origin', 'transform-origin'], origins[body]).updateMeta('utilities', 'transformOrigin', pluginOrder.transformOrigin, 0, true);
}

// https://tailwindcss.com/docs/scale
function scale(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('scale'))
    .handleNumber(0, undefined, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .callback(value => {
      if (utility.raw.startsWith('scale-x')) return new Property('--tw-scale-x', value).updateMeta('utilities', 'scale', pluginOrder.scale, 2, true);
      if (utility.raw.startsWith('scale-y')) return new Property('--tw-scale-y', value).updateMeta('utilities', 'scale', pluginOrder.scale, 3, true);
      if (utility.raw.startsWith('scale-z')) return new Property('--tw-scale-z', value).updateMeta('utilities', 'scale', pluginOrder.scale, 4, true);
      return new Property(['--tw-scale-x', '--tw-scale-y', '--tw-scale-z'], value).updateMeta('utilities', 'scale', pluginOrder.scale, 1, true);
    });
}

// https://tailwindcss.com/docs/rotate
function rotate(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('rotate'))
    .handleNumber(0, undefined, 'float', (number: number) => `${number}deg`)
    .handleNegative()
    .handleVariable()
    .callback(value => {
      const abs = utility.absolute;
      if (abs.startsWith('rotate-x')) return new Property('--tw-rotate-x', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 2, true);
      if (abs.startsWith('rotate-y')) return new Property('--tw-rotate-y', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 3, true);
      if (abs.startsWith('rotate-z')) return new Property('--tw-rotate-z', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 4, true);
      return new Property('--tw-rotate', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 1, true);
    });
}

// https://tailwindcss.com/docs/translate
function translate(utility: Utility, { theme }: PluginUtils): Output {
  const centerMatch = utility.raw.match(/^-?translate-[x|y|z]/);
  if (centerMatch) {
    const center = centerMatch[0].replace(/^-?translate-/, '');
    return utility.handler
      .handleStatic(theme('translate'))
      .handleSquareBrackets()
      .handleSpacing()
      .handleFraction()
      .handleSize()
      .handleNegative()
      .handleVariable()
      .createProperty(`--tw-translate-${center}`)
      ?.updateMeta('utilities', 'translate', pluginOrder.translate, utility.raw.charAt(0) === '-' ? 2 : 1, true);
  }
}

// https://tailwindcss.com/docs/skew
function skew(utility: Utility, { theme }: PluginUtils): Output {
  const centerMatch = utility.raw.match(/^-?skew-[x|y]/);
  if (centerMatch) {
    const center = centerMatch[0].replace(/^-?skew-/, '');
    return utility.handler
      .handleStatic(theme('skew'))
      .handleNumber(0, undefined, 'float', (number: number) => `${number}deg`)
      .handleNegative()
      .handleVariable()
      .createProperty(`--tw-skew-${center}`)
      ?.updateMeta('utilities', 'skew', pluginOrder.skew, utility.raw.charAt(0) === '-' ? 2 : 1, true);
  }
}

// pespective
function perspective(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw.startsWith('perspect-origin')) {
    const origin = new Utility('perspectOrigin' + utility.raw.slice(15)).handler
      .handleBody(theme('perspectiveOrigin'))
      .handleSquareBrackets()
      .createProperty(['-webkit-perspective-origin', 'perspective-origin'])
      ?.updateMeta('utilities', 'perspectiveOrigin', pluginOrder.perspectiveOrigin, 0, true);
    if (origin) return origin;
  }
  return utility.handler
    .handleStatic(theme('perspective'))
    .handleNumber(0, undefined, 'int', number => `${number}px`)
    .handleSize()
    .handleSquareBrackets()
    .createProperty(['-webkit-perspective', 'perspective'])
    ?.updateMeta('utilities', 'perspective', pluginOrder.perspective, 0, true);
}

// https://tailwindcss.com/docs/cursor
function cursor(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  const cursors = toType(theme('cursor'), 'object') as { [key: string]: string };
  if (Object.keys(cursors).includes(body)) return new Property('cursor', cursors[body]).updateMeta('utilities', 'cursor', pluginOrder.cursor, 1, true);
}

// https://tailwindcss.com/docs/outline
function outline(utility: Utility, { theme }: PluginUtils): Output {
  const amount = utility.amount;
  const staticMap = toType(theme('outline'), 'object') as { [key: string]: [outline: string, outlineOffset: string] };
  if (Object.keys(staticMap).includes(amount))
    return new Style(utility.class, [ new Property('outline', staticMap[amount][0]), new Property('outline-offset', staticMap[amount][1]) ]).updateMeta('utilities', 'outline', pluginOrder.outline, 1, true);

  if (utility.raw.match(/^outline-(solid|dotted)/)) {
    const newUtility = new Utility(utility.raw.replace('outline-', ''));
    const outlineColor = newUtility.handler
      .handleStatic({ none: 'transparent', white: 'white', black: 'black' })
      .handleColor()
      .handleVariable()
      .createColorValue();

    if (outlineColor) return new Style(utility.class, [
      new Property('outline', `2px ${newUtility.identifier} ${outlineColor}`),
      new Property('outline-offset', '2px') ]
    ).updateMeta('utilities', 'outline', pluginOrder.outline, 3, true);
  }

  const handler = utility.handler.handleColor().handleVariable((variable: string) => utility.raw.startsWith('outline-$') ? `var(--${variable})` : undefined);
  const color = handler.createColorValue();
  if (color) return new Style(utility.class, [
    new Property('outline', `2px ${ handler.value === 'transparent' ? 'solid' : 'dotted'} ${color}`),
    new Property('outline-offset', '2px'),
  ])?.updateMeta('utilities', 'outline', pluginOrder.outline, 2, true);
}

// https://tailwindcss.com/docs/fill
function fill(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleColor(theme('fill'))
    .handleVariable()
    .createColorStyle(utility.class, 'fill')
    ?.updateMeta('utilities', 'fill', pluginOrder.fill, 1, true);
}

// https://tailwindcss.com/docs/stroke
// https://tailwindcss.com/docs/stroke-width
function stroke(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw.startsWith('stroke-dash')) {
    return utility.handler.handleNumber().createProperty('stroke-dasharray')?.updateMeta('utilities', 'strokeDashArray', pluginOrder.strokeDashArray, 0, true);
  }
  if (utility.raw.startsWith('stroke-offset')) {
    return utility.handler.handleNumber().createProperty('stroke-dashoffset')?.updateMeta('utilities', 'strokeDashOffset', pluginOrder.strokeDashOffset, 0, true);
  }
  return utility.handler
    .handleColor(theme('stroke'))
    .handleVariable()
    .createColorStyle(utility.class, 'stroke')
    ?.updateMeta('utilities', 'stroke', pluginOrder.stroke, 1, true)
  || (utility.raw.startsWith('stroke-$')
    ? utility.handler
      .handleVariable()
      .createProperty('stroke-width')
      ?.updateMeta('utilities', 'strokeWidth', pluginOrder.strokeWidth, 2, true)
    : utility.handler
      .handleStatic(theme('strokeWidth'))
      .handleNumber(0, undefined, 'int')
      .createProperty('stroke-width')
      ?.updateMeta('utilities', 'strokeWidth', pluginOrder.strokeWidth, 1, true)
  );
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
  animate: animation,
};
