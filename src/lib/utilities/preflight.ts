// (Last Update: Aug 22 2020) [https://github.com/sindresorhus/modern-normalize/blob/master/modern-normalize.css]
// (Last Update: Nov 4 2020) [https://github.com/tailwindlabs/tailwindcss/blob/master/src/plugins/css/preflight.css]

import type { ThemeUtil } from "../../interfaces";

const preflights: {
  keys: string[];
  properties: {
    [key: string]: string | string[] | ((theme: ThemeUtil) => string);
  };
  selector?: string;
  global?: boolean;
}[] = [

/*! modern-normalize v1.0.0 | MIT License | https://github.com/sindresorhus/modern-normalize */

/*
Document
========
*/

/**
Use a better box model (opinionated).
*/
// {
//   keys: ['*'],
//   global: true,
//   selector: '*, *::before, *::after',
//   properties: {
//     '-webkit-box-sizing': 'border-box',
//     'box-sizing': 'border-box'
//   }
// },
// overwrite by tailwind

/**
Use a more readable tab size (opinionated).
*/

{
  keys: ['root'],
  global: true,
  selector: ':root',
  properties: {
    '-moz-tab-size': '4',
    '-o-tab-size': '4',
    'tab-size': '4'
  }
},

/**
1. Correct the line height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
*/

{
  keys: ['html'],
  global: true,
  selector: 'html',
  properties: {
    // 'line-height': '1.15', /* 1 */ overwrite by tailwind
    '-webkit-text-size-adjust': '100%' /* 2 */
  }
},

/*
Sections
========
*/

/**
Remove the margin in all browsers.
*/

{
  keys: ['body'],
  global: true,
  selector: 'body',
  properties: {
    'margin': '0', /* 1 */
  }
},

/**
Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
*/

// {
//   keys: ['body'],
//   global: true,
//   selector: 'body',
//   properties: {
//     'font-family': "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
//   }
// },
// overide by tailwind

/*
Grouping content
================
*/

/**
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
*/

{
  keys: ['hr'],
  properties: {
    'height': '0', /* 1 */
    'color': 'inherit' /* 2 */
  }
},

/*
Text-level semantics
====================
*/

/**
Add the correct text decoration in Chrome, Edge, and Safari.
*/

{
  keys: ['title'],
  global: true,
  selector: 'abbr[title]',
  properties: {
    '-webkit-text-decoration': 'underline dotted',
    'text-decoration': 'underline dotted',
  }
},

/**
Add the correct font weight in Edge and Safari.
*/

{
  keys: ['b', 'strong'],
  properties: {
    'font-weight': 'bolder'
  }
},

/**
1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
2. Correct the odd 'em' font sizing in all browsers.
*/

{
  keys: ['code', 'kbd', 'samp', 'pre'],
  properties: {
    // 'font-family': "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace", /* 1 */ overwrite by tailwind
    'font-size': '1em' /* 2 */
  }
},

/**
Add the correct font size in all browsers.
*/

{
  keys: ['small'],
  properties: {
    'font-size': '80%'
  }
},

/**
Prevent 'sub' and 'sup' elements from affecting the line height in all browsers.
*/

{
  keys: ['sub', 'sup'],
  properties: {
    'font-size': '75%',
    'line-height': '0',
    'position': 'relative',
    'vertical-align': 'baseline'
  }
},

{
  keys: ['sub'],
  properties: {
    'bottom': '-0.25em'
  }
},

{
  keys: ['sup'],
  properties: {
    'top': '-0.5em'
  }
},

/*
Tabular data
============
*/

/**
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
*/

{
  keys: ['table'],
  properties: {
    'text-indent': '0', /* 1 */
    'border-color': 'inherit' /* 2 */
  }
},

/*
Forms
=====
*/

/**
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
*/

{
  keys: ['button', 'input', 'optgroup', 'select', 'textarea'],
  properties: {
    'font-family': 'inherit', /* 1 */
    'font-size': '100%', /* 1 */
    'line-height': '1.15', /* 1 */
    'margin': '0' /* 2 */
  }
},

/**
Remove the inheritance of text transform in Edge and Firefox.
1. Remove the inheritance of text transform in Firefox.
*/

{
  keys: ['button', 'select'],
  properties: {
    'text-transform': 'none' /* 1 */
  }
},

/**
Correct the inability to style clickable types in iOS and Safari.
*/

{
  keys: ['button'],
  selector: `button, [type='button'], [type='reset'], [type='submit']`,
  properties: {
    '-webkit-appearance': 'button' /* 1 */
  }
},

/**
Remove the inner border and padding in Firefox.
*/

{
  keys: ['inner'],
  global: true,
  selector: '::moz-focus-inner',
  properties: {
    'border-style': 'none',
    'padding': '0'
  }
},

/**
Restore the focus styles unset by the previous rule.
*/

{
  keys: ['focusring'],
  global: true,
  selector: ':-moz-focusring',
  properties: {
    'outline': '1px dotted ButtonText',
  }
},

/**
Remove the additional ':invalid' styles in Firefox.
See: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737
*/

{
  keys: ['invalid'],
  global: true,
  selector: ':-moz-ui-invalid',
  properties: {
    'box-shadow': 'none',
  }
},

/**
Remove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.
*/

{
  keys: ['legend'],
  properties: {
    'padding': '0',
  }
},

/**
Add the correct vertical alignment in Chrome and Firefox.
*/

{
  keys: ['progress'],
  properties: {
    'vertical-align': 'baseline',
  }
},

/**
Correct the cursor style of increment and decrement buttons in Safari.
*/

{
  keys: ['spin'],
  global: true,
  selector: '::-webkit-inner-spin-button, ::-webkit-outer-spin-button',
  properties: {
    'height': 'auto',
  }
},

/**
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

{
  keys: ['search'],
  global: true,
  selector: "[type='search']",
  properties: {
    '-webkit-appearance': 'textfield', /* 1 */
    'outline-offset': '-2px', /* 2 */

  }
},

