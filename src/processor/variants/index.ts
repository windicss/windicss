import { default as screenVariants } from './screen';
import { default as stateVariants } from './state';
import { default as themeVariants } from './theme';
import { Style } from '../../utils/style';

const variant = {...screenVariants, ...stateVariants, ...themeVariants};

export {variant as variants};
// export default variant;

export function apply(variants: string[], styles: Style | Style []): Style [] {
    if (!Array.isArray(styles)) styles = [styles];
    if (variants.length === 0) return styles;
    return styles.map(style=>{
        return variants.map(i=>variant[i]()).reduce((previousValue:Style, currentValue:Style)=>{
            return previousValue.extend(currentValue);
        }).extend(style);
    })
}