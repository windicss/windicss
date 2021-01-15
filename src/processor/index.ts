import { resolve } from 'path';
import extract from './extract';
import preflight from './preflight';
import interpret from './interpret';
import compile from './compile';
import defaultConfig, { Config } from '../config/default';
import { getNestedValue, escape, negative, breakpoints } from '../utils/tools';
import { Style } from '../utils/style';



export default class Processor {
    private _config: {theme?:{[key:string]:any}};
    private _plugins: string[];

    constructor(config?:string|object, plugins:string[]=[]) {
        this._config = this._parseConfig(config ? typeof config === 'string' ? require(resolve(config)) : config : {});
        this._plugins = plugins;
        this._evalFunction();
    }

    private _parseConfig(userConfig: Config) {
        const presets = userConfig.presets ? this._parsePresets(userConfig.presets): defaultConfig;
        const userTheme = userConfig.theme;
        if (userTheme) delete userConfig.theme;
        const extendTheme:{[key:string]:{}} = userTheme?.extend ?? {};
        if (userTheme && extendTheme) delete userTheme.extend;
        const theme = { ...presets.theme, ...userTheme };
        for (let [key, value] of Object.entries(extendTheme)) {
            theme[key] = {...theme[key]??{}, ...value};
        };
        return { ...presets, ...userConfig, theme };
    }

    private _parsePresets(presets: Config[]) {
        let config:Config = {};
        presets.forEach(p=>{
            config = {...config, ...this._parseConfig(p)};
        });
        return config;
    }

    private _evalFunction() {
        if (!this._config.theme) return;
        const theme = (path:string, defaultValue?:any) => this.theme(path, defaultValue);
        for (let [key, value] of Object.entries(this._config.theme)) {
            if (typeof value === 'function') {
                this._config.theme[key] = value(theme, { negative, breakpoints });
            } 
        };
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

    // negative(config:{[key:string]:string}) {
    //     const newConfig:typeof config = {};
    //     for (let [key, value] of Object.entries(config)) {
    //         newConfig['-' + key] = '-' + value;
    //     }
    //     return newConfig;
    // }

    // breakpoints(config:{[key:string]:string}) {
    //     const newConfig:typeof config = {};
    //     for (let [key, value] of Object.entries(config)) {
    //         newConfig['screen-' + key] = value;
    //     }
    //     return newConfig;
    // };
}