/**
Remove the inner padding in Chrome and Safari on macOS.
*/

{
  keys: ['search'],
  global: true,
  selector: '::-webkit-search-decoration',
  properties: {
    '-webkit-appearance': 'none',
  }
},

/**
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to 'inherit' in Safari.
*/

{
  keys: ['file'],
  global: true,
  selector: '::-webkit-file-upload-button',
  properties: {
    '-webkit-appearance': 'button',
    'font': 'inherit',
  }
},

/*
Interactive
===========
*/

/*
Add the correct display in Chrome and Safari.
*/

{
  keys: ['summary'],
  properties: {
    'display': 'list-item',
  }
},

/**
 * Manually forked from SUIT CSS Base: https://github.com/suitcss/base
 * A thin layer on top of normalize.css that provides a starting point more
 * suitable for web applications.
 */

/**
 * Removes the default spacing and border for appropriate elements.
 */

{
  keys: ['blockquote', 'dl', 'dd', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'figure', 'p', 'pre'],
  properties: {
    'margin': '0'
  }
},

{
  keys: ['button'],
  properties: {
    'background-color': 'transparent',
    'background-image': 'none' }
},

/**
 * Work around a Firefox/IE bug where the transparent `button` background
 * results in a loss of the default `button` focus styles.
 */

{
  keys: ['button'],
  selector: 'button:focus',
  properties: {
    'outline': [
      '1px dotted',
      '5px auto -webkit-focus-ring-color'
    ]
  }
},

{
  keys: ['fieldset'],
  properties: {
    'margin': '0',
    'padding': '0'
  }
},

{
  keys: ['ol', 'ul'],
  properties: {
    'list-style': 'none',
    'margin': '0',
    'padding': '0'
  }
},

/**
 * Tailwind custom reset styles
 */

/**
 * 1. Use the user's configured `sans` font-family (with Tailwind's default
 *    sans-serif font stack as a fallback) as a sane default.
 * 2. Use Tailwind's default "normal" line-height so the user isn't forced
 *    to override it to ensure consistency even when using the default theme.
 */

{
  keys: ['html'],
  global: true,
  selector: 'html',
  properties: {
    'font-family': (theme) => theme('fontFamily.sans', `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`) as string, /* 1 */
    'line-height': '1.5' /* 2 */
  }
},

/**
 * Inherit font-family and line-height from `html` so users can set them as
 * a class directly on the `html` element.
 */

{
  keys: ['body'],
  global: true,
  selector: 'body',
  properties: {
    'font-family': 'inherit',
    'line-height': 'inherit'
  }
},

/**
 * 1. Prevent padding and border from affecting element width.
 *
 *    We used to set this in the html element and inherit from
 *    the parent element for everything else. This caused issues
 *    in shadow-dom-enhanced elements like <details> where the content
 *    is wrapped by a div with box-sizing set to `content-box`.
 *
 *    https://github.com/mozdevs/cssremedy/issues/4
 *
 *
 * 2. Allow adding a border to an element by just adding a border-width.
 *
 *    By default, the way the browser specifies that an element should have no
 *    border is by setting it's border-style to `none` in the user-agent
 *    stylesheet.
 *
 *    In order to easily add borders to elements by just setting the `border-width`
 *    property, we change the default border-style for all elements to `solid`, and
 *    use border-width to hide them instead. This way our `border` utilities only
 *    need to set the `border-width` property instead of the entire `border`
 *    shorthand, making our border utilities much more straightforward to compose.
 *
 *    https://github.com/tailwindcss/tailwindcss/pull/116
 */

