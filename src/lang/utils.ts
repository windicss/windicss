export function isSpace(str: string): boolean {
  return /\s/.test(str);
}

export function isDigit(str: string): boolean {
  return /^\d+$/.test(str);
}
