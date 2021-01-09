import { relative } from 'path';
import { exit } from 'process';
import { Property, StyleSheet } from './style';

export class AtRule {
    identifier:string;
    rule:string;
    constructor(identifier:string, rule:string) {
        this.identifier = identifier;
        this.rule = rule;
    }
    build() {
        return `@${this.identifier} ${this.rule}`;
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
        const subText = text.substring(startIndex, endIndex);
        const relativeIndex = subText.search(target);
        return relativeIndex === -1 ? -1 : startIndex + relativeIndex;
    }

    private _handleChildren(css:string) {

    }

    parse(css=this.css) {
        css = this._removeComment(css);

        let index = 0;

        while (true) {
            const firstLetter = this._searchFrom(css, /\S/, index);
            if (firstLetter === -1) break;
            if (css.charAt(firstLetter) === '@') {
                // atrule
                const ruleEnd = this._searchFrom(css, ';', firstLetter);
                const nestStart = this._searchFrom(css, '{', firstLetter);

                if (nestStart === -1 || ruleEnd < nestStart) {
                    // single line atrule
                    console.log({type:'atRule', start:firstLetter, end: ruleEnd, raw: css.substring(firstLetter, ruleEnd)});
                    index = ruleEnd + 1;
                } else {
                    // nested atrule
                    const atrule = css.substring(firstLetter, nestStart);
                    const nestEnd = this._searchGroup(css, nestStart+1);
                    console.log({type: 'atRule', start: nestStart, end: nestEnd, raw: atrule, children: this.parse(css.substring(nestStart+1, nestEnd))});
                    index = nestEnd + 1;
                }
            } else {
                // nested selector
                const nestStart = this._searchFrom(css, '{', firstLetter);
                if (nestStart === -1) break;
                const selector = css.substring(firstLetter, nestStart);
                const nestEnd = this._searchGroup(css, nestStart+1);
                console.log({type: 'selector', start: nestStart, end: nestEnd, raw: selector, children: css.substring(nestStart+1, nestEnd)});
                index = nestEnd + 1;
            }    
        }
    }
}