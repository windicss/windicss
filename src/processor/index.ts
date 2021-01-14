import { default as extract } from './extract';
import { default as preflight } from './preflight';
import { default as interpret } from './interpret';
import { default as compile } from './compile';

export default class Processor {
    config: object;

    constructor(config?:string|object) {
        this.config = config ? typeof config === 'string' ? this._parseConfig(config) : config : {};
    }

    _parseConfig(configPath:string) {
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
}