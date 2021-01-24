import { baseUtilities } from './utilities';
import { Style, Property, StyleSheet } from '../utils/style';
import type { ThemeUtilStr } from '../interfaces';

export default function preflight(theme:ThemeUtilStr, tags?:string [], global=true) {
    // Generate preflight style based on html tags.
    const globalSheet = new StyleSheet();
    const styleSheet = new StyleSheet();

    const createStyle = (selector:string|undefined, properties: {[key:string]:string|string[]|((theme:ThemeUtilStr)=>string)}) => {
        const style = new Style(selector, undefined, false);
        for (let [key, value] of Object.entries(properties)) {
            style.add(Array.isArray(value) ? value.map(v => new Property(key,v)) : new Property(key, typeof value === 'function'? value(theme): value));
        }
        return style;
    }

    baseUtilities.forEach(p=>{
        if (global && p.global) {
           globalSheet.add(createStyle(p.selector, p.properties));
        } else if (tags) {
            const includeTags = tags.filter(i=>p.keys.includes(i));
            if (includeTags.length > 0) styleSheet.add(createStyle(p.selector?p.selector:includeTags.join(', '), p.properties));
        } else {
            styleSheet.add(createStyle(p.selector?p.selector:p.keys.join(', '), p.properties));
        }
    });

    const result = styleSheet.combine().sort();
    return global? result.extend(globalSheet.combine().sort(), false) : result;
}