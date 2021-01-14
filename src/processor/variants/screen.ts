import config from '../../config/default';
import { Style } from '../../utils/style';

const variants:{[key:string]:()=>Style} = {};
const screens = config.theme.screens;
const identifiers = Object.keys(screens);

for (let i=0; i<identifiers.length; i++) {
    const key = identifiers[i];
    const size = screens[key];
    variants[key] = () => new Style().atRule(`@media (min-width: ${size})`);
    variants['-' + key] = () => new Style().atRule(`@media (max-width: ${size})`);
    variants['+' + key] = () => new Style().atRule(identifiers[i+1]?
                                `@media (min-width: ${size}) and (max-width: ${screens[identifiers[i+1]]})`:
                                `@media (min-width: ${size})`);
}

export default variants;