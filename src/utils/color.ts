import colorString from 'color-string';
import type { Color } from 'color-string';

export function hsl2rgb(h: number, s: number, l: number): [number, number, number] {
  s = s / 100,
  l = l / 100;
  if (h >= 360)
    h %= 360;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c/2;
  let  r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return [r, g, b];
}

export function hwb2rgb(h: number, w: number, b: number): [number, number, number] {
  const rgb = hsl2rgb(h, 100, 50);

  for (let i = 0; i < 3; ++i) {
    let c = rgb[i] / 255;

    c *= 1 - w/100 - b/100;
    c += w/100;

    rgb[i] = Math.round(c * 255);
  }

  return rgb;
}

export function toRGBA(color: string): Color | undefined {
  if (/^hsl|^hsla/.test(color)) {
    const colorTuple = colorString.get.hsl(color);
    if (!colorTuple) return;
    return [...hsl2rgb(colorTuple[0], colorTuple[1], colorTuple[2]), colorTuple[3]];
  } else if (color.startsWith('hwb')) {
    const colorTuple = colorString.get.hwb(color);
    if (!colorTuple) return;
    return [...hwb2rgb(colorTuple[0], colorTuple[1], colorTuple[2]), colorTuple[3]];
  }
  return colorString.get(color)?.value;
}

export function toRGB(color: string): number[] | undefined {
  return toRGBA(color)?.slice(0, 3);
}

export function toColor(color: string) : { color: string, opacity: string } {
  const rgba = toRGBA(color) ?? [255, 255, 255, 1];
  return {
    color: rgba.slice(0, 3).join(', '),
    opacity: rgba[3].toString(),
  };
}
