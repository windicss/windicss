import colors from '../../config/colors.js';
import { Property } from '../../utils/style';
import { isNumber, isFraction, isSize, fracToPercent, hex2RGB } from '../../utils/tools';

class Handler {
    raw:string
    center:string;
    amount:string;
    value:string|undefined;
    constructor(raw:string, center:string, amount:string) {
        this.raw = raw;
        this.center = center;
        this.amount = amount;
        this.value = undefined;
    }
    handleStatic(map:{ [key: string]: string }, callback?:(str:string)=>string|undefined) {
        if (this.value) return this;
        if (this.amount in map) this.value = callback?callback(this.amount):map[this.amount];
        return this;
    }
    handleNumber(start=-Infinity, end=Infinity, type:'int'|'float'='int', callback?:(number:number)=>string|undefined) {
        if (this.value) return this;
        if (isNumber(this.amount, start, end, type)) this.value = callback? callback(+this.amount) : this.amount;
        return this;
    }
    handleNxl(callback?:(number:number)=>string|undefined) {
        if (this.value) return this;
        if (/^\d*xl$/.test(this.amount)) this.value = callback? callback(this.amount==='xl'?1:parseInt(this.amount)): parseInt(this.amount).toString();
        return this;
    }
    handleFraction(callback?:(fraction:string)=>string|undefined) {
        if (this.value) return this;
        if (isFraction(this.amount)) this.value = callback?callback(this.amount):fracToPercent(this.amount);
        return this;
    }
    handleSize(callback?:(size:string)=>string|undefined) {
        if (this.value) return this;
        if (isSize(this.amount)) this.value = callback?callback(this.amount):this.amount;
        return this;
    }
    handleVariable(callback?:(variable:string)=>string|undefined) {
        if (this.value) return this;
        const matchVariable = this.raw.match(/-\$[\w-]+/);
        if (matchVariable) {
            const variableName = matchVariable[0].substring(2);
            this.value = callback?callback(variableName):`var(--${variableName})`;
        }
        return this;
    }
    handleColor(callback?:(color:string)=>string|undefined) {
        if (this.value) return this;
        let color;
        if (this.amount in colors) color = colors[this.amount];
        if (this.center in colors) color = colors[this.center];
        if (this.center === 'hex' && hex2RGB(this.amount)) color = '#'+this.amount;
        if (typeof color === 'string') {
            this.value = callback?callback(color):color;
        } else if (typeof color === 'object') {
            this.value = callback?callback(color[this.amount]):color[this.amount];
        }
        return this;
    }
    handleValue(callback?:(value:string)=>string|undefined) {
        if (!this.value) return this;
        if (callback) this.value = callback(this.value);
        return this;
    }
    createProperty(name:string|string [], callback?:(value:string)=>string) {
        if (!this.value) return;
        const value = callback?callback(this.value):this.value;
        return new Property(name, value);
    }
}

export class Utility {
    raw:string;
    constructor(raw:string) {
        this.raw = raw;  // -placeholder-real-gray-300
    }
    match(expression:RegExp) {
        const match = this.absolute.match(expression);
        return match ? match[0]: '';
    }
    get class() {
        return '.' + this.raw; // .-placeholder-real-gray-300
    }
    get isNegative() {
        return this.raw[0] === '-'; // true
    }
    get absolute() {
        return this.isNegative?this.raw.substring(1,):this.raw;
    }
    get identifier() {
        return this.match(/[^-]+/); // placeholder
    }
    get key() {
        return this.match(/^\w[-\w]+(?=-)/); // placeholder-real-gray
    }
    get center() {
        return this.match(/-.+(?=-)/).substring(1,); // real-gray
    }
    get amount() {
        return this.match(/[^-]+$/); // 300
    }
    get body() {
        return this.match(/-.+/).substring(1,); // real-gray-300
    }
    get handler() {
        return new Handler(this.raw, this.center, this.amount);
    }
}