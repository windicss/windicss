import { Style } from '../../utils/style';
/*
 * See MDN web docs for more information
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
 */

export function generateStates (
  variantOrder: string[]
): { [key: string]: () => Style } {
  const states: { [key: string]: () => Style } = {
    // Interactive links/buttons
    hover: () => new Style().pseudoClass('hover'),
    focus: () => new Style().pseudoClass('focus'),
    active: () => new Style().pseudoClass('active'),
    visited: () => new Style().pseudoClass('visited'),
    link: () => new Style().pseudoClass('link'),
    target: () => new Style().pseudoClass('target'),
    'focus-visible': () => new Style().pseudoClass('focus-visible'),
    'focus-within': () => new Style().pseudoClass('focus-within'),

    // Form element states
    checked: () => new Style().pseudoClass('checked'),
    'not-checked': () => new Style().pseudoClass('not(:checked)'),
    default: () => new Style().pseudoClass('default'),
    disabled: () => new Style().pseudoClass('disabled'),
    enabled: () => new Style().pseudoClass('enabled'),
    indeterminate: () => new Style().pseudoClass('indeterminate'),
    invalid: () => new Style().pseudoClass('invalid'),
    valid: () => new Style().pseudoClass('valid'),
    optional: () => new Style().pseudoClass('optional'),
    required: () => new Style().pseudoClass('required'),
    'placeholder-shown': () => new Style().pseudoClass('placeholder-shown'),
    'read-only': () => new Style().pseudoClass('read-only'),
    'read-write': () => new Style().pseudoClass('read-write'),

    // Child selectors
    'not-disabled': () => new Style().pseudoClass('not(:disabled)'),
    'first-of-type': () => new Style().pseudoClass('first-of-type'),
    'not-first-of-type': () => new Style().pseudoClass('not(:first-of-type)'),
    'last-of-type': () => new Style().pseudoClass('last-of-type'),
    'not-last-of-type': () => new Style().pseudoClass('not(:last-of-type)'),
    first: () => new Style().pseudoClass('first-child'),
    last: () => new Style().pseudoClass('last-child'),
    'not-first': () => new Style().pseudoClass('not(:first-child)'),
    'not-last': () => new Style().pseudoClass('not(:last-child)'),
    'only-child': () => new Style().pseudoClass('only-child'),
    'not-only-child': () => new Style().pseudoClass('not(:only-child)'),
    'only-of-type': () => new Style().pseudoClass('only-of-type'),
    'not-only-of-type': () => new Style().pseudoClass('not(:only-of-type)'),
    even: () => new Style().pseudoClass('nth-child(even)'),
    odd: () => new Style().pseudoClass('nth-child(odd)'),
    'even-of-type': () => new Style().pseudoClass('nth-of-type(even)'),
    'odd-of-type': () => new Style().pseudoClass('nth-of-type(odd)'),
    root: () => new Style().pseudoClass('root'),
    empty: () => new Style().pseudoClass('empty'),

    // Pseudo elements
    before: () => new Style().pseudoElement('before'),
    after: () => new Style().pseudoElement('after'),
    'first-letter': () => new Style().pseudoElement('first-letter'),
    'first-line': () => new Style().pseudoElement('first-line'),
    'file-selector-button': () => new Style().pseudoElement('file-selector-button'),
    selection: () => new Style().pseudoElement('selection'),

    svg: () => new Style().child('svg'),
    all: () => new Style().child('*'),
    children: () => new Style().child('> *'),
    siblings: () => new Style().child('~ *'),
    sibling: () => new Style().child('+ *'),
    // https://www.w3schools.com/CSS/css_pseudo_elements.asp

    // Directions
    ltr: () => new Style().wrapSelector(selector => `[dir='ltr'] ${selector}, [dir='ltr']${selector}`),
    rtl: () => new Style().wrapSelector(selector => `[dir='rtl'] ${selector}, [dir='rtl']${selector}`),

    // Group states
    // You'll need to add className="group" to an ancestor to make these work
    // https://github.com/ben-rogerson/twin.macro/blob/master/docs/group.md
    'group-hover': () => new Style().parent('.group:hover'),
    'group-focus': () => new Style().parent('.group:focus'),
    'group-active': () => new Style().parent('.group:active'),
    'group-visited': () => new Style().parent('.group:visited'),

    // Motion control
    // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
    'motion-safe': () => new Style().atRule('@media (prefers-reduced-motion: no-preference)'),
    'motion-reduce': () => new Style().atRule('@media (prefers-reduced-motion: reduce)'),
  };
  const orderedStates: typeof states = {};
  variantOrder.forEach((v) => {
    if (v in states) {
      orderedStates[v] = states[v];
    }
  });
  return orderedStates;
}
