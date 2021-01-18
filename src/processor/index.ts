import { resolve } from 'path';
import { getNestedValue, escape, hash } from '../utils/tools';
import { negative, breakpoints } from '../utils/helpers';
import { Style, StyleSheet } from '../utils/style';
import { ClassParser } from '../utils/parser';

import extract from './extract';
import preflight from './preflight';
import defaultConfig from '../config/default';
import resolveVariants from './variants';

import type { Config } from '../interfaces';


export default class Processor {
    private _config: Config;
    private _theme: Config['theme'];
    private _variants: {[key:string]:()=>Style};
    private _screens: {[key:string]:()=>Style} = {};
    private _states: {[key:string]:()=>Style} = {};
    private _themes: {[key:string]:()=>Style} = {};

    constructor(config?:string | Config) {
        this._config = this.resolveConfig(config);
        this._theme = this._config.theme;
        this._variants = this.resolveVariants(undefined, true);
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

    resolveConfig(config:string|Config|undefined) {
        this._config = this._resolveConfig(config ? typeof config === 'string' ? require(resolve(config)) : config : {});
        this._theme = this._config.theme; // update theme to make sure theme() function works.
        return this._resolveFunction(this._config);
    }

    resolveVariants(type?:'screen'|'theme'|'state', recreate = false) {
        if (recreate) {
            const variants = resolveVariants(this._config);
            this._screens = variants.screen;
            this._themes = variants.theme;
            this._states = variants.state;
        }
        switch (type) {
            case 'screen':
                return this._screens;
            case 'theme':
                return this._themes;
            case 'state':
                return this._states;
            default:
                return {...this._screens, ...this._themes, ...this._states};
        }
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
        const theme = (path:string, defaultValue?:any) => this.theme(path, defaultValue);
        return extract(theme, className, addComment);
    }

    preflight(tags:string [], global=true) {
        const theme = (path:string, defaultValue?:any) => this.theme(path, defaultValue);
        return preflight(theme, tags, global);
    }

    interpret(classNames:string) {
        // Interpret tailwind class then generate raw tailwind css.
        const ast = new ClassParser(classNames).parse();
        const success:string [] = [];
        const ignored:string [] = [];
        const style = new StyleSheet();
    
        const _gStyle = (baseClass:string, variants:string[], selector:string) => {
            const result = this.extract(baseClass);
            if (result) {
                success.push(selector);
                if (result instanceof Style) result.selector = '.' + selector;
                style.add(this.wrapWithVariants(variants, result));
            } else {
                ignored.push(selector);
            }
        };

        const _hGroup = (obj:{[key:string]:any}, parentVariants:string[]=[]) => {
            obj.content.forEach((u:{[key:string]:any})=>{
                if (u.type === 'group') {
                   _hGroup(u, obj.variants);
                } else {
                    // utility
                    const variants = [...parentVariants, ...obj.variants, ...u.variants];
                    const selector = [...variants, u.content].join(':');
                    _gStyle(u.content, variants, selector);
                }
            })
        };
    
        ast.forEach(obj=>{
            if (obj.type === 'utility') {
                if (Array.isArray(obj.content)) {
                    // #functions stuff
                } else {
                    _gStyle(obj.content, obj.variants, obj.raw);
                }
            } else if (obj.type === 'group') {
               _hGroup(obj);
            } else {
                ignored.push(obj.raw);
            }
        })
        
        return {
            success,
            ignored,
            styleSheet: style //.sort()
        }
    }

    compile(classNames:string, prefix='windi-', showComment=false) {
        // Compile tailwind css classes to one combined class.
        const ast = new ClassParser(classNames).parse();
        const success:string [] = [];
        const ignored:string [] = [];
        const style = new StyleSheet();
        const className = prefix + hash(JSON.stringify(ast.sort((a: {[key:string]:any}, b: {[key:string]:any}) => a.raw - b.raw)));
        const buildSelector = '.' + className;
    
        const _gStyle = (baseClass:string, variants:string[], selector:string) => {
            const result = this.extract(baseClass, showComment);
            if (result) {
                success.push(selector);
                if (Array.isArray(result)) {
                    result.forEach(i=>{
                        i.selector = buildSelector;
                    })
                } else {
                    result.selector = buildSelector;
                }
                style.add(this.wrapWithVariants(variants, result));
            } else {
                ignored.push(selector);
            }
        }

        const _hGroup = (obj:{[key:string]:any}, parentVariants:string[]=[]) => {
            obj.content.forEach((u:{[key:string]:any})=>{
                if (u.type === 'group') {
                   _hGroup(u, obj.variants);
                } else {
                    // utility
                    const variants = [...parentVariants, ...obj.variants, ...u.variants];
                    const selector = [...variants, u.content].join(':');
                    _gStyle(u.content, variants, selector);
                }
            })
        };
        
        ast.forEach(obj=>{
            if (obj.type === 'utility') {
                if (Array.isArray(obj.content)) {
                    // #functions stuff
                } else {
                    _gStyle(obj.content, obj.variants, obj.raw);
                }
            } else if (obj.type === 'group') {
                _hGroup(obj);
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

    // tailwind interfaces
    config(path:string, defaultValue?:any) {
        return getNestedValue(this._config, path) ?? defaultValue;
    }

    theme(path:string, defaultValue?:any):any {
        return this._theme ? getNestedValue(this._theme, path) ?? defaultValue : undefined;
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