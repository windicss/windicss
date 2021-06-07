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
    const output: ClassName[] = [];
    const regex = /class(Name)?\s*=\s*{`[^]+`}|class(Name)?\s*=\s*"[^"]+"|class(Name)?\s*=\s*'[^']+'|class(Name)?\s*=\s*[^>\s]+/igm;
    let match;
    while ((match = regex.exec(this.html as string))) {
      if (match) {
        const raw = match[0];
        const sep = raw.indexOf('=');
        let value: string| string[] = raw.slice(sep + 1).trim();
        let start = match.index + sep + 1 + (this.html.slice(sep + 1).match(/[^'"]/)?.index ?? 0);
        let end = regex.lastIndex;
        let first = value.charAt(0);
        while (['"', '\'', '`', '{'].includes(first)) {
          value = value.slice(1, -1);
          first = value.charAt(0);
          end--;
          start++;
        }
        output.push({
          result: value,
          start,
          end,
        });
      }
    }
    return output;
  }

  parseTags(): string[] {
    // Match all html tags
    if (!this.html) return [];
    return Array.from(new Set(this.html.match(/<\w+/g))).map((i) =>
      i.substring(1)
    );
  }
}
