import type { Style } from './base';
import { hash } from '../tools';
import { sortSelector, compileStyleSheet } from '../algorithm';

export class StyleSheet {
    children: (Style)[];

    constructor(children?: (Style)[]) {
        this.children = children || [];
    }

    add(item?: Style | Style[]) {
        if (!item) return;
        if (Array.isArray(item)) {
            this.children = [...this.children, ...item];
        } else {
            this.children.push(item);
        }
    }

    extend(styleSheet:StyleSheet|undefined, append=true) {
        if (styleSheet) this.children = append?[...this.children, ...styleSheet.children]:[...styleSheet.children, ...this.children];
        return this;
    }

    combine() {
        const styleMap:{[key:string]:Style} = {};
        this.children.forEach(v=>{
            const hashValue = hash(v.atRules + v.rule);
            if (hashValue in styleMap) {
                styleMap[hashValue] = styleMap[hashValue].extend(v, true);
            } else {
                styleMap[hashValue] = v;
            }
        });
        this.children = Object.values(styleMap).map(i=>i.clean());//.sort());
        return this;
    }

    sort() {
        this.children = this.children.sort(sortSelector);
        return this;
    }

    build(minify=false):string {
        return compileStyleSheet(this.children, minify);
    }
}