import extract from './extract';
import { apply } from './variants';
import { ClassParser } from '../utils/parser';
import { Style, StyleSheet } from '../utils/style';

export default function interpret(config:object, classNames:string) {
    // Interpret tailwind class then generate raw tailwind css.
    const ast = new ClassParser(classNames).parse();
    const success:string [] = [];
    const ignored:string [] = [];
    const style = new StyleSheet();

    const _gStyle = (baseClass:string, variants:string[], selector:string) => {
        const result = extract(config, baseClass);
        if (result) {
            success.push(selector);
            if (result instanceof Style) result.selector = '.' + selector;
            style.add(apply(config, variants, result));
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