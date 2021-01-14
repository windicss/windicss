import { resolve } from 'path';
import extract from './extract';
import preflight from './preflight';
import interpret from './interpret';
import compile from './compile';
import defaultConfig from '../config/default';
import { getNestedValue, escape } from '../utils/tools';
import { Style } from '../utils/style';

export default class Processor {
    private _config: {theme?:{[key:string]:any}};
    private _plugins: string[];

    constructor(config?:string|object, plugins:string[]=[]) {
        this._config = this._parseConfig(config ? typeof config === 'string' ? require(resolve(config)) : config : {});
        this._plugins = plugins;
    }

    _parseConfig(userConfig:{[key:string]:any}) {
        const userTheme = userConfig.theme;
        if (userTheme) delete userConfig.theme;
        const extendTheme:{[key:string]:{}} = userTheme?.extend ?? {};
        if (userTheme && extendTheme) delete userTheme.extend;
        const theme = { ...defaultConfig.theme, ...userTheme };
        for (let [key, value] of Object.entries(extendTheme)) {
            theme[key] = {...theme[key]??{}, ...value};
        };
        return { ...defaultConfig, ...userConfig, theme };
    }

    extract(className:string, addComment=false) {
        return extract(this.config, className, addComment);
    }

    preflight(tags:string [], global=true) {
        return preflight(this.config, tags, global);
    }

    interpret(classNames:string) {
        return interpret(this.config, classNames);
    }

    compile(classNames:string, prefix='windi-', showComment=false) {
        return compile(this.config, classNames, prefix, showComment);
    }

    // tailwind interfaces
    config(path:string, defaultValue?:any) {
        return getNestedValue(this._config, path) ?? defaultValue;
    }

    theme(path:string, defaultValue?:any) {
        const theme = this._config.theme;
        return theme ? getNestedValue(theme, path) ?? defaultValue : undefined;
    }

    corePlugins() {

    }

    variants() {

    }

    e(selector:string) {
        return escape(selector);
    }

    prefix() {

    }

    addUtilities(utilities:{[key:string]:{[key:string]:string}}, options:string[]|{}=[]) {

    }

    addComponents(components:{[key:string]:string|{[key:string]:string}}, options:string[]|{}=[]) {

    }

    addBase(baseStyles:{[key:string]:string|{[key:string]:string}}) {

    }

    addVariant(name:string, generator:(selector:string)=>Style, options={}) {

    }
}