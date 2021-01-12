import { Property, Style, StyleSheet, InlineAtRule } from './style';
import { compile } from '../processor';
import screens from '../processor/variants/screen';

export class CSSParser {
    css:string;
    constructor(css:string) {
        this.css = css;
    }

    private _removeComment(css:string) {
        while (true) {
            const commentOpen = css.search(/\/\*/);
            const commentClose = css.search(/\*\//);
            if (commentOpen === -1 || commentClose === -1) break;
            css = css.substring(0, commentOpen) + css.substring(commentClose+2,);
        }
        return css;
    }

    private _searchGroup(text:string, startIndex=0) {
        let level = 1;
        while (true) {
            const endBracket = this._searchFrom(text, '}', startIndex);
            const nextBracket = this._searchFrom(text, '{', startIndex);
            if (endBracket === -1) return -1;
            if (endBracket < nextBracket || nextBracket === -1) {
                level --;
                startIndex = endBracket + 1;
                if (level == 0) return endBracket;
            } else {
                level ++;
                startIndex = nextBracket + 1;
            }
        }
    }

    private _searchFrom(text:string, target:string|RegExp, startIndex=0, endIndex=undefined) {
        // search from partial of string
        const subText = text.substring(startIndex, endIndex);
        const relativeIndex = subText.search(target);
        return relativeIndex === -1 ? -1 : startIndex + relativeIndex;
    }

    private _generateStyle(css:string, selector?:string, transform=false) {
        const properties:Property[] = [];
        const applies:string[] = [];
        let index = 0;
        while (true) {
            const start = this._searchFrom(css, /\S/, index);
            const end = this._searchFrom(css, ';', index);
            if (end === -1) break;
            const piece = css.substring(start, end+1);
            const isAtRule = css.charAt(start) === '@';
            const parsed = isAtRule? InlineAtRule.parse(piece) : Property.parse(piece);
            if (parsed) {
                if (transform && isAtRule && parsed.name==='apply' && parsed.value) {
                    applies.push(parsed.value);
                } else {
                    properties.push(parsed);
                }
            }
            index = end + 1;
        }
        if (applies.length > 0) {
            const styleSheet = compile(applies.join(' ')).styleSheet;
            styleSheet.children.forEach(style=>style.selector=selector);
            return (properties.length > 0) ? [new Style(selector, properties), ...styleSheet.children] : styleSheet.children;
        }
        return new Style(selector, properties);
    }

    private _clearDirectives(atrule:string):string|undefined {
        // transform @screen, keep @layer, remove other directives
        const iatrule = InlineAtRule.parse(atrule);
        if (["tailwind", "variants", "responsive"].includes(iatrule.name)) return undefined;
        if (iatrule.name === 'screen' && iatrule.value && screens.hasOwnProperty(iatrule.value)) return screens[iatrule.value]().atRules?.[0];
        return atrule;
    }

    parse(css=this.css, transform=false):StyleSheet {
        css = this._removeComment(css);
        let index = 0;
        const styleSheet = new StyleSheet();

        while (true) {
            const firstLetter = this._searchFrom(css, /\S/, index);
            if (firstLetter === -1) break;
            if (css.charAt(firstLetter) === '@') {
                // atrule
                const ruleEnd = this._searchFrom(css, ';', firstLetter);
                const nestStart = this._searchFrom(css, '{', firstLetter);

                if (nestStart === -1 || ruleEnd < nestStart) {
                    // inline atrule
                    const atrule = this._clearDirectives(css.substring(firstLetter, ruleEnd).trim());
                    if (atrule) styleSheet.add(InlineAtRule.parse(atrule).toStyle());
                    index = ruleEnd + 1;
                } else {
                    // nested atrule
                    const nestEnd = this._searchGroup(css, nestStart+1);
                    let atrule:string|undefined = css.substring(firstLetter, nestStart).trim();
                    if (transform) atrule = this._clearDirectives(atrule);
                    let result = this.parse(css.substring(nestStart + 1, nestEnd), transform).children.map(i=>i.atRule(atrule));
                    styleSheet.add(result);
                    index = nestEnd + 1;
                }
            } else {
                const nestStart = this._searchFrom(css, '{', firstLetter);
                const nestEnd = this._searchGroup(css, nestStart+1);
                if (nestStart === -1) {
                    // inline properties
                    styleSheet.add(this._generateStyle(css, undefined, transform));
                    break;
                }
                // nested selector
                styleSheet.add(this._generateStyle(css.substring(nestStart+1, nestEnd), css.substring(firstLetter, nestStart).trim(), transform));
                index = nestEnd + 1;
            }
        }
        return styleSheet;
    }
}