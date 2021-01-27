const minMaxWidth = /(!?\(\s*min(-device-)?-width).+\(\s*max(-device)?-width/i;
const minWidth = /\(\s*min(-device)?-width/i;
const maxMinWidth = /(!?\(\s*max(-device)?-width).+\(\s*min(-device)?-width/i;
const maxWidth = /\(\s*max(-device)?-width/i;

const isMinWidth = _testQuery(minMaxWidth, maxMinWidth, minWidth);
const isMaxWidth = _testQuery(maxMinWidth, minMaxWidth, maxWidth);

const minMaxHeight = /(!?\(\s*min(-device)?-height).+\(\s*max(-device)?-height/i;
const minHeight = /\(\s*min(-device)?-height/i;
const maxMinHeight = /(!?\(\s*max(-device)?-height).+\(\s*min(-device)?-height/i;
const maxHeight = /\(\s*max(-device)?-height/i;

const isMinHeight = _testQuery(minMaxHeight, maxMinHeight, minHeight);
const isMaxHeight = _testQuery(maxMinHeight, minMaxHeight, maxHeight);

const isPrint = /print/i;
const isPrintOnly = /^print\$/i;
const isAtRule = /^\s*@/i;
const isMedia = /^\s*@media/i;

const maxValue = Number.MAX_VALUE;

function _getQueryLength(length: string) {
  const result = /(-?\d*\.?\d+)(ch|em|ex|px|rem)/.exec(length);

  if (result === null) {
    return maxValue;
  }

  const number = result[1];
  const unit = result[2];

  switch (unit) {
    case "ch":
      return parseFloat(number) * 8.8984375;
    case "em":
    case "rem":
      return parseFloat(number) * 16;
    case "ex":
      return parseFloat(number) * 8.296875;
    case "px":
      return parseFloat(number);
  }

  return +number;
}

function _testQuery(
  doubleTestTrue: RegExp,
  doubleTestFalse: RegExp,
  singleTest: RegExp
) {
  return function (query: string) {
    if (doubleTestTrue.test(query)) {
      return true;
    } else if (doubleTestFalse.test(query)) {
      return false;
    }
    return singleTest.test(query);
  };
}

function _testAtRule(a: string, b: string) {
  const isMediaA = isMedia.test(a);
  const isMediaB = isMedia.test(b);

  if (isMediaA && isMediaB) return null;

  const isAtRuleA = isAtRule.test(a);
  const isAtRuleB = isAtRule.test(b);

  if (isAtRuleA) return 1;
  if (isAtRuleB) return -1;

  return 0; // don't sort selector name, may cause overwrite bug.
}

function _testIsPrint(a: string, b: string) {
  const isPrintA = isPrint.test(a);
  const isPrintOnlyA = isPrintOnly.test(a);

  const isPrintB = isPrint.test(b);
  const isPrintOnlyB = isPrintOnly.test(b);

  if (isPrintA && isPrintB) {
    if (!isPrintOnlyA && isPrintOnlyB) {
      return 1;
    }
    if (isPrintOnlyA && !isPrintOnlyB) {
      return -1;
    }
    return a.localeCompare(b);
  }
  if (isPrintA) {
    return 1;
  }
  if (isPrintB) {
    return -1;
  }

  return null;
}

export default function sortMediaQuery(a: string, b: string): number {
  const testAtRule = _testAtRule(a, b);
  if (testAtRule !== null) return testAtRule;
  const testIsPrint = _testIsPrint(a, b);
  if (testIsPrint !== null) return testIsPrint;

  const minA = isMinWidth(a) || isMinHeight(a);
  const maxA = isMaxWidth(a) || isMaxHeight(a);

  const minB = isMinWidth(b) || isMinHeight(b);
  const maxB = isMaxWidth(b) || isMaxHeight(b);

  if (minA && maxB) {
    return -1;
  }
  if (maxA && minB) {
    return 1;
  }

  const lengthA = _getQueryLength(a);
  const lengthB = _getQueryLength(b);

  if (lengthA === maxValue && lengthB === maxValue) {
    return a.localeCompare(b);
  } else if (lengthA === maxValue) {
    return 1;
  } else if (lengthB === maxValue) {
    return -1;
  }

  if (lengthA > lengthB) {
    if (maxA) {
      return -1;
    }
    return 1;
  }

  if (lengthA < lengthB) {
    if (maxA) {
      return 1;
    }
    return -1;
  }

  return a.localeCompare(b);
}
