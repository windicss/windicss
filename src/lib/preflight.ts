import preflights from './utilities/preflight';
import { Style, Property, StyleSheet } from '../utils/style';
import type { ThemeUtilStr } from '../interfaces';

export default function preflight(theme:ThemeUtilStr, tags:string [], global=true) {
    // Generate preflight style based on html tags.
    const globalSheet = new StyleSheet();
    const styleSheet = new StyleSheet();

    const createStyle = (selector:string|undefined, properties: {[key:string]:string|string[]|((theme:ThemeUtilStr)=>string)}) => {
        const style = new Style(selector, undefined, false);
        for (let [key, value] of Object.entries(properties)) {
            if (Array.isArray(value)) {
                value.forEach(v=>{
                    style.add(new Property(key, v));
                })
            } else {
                style.add(new Property(key, typeof value === 'function'? value(theme): value));
            }
        }
        return style;
    }
    preflights.forEach(p=>{
        if (global && p.global) {
           globalSheet.add(createStyle(p.selector, p.properties));
        } else {
            const includeTags = tags.filter(i=>p.keys.includes(i));
            if (includeTags.length > 0) {
                styleSheet.add(createStyle(p.selector?p.selector:includeTags.join(', '), p.properties));
            }
        }
    });
    let result = styleSheet.combine().sort();
    return global? result.extend(globalSheet.combine().sort(), false) : result;
}