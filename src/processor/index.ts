import { default as extract } from './extract';
import { default as preflight } from './preflight';
import { default as interpret } from './interpret';
import { default as compile } from './compile';
import { Style } from '../utils/style';

export default class Processor {
    private _config: object;
    private _plugins: string[];

    constructor(config?:string|object, plugins:string[]=[]) {
        this._config = config ? typeof config === 'string' ? this._parseConfig(config) : config : {};
        this._plugins = plugins;
    }

    _parseConfig(path:string) {
        return {}
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
    config() {

    }

    theme() {

    }

    corePlugins() {

    }

    variants() {

    }

    e() {

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