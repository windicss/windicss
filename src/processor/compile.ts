import parse from './parse';
import extract from './extract';
import { apply } from './variants';
import { hash } from '../utils/tools';
import { Style, StyleSheet } from '../utils/style';

export default function compile(classNames:string, prefix='windi-', showComment=false) {
    // Compile tailwind css classes to one combined class.
    const ast = parse(classNames);
    const success:string [] = [];
    const ignored:string [] = [];
    const style = new StyleSheet();
    const className = prefix + hash(JSON.stringify(ast.sort((a: {[key:string]:any}, b: {[key:string]:any}) => a.raw - b.raw)));
    const buildSelector = '.' + className;
    ast.forEach(obj=>{
        if (obj.type === 'utility') {
            if (Array.isArray(obj.content)) {
                // #todo, group && functions stuff
            } else {
                const result = extract(obj.content, showComment);
                if (result) {
                    success.push(obj.content);
                    if (Array.isArray(result)) {
                        result.forEach(i=>{
                            i.selector = buildSelector;
                        })
                    } else {
                        result.selector = buildSelector;
                    }
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
        className: success.length>0 ? className : undefined,
        styleSheet: style.combine()
    };
}