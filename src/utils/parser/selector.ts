import { parse, stringify, isTraversal } from "css-what";

export default class SelectorParser {
  parse(selector: string, options?: Options): Selector[][] {
    return parse(selector, options);
  }

  stringify(selector: Selector[][]): string {
    return stringify(selector);
  }

  isTraversal(selector: Selector): selector is Traversal {
    return isTraversal(selector);
  }
}

export interface Options {
  lowerCaseAttributeNames?: boolean;
  lowerCaseTags?: boolean;
  xmlMode?: boolean;
}
export type Selector = PseudoSelector | PseudoElement | AttributeSelector | TagSelector | UniversalSelector | Traversal;
export interface AttributeSelector {
  type: "attribute";
  name: string;
  action: AttributeAction;
  value: string;
  ignoreCase: boolean;
  namespace: string | null;
}
export type DataType = Selector[][] | null | string;
export interface PseudoSelector {
  type: "pseudo";
  name: string;
  data: DataType;
}
export interface PseudoElement {
  type: "pseudo-element";
  name: string;
}
export interface TagSelector {
  type: "tag";
  name: string;
  namespace: string | null;
}
export interface UniversalSelector {
  type: "universal";
  namespace: string | null;
}
export interface Traversal {
  type: TraversalType;
}
export type AttributeAction = "any" | "element" | "end" | "equals" | "exists" | "hyphen" | "not" | "start";
export type TraversalType = "adjacent" | "child" | "descendant" | "parent" | "sibling";