{
  keys: ['*'],
  global: true,
  selector: '*, ::before, ::after',
  properties: {
    '-webkit-box-sizing': 'border-box',
    'box-sizing': 'border-box',
    'border-width': '0',
    'border-style': 'solid',
    'border-color': (theme) => theme('borderColor.DEFAULT', 'currentColor') as string
  }
},

/*
 * Ensure horizontal rules are visible by default
 */

{
  keys: ['hr'],
  properties: {
    'border-top-width': '1px'
  }
},

/**
 * Undo the `border-style: none` reset that Normalize applies to images so that
 * our `border-{width}` utilities have the expected effect.
 *
 * The Normalize reset is unnecessary for us since we default the border-width
 * to 0 on all elements.
 *
 * https://github.com/tailwindcss/tailwindcss/issues/362
 */

{
  keys: ['img'],
  properties: {
    'border-style': 'solid'
  }
},

{
  keys: ['textarea'],
  properties: {
    'resize': 'vertical'
  }
},

// input::placeholder,
// textarea::placeholder {
//   color: theme('colors.gray.400', #a1a1aa);
// }
// support prefixer

{
  keys: ['input'],
  selector: 'input::webkit-input-placeholder',
  properties: {
    'color': (theme) => theme('colors.gray.400', '#a1a1aa') as string
  }
},

{
  keys: ['input'],
  selector: 'input::-moz-placeholder',
  properties: {
    'color': (theme) => theme('colors.gray.400', '#a1a1aa') as string
  }
},

{
  keys: ['input'],
  selector: 'input:-ms-input-placeholder',
  properties: {
    'color': (theme) => theme('colors.gray.400', '#a1a1aa') as string
  }
},

{
  keys: ['input'],
  selector: 'input::-ms-input-placeholder',
  properties: {
    'color': (theme) => theme('colors.gray.400', '#a1a1aa') as string
  }
},

{
  keys: ['textarea'],
  selector: 'textarea::webkit-input-placeholder',
  properties: {
    'color': (theme) => theme('colors.gray.400', '#a1a1aa') as string
  }
},

{
  keys: ['textarea'],
  selector: 'textarea::-moz-placeholder',
  properties: {
    'color': (theme) => theme('colors.gray.400', '#a1a1aa') as string
  }
},

{
  keys: ['textarea'],
  selector: 'textarea:-ms-input-placeholder',
  properties: {
    'color': (theme) => theme('colors.gray.400', '#a1a1aa') as string
  }
},

{
  keys: ['textarea'],
  selector: 'textarea::-ms-input-placeholder',
  properties: {
    'color': (theme) => theme('colors.gray.400', '#a1a1aa') as string
  }
},

{
  keys: ['button'],
  selector: 'button, [role="button"]',
  properties: {
    'cursor': 'pointer'
  }
},

{
  keys: ['table'],
  properties: {
    'border-collapse': 'collapse'
  }
},

{
  keys: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  properties: {
    'font-size': 'inherit',
    'font-weight': 'inherit'
  }
},

/**
 * Reset links to optimize for opt-in styling instead of
 * opt-out.
 */

{
  keys: ['a'],
  properties: {
    'color': 'inherit',
    'text-decoration': 'inherit'
  }
},

/**
 * Reset form element properties that are easy to forget to
 * style explicitly so you don't inadvertently introduce
 * styles that deviate from your design system. These styles
 * supplement a partial reset that is already applied by
 * normalize.css.
 */

{
  keys: ['button', 'input', 'optgroup', 'select', 'textarea'],
  properties: {
    'padding': '0',
    'line-height': 'inherit',
    'color': 'inherit'
  }
},

/**
 * Use the configured 'mono' font family for elements that
 * are expected to be rendered with a monospace font, falling
 * back to the system monospace stack if there is no configured
 * 'mono' font family.
 */

{
  keys: ['pre', 'code', 'kbd', 'samp'],
  properties: {
    'font-family': (theme) => theme('fontFamily.mono', `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`) as string
  }
},

/**
 * Make replaced elements `display: block` by default as that's
 * the behavior you want almost all of the time. Inspired by
 * CSS Remedy, with `svg` added as well.
 *
 * https://github.com/mozdevs/cssremedy/issues/14
 */

{
  keys: ['img', 'svg', 'video', 'canvas', 'audio', 'iframe', 'embed', 'object'],
  properties: {
    'display': 'block',
    // 'vertical-align': 'middle'
    // Property is ignored due to the display. With 'display: block', vertical-align should not be used.css(propertyIgnoredDueToDisplay)
  }
},

/**
 * Constrain images and videos to the parent width and preserve
 * their instrinsic aspect ratio.
 *
 * https://github.com/mozdevs/cssremedy/issues/14
 */

{
  keys: ['img', 'video'],
  properties: {
    'max-width': '100%',
    'height': 'auto'
  }
},

];

export default preflights;
