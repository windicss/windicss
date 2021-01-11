import { relative } from 'path';
import { exit } from 'process';
import { Property, Style, StyleSheet, InlineAtRule } from './style';

export interface Ast {
    type: 'AtRule' | 'Rule' | 'Property',
    start: number,
    end: number,
    data: any,
    raw: string,
    object?: Style,
    children?: {
        start: number,
        end: number,
        raw: string,
        data: Ast[]
    }
}

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

    private _parseProperties(css:string, offset=0) {
        const result:(Property|InlineAtRule)[] = [];
        let index = 0;
        while (true) {
            const start = this._searchFrom(css, /\S/, index);
            const end = this._searchFrom(css, ';', index);
            if (end === -1) break;
            const piece = css.substring(start, end+1);
            const isAtRule = css.charAt(start) === '@';
            const parsed = isAtRule? InlineAtRule.parse(piece) : Property.parse(piece);
            if (parsed) result.push(parsed);
            index = end + 1;
        }
        return result;
    }

    parse(css=this.css):StyleSheet {
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
                    styleSheet.add(InlineAtRule.parse(css.substring(firstLetter, ruleEnd).trim()).toStyle());
                    index = ruleEnd + 1;
                } else {
                    // nested atrule
                    const nestEnd = this._searchGroup(css, nestStart+1);
                    let result = new Style(undefined, this.parse(css.substring(nestStart + 1, nestEnd))).atRule(css.substring(firstLetter, nestStart).trim());
                    styleSheet.add(result);
                    index = nestEnd + 1;
                }
            } else {
                // nested selector
                const nestStart = this._searchFrom(css, '{', firstLetter);
                if (nestStart === -1) break;
                const nestEnd = this._searchGroup(css, nestStart+1);
                styleSheet.add(new Style(css.substring(firstLetter, nestStart).trim(), this._parseProperties(css.substring(nestStart+1, nestEnd))))
                index = nestEnd + 1;
            }    
        }
        return styleSheet;
    }
}