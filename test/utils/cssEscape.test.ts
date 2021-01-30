import { cssEscape } from "../../src/utils/algorithm";

describe('CSS Escape', () => {
  it('escape', () => {
    expect(cssEscape('w-1/2')).toBe(String.raw`w-1\/2`);
    expect(cssEscape(".test")).toBe(String.raw`\.test`);
    expect(cssEscape("sm:bg-red-500")).toBe(String.raw`sm\:bg-red-500`);
    expect(cssEscape("p-1.5")).toBe(String.raw`p-1\.5`);
    expect(cssEscape("@dark:p-1.5")).toBe(String.raw`\@dark\:p-1\.5`);
    expect(cssEscape("+sm:p-1.5")).toBe(String.raw`\+sm\:p-1\.5`);
    expect(cssEscape("-sm:p-1.5")).toBe(String.raw`-sm\:p-1\.5`);
    expect(cssEscape("p-1/3")).toBe(String.raw`p-1\/3`);
    expect(cssEscape("p-$v")).toBe(String.raw`p-\$v`);
    expect(cssEscape(".btn-blue .w-1/4 > h1.text-xl + a .bar")).toBe(String.raw`\.btn-blue\ \.w-1\/4\ \>\ h1\.text-xl\ \+\ a\ \.bar`);
  })
})
