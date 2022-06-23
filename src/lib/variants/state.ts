import { pseudoClassNames } from '../../config/order';
import { Style } from '../../utils/style';
/*
 * See MDN web docs for more information
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
 */

export function generateStates(
  variantOrder: string[]
): { [key: string]: () => Style } {
  const peseudoClassStates = pseudoClassNames.reduce((o: { [key: string]: () => Style }, pseudoClassName) => (o[pseudoClassName] = () => new Style().pseudoClass(pseudoClassName), o), {});
  const peerStates = pseudoClassNames.reduce((o: { [key: string]: () => Style }, pseudoClassName) => (o[`peer-${pseudoClassName}`] = () => new Style().parent(`.peer:${pseudoClassName} ~`), o), {});

  const notPeerStates = pseudoClassNames.reduce((o: { [key: string]: () => Style }, pseudoClassName) => (o[`peer-not-${pseudoClassName}`] = () => new Style().parent(`.peer:not(:${pseudoClassName}) ~`), o), {});

  const groupStates = pseudoClassNames.reduce((o: { [key: string]: () => Style }, pseudoClassName) => (o[`group-${pseudoClassName}`] = () => new Style().parent(`.group:${pseudoClassName}`), o), {});

  const states: { [key: string]: () => Style } = {
    ...peseudoClassStates,
    'not-checked': () => new Style().pseudoClass('not(:checked)'),
    'not-disabled': () => new Style().pseudoClass('not(:disabled)'),
    'not-first-of-type': () => new Style().pseudoClass('not(:first-of-type)'),
    'not-last-of-type': () => new Style().pseudoClass('not(:last-of-type)'),
    first: () => new Style().pseudoClass('first-child'),
    'not-first': () => new Style().pseudoClass('not(:first-child)'),
    last: () => new Style().pseudoClass('last-child'),
    'not-last': () => new Style().pseudoClass('not(:last-child)'),
    'not-only-child': () => new Style().pseudoClass('not(:only-child)'),
    'not-only-of-type': () => new Style().pseudoClass('not(:only-of-type)'),
    even: () => new Style().pseudoClass('nth-child(even)'),
    odd: () => new Style().pseudoClass('nth-child(odd)'),
    'even-of-type': () => new Style().pseudoClass('nth-of-type(even)'),
    'odd-of-type': () => new Style().pseudoClass('nth-of-type(odd)'),

    // Pseudo elements
    before: () => new Style().pseudoElement('before'),
    after: () => new Style().pseudoElement('after'),
    'first-letter': () => new Style().pseudoElement('first-letter'),
    'first-line': () => new Style().pseudoElement('first-line'),
    'file-selector-button': () => new Style().pseudoElement('file-selector-button'),
    file: () => new Style().pseudoElement('file-selector-button'),
    selection: () => new Style().wrapSelector(selector => `${selector} *::selection, ${selector}::selection`),
    marker: () => new Style().wrapSelector(selector => `${selector} *::marker, ${selector}::marker`),

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
    ...groupStates,

    // Motion control
    // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
    'motion-safe': () => new Style().atRule('@media (prefers-reduced-motion: no-preference)'),
    'motion-reduce': () => new Style().atRule('@media (prefers-reduced-motion: reduce)'),

    ...peerStates,
    ...notPeerStates,
  };
  const orderedStates: typeof states = {};
  variantOrder.forEach((v) => {
    if (v in states) {
      orderedStates[v] = states[v];
    }
  });
  return orderedStates;
}
