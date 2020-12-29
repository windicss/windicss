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
    ast.forEach(obj=>{
        if (obj.type === 'utility') {
            if (Array.isArray(obj.content)) {
                // #todo, group && functions stuff
            } else {
                const result = extract(obj.content);
                if (result) {
                    success.push(obj.content);
                    if (result instanceof Style) result.selector = '.' + obj.raw.replace(/\s/g,'');
                    style.add(apply(obj.variants, result));
                } else {
                    ignored.push(obj.content);
                }
            }
        } else {
            ignored.push(obj.raw);
        }
    })
    
    return {
        success,
        ignored,
        styleSheet: style.sort()
    }
}