import { resolve } from 'path';
import extract from './extract';
import preflight from './preflight';
import interpret from './interpret';
import compile from './compile';
import defaultConfig from '../config/default';
import screensGenerator from './variants/screen';
import themesGenerator from './variants/theme';
import statesGenerator from './variants/state';


import { getNestedValue, escape, negative, breakpoints } from '../utils/tools';
import { Style } from '../utils/style';

import type { Config, ConfigValue } from '../interfaces';



export default class Processor {
    private _config: Config;
    private _variants: {[key:string]:()=>Style};

    constructor(config?:string|object) {
        this._config = this.resolveConfig(config);
        this._variants = this.resolveVariants(this._config);
    }

    private _resolveConfig(userConfig: Config) {
        const presets = userConfig.presets ? this._resolvePresets(userConfig.presets): defaultConfig;
        const userTheme = userConfig.theme;
        if (userTheme) delete userConfig.theme;
        const extendTheme:{[key:string]:{}} = userTheme?.extend ?? {};
        if (userTheme && extendTheme) delete userTheme.extend;
        const theme:any = { ...presets.theme, ...userTheme };
        for (let [key, value] of Object.entries(extendTheme)) {
            theme[key] = {...theme[key]??{}, ...value};
        };
        return { ...presets, ...userConfig, theme };
    }

    private _resolvePresets(presets: Config[]) {
        let config:Config = {};
        presets.forEach(p=>{
            config = {...config, ...this._resolveConfig(p)};
        });
        return config;
    }

    private _resolveFunction(config:Config) {
        if (!config.theme) return config;
        const theme = (path:string, defaultValue?:any) => this.theme(path, defaultValue);
        for (let [key, value] of Object.entries(config.theme)) {
            if (typeof value === 'function') {
                config.theme[key] = value(theme, { negative, breakpoints });
            } 
        };
        return config;
    }

    private _resolveCorePlugins() {
        // not support yet
    }

    private _resolvePlugins() {
        // not support yet
    }

    resolveConfig(config:string|object|undefined) {
        return this._resolveFunction(this._resolveConfig(config ? typeof config === 'string' ? require(resolve(config)) : config : {}));
    }

    resolveVariants(config:Config) {
        return {...screensGenerator(config.theme?.screens ?? {}), ...themesGenerator(config.darkMode ?? 'class'), ...statesGenerator(config.variantOrder ?? [])};
    }

    wrapWithVariants(variants: string[], styles: Style | Style []): Style [] {
        // apply variant to style
        if (!Array.isArray(styles)) styles = [styles];
        if (variants.length === 0) return styles;
        return styles.map(style=>{
            return variants.map(i=>this._variants[i]()).reduce((previousValue:Style, currentValue:Style)=>{
                return previousValue.extend(currentValue);
            }).extend(style);
        })
    }

    extract(className:string, addComment=false) {
        return extract(this.config, className, addComment);
    }

    preflight(tags:string [], global=true) {
        const theme = (path:string, defaultValue?:any) => this.theme(path, defaultValue);
        return preflight(theme, tags, global);
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

    corePlugins(path:string) {
        if (Array.isArray(this._config.corePlugins)) {
            return this._config.corePlugins.includes(path)
        }
        return this.config(`corePlugins.${path}`, true)
    }

    variants(path:string, defaultValue?:any) {
        if (Array.isArray(this._config.variants)) {
            return this._config.variants
        }
        return this.config(`variants.${path}`, defaultValue);
    }

    e(selector:string) {
        return escape(selector);
    }

    prefix(selector:string) {
        return selector.replace(/(?=[\w])/, this._config.prefix ?? '');
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