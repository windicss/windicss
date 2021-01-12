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

    const _gStyle = (baseClass:string, variants:string[], selector:string) => {
        const result = extract(baseClass, showComment);
        if (result) {
            success.push(selector);
            if (Array.isArray(result)) {
                result.forEach(i=>{
                    i.selector = buildSelector;
                })
            } else {
                result.selector = buildSelector;
            }
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
        className: success.length>0 ? className : undefined,
        styleSheet: style.combine()
    };
}