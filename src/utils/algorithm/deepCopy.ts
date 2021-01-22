// copy from https://github.com/ramda/ramda/blob/master/source/internal/_clone.js

function type(val:any) {
    return val === null
      ? 'Null'
      : val === undefined
        ? 'Undefined'
        : Object.prototype.toString.call(val).slice(8, -1);
};


function _cloneRegExp(pattern: RegExp) {
    return new RegExp(pattern.source, (pattern.global     ? 'g' : '') +
                                      (pattern.ignoreCase ? 'i' : '') +
                                      (pattern.multiline  ? 'm' : '') +
                                      (pattern.sticky     ? 'y' : '') +
                                      (pattern.unicode    ? 'u' : ''));
}

function _clone(value: any, refFrom: any[], refTo: any[], deep:boolean) {
    let copy = function copy(copiedValue: any) {
      let len = refFrom.length;
      let idx = 0;
      while (idx < len) {
        if (value === refFrom[idx]) {
          return refTo[idx];
        }
        idx += 1;
      }
      refFrom[idx] = value;
      refTo[idx] = copiedValue;
      for (let key in value) {
        if (value.hasOwnProperty(key)) {
          copiedValue[key] = deep ? _clone(value[key], refFrom, refTo, true) : value[key];
        }
      }
      return copiedValue;
    };
    switch (type(value)) {
      case 'Object':  return copy(Object.create(Object.getPrototypeOf(value)));
      case 'Array':   return copy([]);
      case 'Date':    return new Date(value.valueOf());
      case 'RegExp':  return _cloneRegExp(value);
      default:        return value;
    }
  }

export default function deepCopy(value:any):typeof value {
    return value != null && typeof value.clone === 'function' ? value.clone() : _clone(value, [], [], true);
}