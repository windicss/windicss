import parse from './parse';
import extract from './extract';
import { apply } from './variants';
import { Style, StyleSheet } from '../utils/style';

export default function interpret(classNames:string) {
    // Interpret tailwind class then generate raw tailwind css.
    const ast = parse(classNames);
    const success:string [] = [];
    const ignored:string [] = [];
    const style = new StyleSheet();

    const _gStyle = (baseClass:string, variants:string[], selector:string) => {
        const result = extract(baseClass);
        if (result) {
            success.push(selector);
            if (result instanceof Style) result.selector = '.' + selector;
            style.add(apply(variants, result));
        } else {
            ignored.push(selector);
        }
    }

    ast.forEach(obj=>{
        if (obj.type === 'utility') {
            if (Array.isArray(obj.content)) {
                // #functions stuff
            } else {
                _gStyle(obj.content, obj.variants, obj.raw);
            }
        } else if (obj.type === 'group') {
            obj.content.forEach((u:{[key:string]:any})=>{
                const variants = [...obj.variants, ...u.variants];
                const selector = [...variants, u.content].join(':');
                _gStyle(u.content, variants, selector);
            })
        } else {
            ignored.push(obj.raw);
        }
    })
    
    return {
        success,
        ignored,
        styleSheet: style //.sort()
    }
}