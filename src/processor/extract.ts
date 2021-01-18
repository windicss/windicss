import staticUtility from './utilities/static';
import dynamicUtility from './utilities/dynamic';
import { Utility } from './utilities/handler';
import { Style, Property } from '../utils/style';

import type { ThemeUtil } from '../interfaces';


export default function extract(theme:ThemeUtil, className:string, addComment=false) {
    let result: Style | Style [] | undefined;
    if (className in staticUtility) {
        result = new Style('.' + className);
        for (const [k, v] of Object.entries(staticUtility[className])) {
            if (typeof v === 'string') {
                result.add(new Property(k, v, addComment?className:undefined));
            } else {
                for (const i of v) {
                    result.add(new Property(k, i, addComment?className:undefined));
                }
            }
        };
    } else {
        const matches = className.match(/\w+/);
        const key = matches ? matches[0]: undefined;
        if (key && key in dynamicUtility) {
            const u = dynamicUtility[key](new Utility(className), { theme });
            if (u) {
                if (u instanceof Property) {
                    result = new Style('.' + className);
                    if (addComment) u.comment = className;
                    result.add(u);
                } else {
                    if (Array.isArray(u)) {
                        result = u.map(i=>{
                            if (i instanceof Property) {
                                if (addComment) i.comment = className;
                                return i.toStyle('.' + className);
                            }
                            if (addComment) i.property.forEach(p => (p instanceof Property)? p.comment = className:undefined);
                            return i;
                        });
                    } else {
                        if (addComment) u.property.forEach(p => (p instanceof Property)? p.comment = className:undefined);
                        result = u;
                    }
                }
            }
        }
    }
    return result;
}