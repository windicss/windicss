export function isSpace(str: string): boolean {
  return /\s/.test(str);
}

export function isDigit(str: string): boolean {
  return /^\d+$/.test(str);
}

export function isAlpha(str: string): boolean {
  return /\w/.test(str);
}

export function connect(strings: string[]): string {
  return strings.join(';\n') + ';';
}

export function findGroupEnd(text: string, startIndex = 0): number {
  let level = 1;
  let endBracket = searchFrom(text, '}', startIndex);
  while (endBracket !== -1) {
    const nextBracket = searchFrom(text, '{', startIndex);
    if (endBracket < nextBracket || nextBracket === -1) {
      level--;
      startIndex = endBracket + 1;
      if (level === 0) return endBracket;
    } else {
      level++;
      startIndex = nextBracket + 1;
    }
    endBracket = searchFrom(text, '}', startIndex);
  }
  return -1;
}

export function searchFrom(
  text: string,
  target: string | RegExp,
  startIndex = 0,
  endIndex?: number
): number {
  // search from partial of string
  const subText = text.substring(startIndex, endIndex);
  const relativeIndex = subText.search(target);
  return relativeIndex === -1 ? -1 : startIndex + relativeIndex;
}
