import { Property, Style, StyleSheet, InlineAtRule } from '../style';
import { searchFrom } from '../tools';
import type { Processor } from '../../lib';

export default class CSSParser {
    css:string;
    processor?:Processor;
    escape:boolean;
    constructor(css:string, processor?:Processor, escape=false) {
        this.css = css;
        this.escape = escape;
        this.processor = processor;
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
            const endBracket = searchFrom(text, '}', startIndex);
            const nextBracket = searchFrom(text, '{', startIndex);
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

    private _generateStyle(css:string, selector?:string) {
        // if (!/;\s*$/.test(css)) css += ';' ; // Fix for the situation where the last semicolon is omitted
        const parsed = Property.parse(css);
        const properties = Array.isArray(parsed)? parsed : parsed === undefined ? [] : [parsed];
        const applies = properties.filter(i=>i instanceof InlineAtRule && i.name === 'apply' && i.value).map(i=>i.value);
        if (this.processor && applies.length > 0) {
            const styleSheet = this.processor.compile(applies.join(' ')).styleSheet;
            styleSheet.children.forEach(style=>style.selector=selector);
            return (properties.length > 0) ? [new Style(selector, properties, this.escape), ...styleSheet.children] : styleSheet.children;
        }
        return new Style(selector, properties, this.escape);
    }

    private _handleDirectives(atrule:string):{atrule?:string, variants?:string[][]} | undefined {
        if (!this.processor) return { atrule };
        const iatrule = InlineAtRule.parse(atrule);
        if (!iatrule) return;
        if (["tailwind", "responsive"].includes(iatrule.name)) return;
        if (iatrule.name === "variants" && iatrule.value) return { variants: iatrule.value.split(',').map(i=>i.trim().split(':')) }
        if (iatrule.name === 'screen' && iatrule.value) {
            const screens = this.processor.resolveVariants('screen');
            if (screens.hasOwnProperty(iatrule.value)) return { atrule: screens[iatrule.value]().atRules?.[0] };
            if (['dark', 'light'].includes(iatrule.value)) return { atrule: `@media (prefers-color-scheme: ${iatrule.value})` };
        }
        return { atrule };
    }

    parse(css=this.css):StyleSheet {
        css = this._removeComment(css);
        let index = 0;
        const styleSheet = new StyleSheet();

        while (true) {
            const firstLetter = searchFrom(css, /\S/, index);
            if (firstLetter === -1) break;
            if (css.charAt(firstLetter) === '@') {
                // atrule
                const ruleEnd = searchFrom(css, ';', firstLetter);
                const nestStart = searchFrom(css, '{', firstLetter);

                if (nestStart === -1 || (ruleEnd !== -1 && ruleEnd < nestStart)) {
                    // inline atrule
                    let atrule = css.substring(firstLetter, ruleEnd).trim();
                    if (this.processor) {
                        const directives = this._handleDirectives(atrule);
                        if (directives?.atrule) atrule = directives.atrule;
                    }
                    const parsed = InlineAtRule.parse(atrule);
                    if (parsed) styleSheet.add(parsed.toStyle(undefined, this.escape));
                    index = ruleEnd + 1;
                } else {
                    // nested atrule
                    const nestEnd = this._searchGroup(css, nestStart+1);
                    let atrule = css.substring(firstLetter, nestStart).trim();
                    if (this.processor) {
                        const directives = this._handleDirectives(atrule);
                        if (directives?.atrule) {
                            styleSheet.add(this.parse(css.substring(nestStart + 1, nestEnd)).children.map(i=>i.atRule(directives.atrule)));
                        } else if (directives?.variants) {
                            const variants = directives.variants;
                            const style = this.parse(css.substring(nestStart + 1, nestEnd)).children;
                            variants.map(i=>this.processor?.wrapWithVariants(i, style)).forEach(i=>i && styleSheet.add(i));
                        }
                    } else {
                        styleSheet.add(this.parse(css.substring(nestStart + 1, nestEnd)).children.map(i=>i.atRule(atrule)));
                    }
                    index = nestEnd + 1;
                }
            } else {
                const nestStart = searchFrom(css, '{', firstLetter);
                const nestEnd = this._searchGroup(css, nestStart+1);
                if (nestStart === -1) {
                    // inline properties
                    styleSheet.add(this._generateStyle(css, undefined));
                    break;
                }
                // nested selector
                styleSheet.add(this._generateStyle(css.substring(nestStart+1, nestEnd), css.substring(firstLetter, nestStart).trim()));
                index = nestEnd + 1;
            }
        }
        return styleSheet;
    }
}