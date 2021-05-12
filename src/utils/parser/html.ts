export type Attr = { raw: string, key: string, value: string|string[], start: number, end: number };
export type ClassName = { result: string, start: number, end: number };

export default class HTMLParser {
  html?: string;
  constructor(html?: string) {
    this.html = html;
  }

  parseAttrs(): Attr[] {
    if (!this.html) return [];
    const output: Attr[] = [];
    const regex = /\S+\s*=\s*"[^"]+"|\S+\s*=\s*'[^']+'|\S+\s*=\s*[^>\s]+/igm;
    let match;
    while ((match = regex.exec(this.html as string))) {
      if (match) {
        const raw = match[0];
        const sep = raw.indexOf('=');
        const key = raw.slice(0, sep).trim();
        let value: string| string[] = raw.slice(sep + 1).trim();
        if (['"', '\''].includes(value.charAt(0))) value = value.slice(1, -1);
        value = value.split(/\s/).filter(i => i);
        value = value[0] === undefined ? '' : value[1] === undefined ? value[0] : value;
        output.push({
          raw,
          key,
          value,
          start: match.index,
          end: regex.lastIndex,
        });
      }
    }
    return output;
  }

  parseClasses(): ClassName[] {
    // Match all class properties
    if (!this.html) return [];
    const classRegex = /class\s*=\s*(["'])(?:(?=(\\?))\2.)*?\1/;
    const quoteRegex = /["']/;
    const classNames: ClassName[] = [];
    let _indexStart = 0;
    let _htmlLeft = this.html;
    let propStart = _htmlLeft.search(classRegex);
    while (propStart !== -1) {
      const afterMatch = _htmlLeft.substring(propStart);
      const relativeStart = afterMatch.search(quoteRegex);
      const relativeEnd = afterMatch
        .substring(relativeStart + 1)
        .search(quoteRegex);
      const absoluteStart = propStart + relativeStart + 1;
      const absoluteEnd = absoluteStart + relativeEnd;
      classNames.push({
        result: _htmlLeft.substring(absoluteStart, absoluteEnd),
        start: _indexStart + absoluteStart,
        end: _indexStart + absoluteEnd,
      });
      _htmlLeft = _htmlLeft.substring(absoluteEnd + 2);
      _indexStart += absoluteEnd + 2;
      propStart = _htmlLeft.search(classRegex);
    }
    return classNames;
  }

  parseTags(): string[] {
    // Match all html tags
    if (!this.html) return [];
    return Array.from(new Set(this.html.match(/<\w+/g))).map((i) =>
      i.substring(1)
    );
  }
}
