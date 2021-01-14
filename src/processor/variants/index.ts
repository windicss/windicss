import { default as screenVariants } from './screen';
import { default as stateVariants } from './state';
import { default as themeVariants } from './theme';
import { Style } from '../../utils/style';

const VARIANTS = {...screenVariants, ...stateVariants, ...themeVariants};

export { VARIANTS as variants };

export function apply(config:object, variants: string[], styles: Style | Style []): Style [] {
    // apply variant to syle
    if (!Array.isArray(styles)) styles = [styles];
    if (variants.length === 0) return styles;
    return styles.map(style=>{
        return variants.map(i=>VARIANTS[i]()).reduce((previousValue:Style, currentValue:Style)=>{
            return previousValue.extend(currentValue);
        }).extend(style);
    })
}