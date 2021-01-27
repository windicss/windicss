import colors from "../../config/colors";
import { Property } from "../../utils/style";
import { camelToDash } from "../../utils/tools";
import {
  isNumber,
  isFraction,
  isSize,
  roundUp,
  fracToPercent,
  hex2RGB,
  negateValue,
} from "../../utils/tools";

const DEFAULT_COLORS: { [key: string]: string | { [key: string]: string } } = {
  transparent: "transparent",
  current: "currentColor",
  ...colors,
};

for (let [key, value] of Object.entries(colors)) {
  DEFAULT_COLORS[camelToDash(key)] = value;
}

class Handler {
  private _center: string;
  private _amount: string;
  utility: Utility;
  value: string | undefined;
  constructor(utility: Utility) {
    this.utility = utility;
    this.value = undefined;
    // speed up
    this._amount = utility.amount;
    this._center = utility.center;
  }
  handleStatic(
    map?: { [key: string]: string | string[] },
    callback?: (str: string) => string | undefined
  ) {
    if (this.value) return this;
    if (!map) return this;
    if (map.DEFAULT) map[this.utility.raw] = map.DEFAULT;
    if (this._amount in map)
      this.value = callback ? callback(this._amount) : `${map[this._amount]}`;
    return this;
  }
  handleBody(
    map?: { [key: string]: string | string[] },
    callback?: (str: string) => string | undefined
  ) {
    if (this.value) return this;
    if (!map) return this;
    if (map.DEFAULT) map[this.utility.raw] = map.DEFAULT;
    const body = this.utility.body;
    if (body in map) this.value = callback ? callback(body) : `${map[body]}`;
    return this;
  }
  handleNumber(
    start = -Infinity,
    end = Infinity,
    type: "int" | "float" = "int",
    callback?: (number: number) => string | undefined
  ) {
    if (this.value) return this;
    if (isNumber(this._amount, start, end, type))
      this.value = callback ? callback(+this._amount) : this._amount;
    return this;
  }
  handleSpacing() {
    // just a short-hand for handle spacing.
    return this.handleNumber(0, undefined, "float", (number: number) =>
      number === 0 ? "0px" : `${roundUp(number / 4, 6)}rem`
    );
  }
  handleNxl(callback?: (number: number) => string | undefined) {
    if (this.value) return this;
    if (/^\d*xl$/.test(this._amount))
      this.value = callback
        ? callback(this._amount === "xl" ? 1 : parseInt(this._amount))
        : parseInt(this._amount).toString();
    return this;
  }
  handleFraction(callback?: (fraction: string) => string | undefined) {
    if (this.value) return this;
    if (isFraction(this._amount))
      this.value = callback
        ? callback(this._amount)
        : fracToPercent(this._amount);
    return this;
  }
  handleSize(callback?: (size: string) => string | undefined) {
    if (this.value) return this;
    if (isSize(this._amount))
      this.value = callback ? callback(this._amount) : this._amount;
    return this;
  }
  handleVariable(callback?: (variable: string) => string | undefined) {
    if (this.value) return this;
    const matchVariable = this.utility.raw.match(/-\$[\w-]+/);
    if (matchVariable) {
      const variableName = matchVariable[0].substring(2);
      this.value = callback ? callback(variableName) : `var(--${variableName})`;
    }
    return this;
  }
  handleColor(
    map: { [key: string]: string | { [key: string]: string } } = DEFAULT_COLORS,
    callback?: (color: string) => string | undefined
  ) {
    if (this.value) return this;
    let color;
    if (this._amount in map) color = map[this._amount];
    if (this._center in map) color = map[this._center];
    if (this._center === "hex" && hex2RGB(this._amount))
      color = "#" + this._amount;
    if (typeof color === "string") {
      this.value = callback ? callback(color) : color;
    } else if (typeof color === "object") {
      this.value = callback
        ? callback(color[this._amount])
        : color[this._amount];
    }
    return this;
  }

  handleNegative(
    callback: (value: string) => string | undefined = negateValue
  ) {
    if (!this.value) return this;
    this.value = this.utility.isNegative ? callback(this.value) : this.value;
    return this;
  }

  handleValue(callback?: (value: string) => string | undefined) {
    if (!this.value) return this;
    if (callback) this.value = callback(this.value);
    return this;
  }

  createProperty(
    name: string | string[],
    callback?: (value: string) => string
  ) {
    if (!this.value) return;
    const value = callback ? callback(this.value) : this.value;
    return new Property(name, value);
  }
}

export class Utility {
  raw: string;
  constructor(raw: string) {
    this.raw = raw; // -placeholder-real-gray-300
  }
  match(expression: RegExp) {
    const match = this.absolute.match(expression);
    return match ? match[0] : "";
  }
  get class() {
    return "." + this.raw; // .-placeholder-real-gray-300
  }
  get isNegative() {
    return this.raw[0] === "-"; // true
  }
  get absolute() {
    return this.isNegative ? this.raw.substring(1) : this.raw;
  }
  get identifier() {
    return this.match(/[^-]+/); // placeholder
  }
  get key() {
    return this.match(/^\w[-\w]+(?=-)/); // placeholder-real-gray
  }
  get center() {
    return this.match(/-.+(?=-)/).substring(1); // real-gray
  }
  get amount() {
    return this.match(/[^-]+$/); // 300
  }
  get body() {
    return this.match(/-.+/).substring(1); // real-gray-300
  }
  get handler() {
    return new Handler(this);
  }
}
