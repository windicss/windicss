import colorString from 'color-string';
import type { Color } from 'color-string';

export function hsl2rgb(h: number, s: number, l: number): [number, number, number] {
  l /= 100;
  if (h >= 360) h %= 360;

  const c = (1 - Math.abs(2 * l - 1)) * (s / 100);
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c/2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c + m; g = x + m; b = m;
  } else if (60 <= h && h < 120) {
    r = x + m; g = c + m; b = m;
  } else if (120 <= h && h < 180) {
    r = m; g = c + m; b = x + m;
  } else if (180 <= h && h < 240) {
    r = m; g = x + m; b = c + m;
  } else if (240 <= h && h < 300) {
    r = x + m; g = m; b = c + m;
  } else if (300 <= h && h < 360) {
    r = c + m; g = m; b = x + m;
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
  ];
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
  if (/^hsla?/.test(color)) {
    const color_array = colorString.get.hsl(color);
    if (!color_array) return;
    return [...hsl2rgb(color_array[0], color_array[1], color_array[2]), color_array[3]];
  } else if (/^rgba?/.test(color)) {
    const color_array = colorString.get.rgb(color);
    if (!color_array) return;
    return color_array;
  } else if (color.startsWith('hwb')) {
    const color_array = colorString.get.hwb(color);
    if (!color_array) return;
    return [...hwb2rgb(color_array[0], color_array[1], color_array[2]), color_array[3]];
  }
  return colorString.get(color)?.value;
}

export function toRGB(color: string): number[] | undefined {
  const rgba = toRGBA(color);
  if (!rgba) return;
  rgba.pop();
  return rgba;
}

export function toColor(color_string: string) : { color: string, opacity: string } {
  const rgba = toRGBA(color_string);
  const color = rgba ? rgba.slice(0, 3).join(', ') : color_string;
  const opacity = rgba ? rgba[3].toString() : '1';

  return { color, opacity };
}
