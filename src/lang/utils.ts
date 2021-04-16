export function isSpace(str: string): boolean {
  return /\s/.test(str);
}

export function isDigit(str: string): boolean {
  return /^\d+$/.test(str);
}

export function isAlpha(str: string): boolean {
  return /\w/.test(str);
}

export function connectStatement(strings: string[]): string {
  return strings.map(i => i + ';').join('\n');
}
