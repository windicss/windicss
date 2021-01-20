import { wrapit, escape } from '../tools';

export class Property {
    name: string|string [];
    value?: string;
    comment?:string;

    constructor(name: string|string [], value?: string, comment?:string) {
        this.name = name;
        this.value = value;
        this.comment = comment;
    }

    static parse(css:string) {
        css = css.trim();
        if (!css) return;
        const split = css.search(':');
        const end = css.search(';');
        if (split === -1) {
            console.log(css);
            throw new Error('No attribute value defined!');
        }
        return new Property(css.substring(0, split).trim(), css.substring(split+1, end === -1 ? undefined : end).trim());
    }

    toStyle(selector?:string) {
        return new Style(selector, this);
    }

    build(minify=false):string {
        const createProperty = (name: string, value?: string) => {
            if (minify) {
                return `${name}:${value};`;
            } else {
                const p = `${name}: ${value};`;
                return this.comment? p + ` /* ${this.comment} */` : p;
            }
        };
        return (typeof this.name === 'string') ? createProperty(this.name, this.value) : this.name.map(i=>createProperty(i, this.value)).join(minify?'':'\n');
    }
}

export class InlineAtRule extends Property {
    name: string;
    constructor(name:string, value?:string) {
        super(name, value);
        this.name = name;
    }
    static parse(css:string) {
        const matchName = css.match(/@[^\s\{}]+/);
        if (matchName) {
            const name = matchName[0].substring(1, );
            const expression = matchName.index !== undefined ? css.substring(matchName.index + name.length + 1, ).match(/[^;]*/)?.[0].trim(): undefined;
            return new InlineAtRule(name, expression);
        }
        throw new Error('Not an available atrule!');
    }
    build() {
        return `@${this.name} ${this.value};`;
    }
}


export class Style {
    wrap?: (rule:string)=>string; // wrap rule, like :global(.bg-white)
    selector?: string;
    escape: boolean;
    property: (Style|Property) [];
    private _pseudoClasses?: string [];
    private _pseudoElements?: string [];
    private _parentSelectors?: string [];
    private _childSelectors?: string [];
    private _atRules?: string [];

    constructor(selector?: string, property?: Property | Style | (Style|Property)[], escape=true, wrap?:(rule:string)=>string) {
        this.selector = selector;
        this.escape = escape;
        this.wrap = wrap;
        this.property = (property instanceof Property || property instanceof Style)?[property]:property ?? [];
    }

    get rule() {
        let result = this.selector ? this.escape ? escape(this.selector) : this.selector : '';
        this._parentSelectors && (result = `${this._parentSelectors.join(' ')} ${result}`);
        this._pseudoClasses && (result += `:${this._pseudoClasses.join(':')}`);
        this._pseudoElements && (result += `::${this._pseudoElements.join('::')}`);
        this._childSelectors && (result += ` ${this._childSelectors.join(' ')}`);
        return this.wrap? this.wrap(result) : result;
    }

    get atRules() {
        return this._atRules;
    }

    clearAtRules() {
        this._atRules = [];
        return this;
    }

    atRule(atrule?:string) {
        if (!atrule) return this;
        if (this._atRules) {
            this._atRules.push(atrule);
        } else {
            this._atRules = [ atrule ];
        }
        return this;
    }

    pseudoClass(string:string) {
        if (this._pseudoClasses) {
            this._pseudoClasses.push(string);
        } else {
            this._pseudoClasses = [ string ];
        }
        return this;
    }

    pseudoElement(string:string) {
        if (this._pseudoElements) {
            this._pseudoElements.push(string);
        } else {
            this._pseudoElements = [ string ];
        }
        return this;
    }

    parent(string:string) {
        if (this._parentSelectors) {
            this._parentSelectors.push(string);
        } else {
            this._parentSelectors = [ string ];
        }
        return this;
    }

    child(string:string) {
        if (this._childSelectors) {
            this._childSelectors.push(string);
        } else {
            this._childSelectors = [ string ];
        }
        return this;
    }

    add(item: Property | Style | (Property|Style)[]) {
        if (Array.isArray(item)) {
            this.property = [...this.property, ...item];
        } else {
            this.property.push(item);
        }
        return this;
    }

    extend(item: Style|undefined, onlyProperty=false, append=true) {
        if (!item) return this;
        const connect = append? (list:any[]=[], anotherList:any[]=[]) => [...list, ...anotherList] : (list:any[]=[], anotherList:any[]=[]) => [...anotherList, ...list];
        this.property = connect(this.property, item.property);
        if (onlyProperty) return this;
        if (item.selector) this.selector = item.selector;
        if (item._atRules) this._atRules = connect(item._atRules, this._atRules); // atrule is build in reverse
        if (item._childSelectors) this._childSelectors = connect(this._childSelectors, item._childSelectors);
        if (item._parentSelectors) this._parentSelectors = connect(this._parentSelectors, item._parentSelectors);
        if (item._pseudoClasses) this._pseudoClasses = connect(this._pseudoClasses, item._pseudoClasses);
        if (item._pseudoElements) this._pseudoElements = connect(this._pseudoElements, item._pseudoElements);
        return this;
    }

    clean() {
        // remove duplicated property
        let property:(Style|Property)[] = [];
        let cache:string[] = [];
        this.property.forEach(i=>{
           if (i instanceof Property) {
               const inline = i.build();
               if (!cache.includes(inline)) {
                   cache.push(inline);
                   property.push(i);
               }
           } else {
               property.push(i);
           }
        })
        this.property = property;
        return this;
    }

    sort() {
        // sort property
        this.property = this.property.sort((a: Style|Property, b: Style|Property)=>{
            if (a instanceof Property && b instanceof Property) {
                return (a.build() > b.build())?1:-1;
            };
            return 0;
        });
        return this;
    }

    build(minify=false):string {
        let result = this.property.map(p=>p.build(minify)).join(minify?'':'\n');
        if (!this.selector && !this._atRules) return result.replace(/;}/g, '}');
        if (this.selector) result = (minify? this.rule.replace(/,\s/g, ',') : this.rule + ' ') + wrapit(result, undefined, undefined, undefined, minify);
        if (this._atRules) {
            for (let rule of this._atRules) {
                result =  minify? `${rule.replace(/\s/g,'')}${wrapit(result, undefined, undefined, undefined, minify)}` : `${rule} ${wrapit(result, undefined, undefined, undefined, minify)}`;
            }
        }
        return minify ? result.replace(/;}/g, '}') : result;
    }

}

export class GlobalStyle extends Style {
    constructor(...args: any[]) {
        super(...args);
    }
}