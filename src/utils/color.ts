import colorString from 'color-string';
import type { Color } from 'color-string';

export function hsl2rgb(h: number, s: number, l: number): [number, number, number] {
  if (h >= 360) h %= 360;

  const c = ((1 - Math.abs(2 * (l / 100) - 1)) * (s / 100)) * 255;
  const x = (c * (1 - Math.abs((h / 60) % 2 - 1))) * 255;
  const m = (l - c/2) * 255;

  if (0 <= h && h < 60) {
    return [Math.round(c + m), Math.round(x + m), Math.round(m)];
  } else if (60 <= h && h < 120) {
    return [Math.round(x + m), Math.round(c + m), Math.round(m)];
  } else if (120 <= h && h < 180) {
    return [Math.round(m), Math.round(c + m), Math.round(x + m)];
  } else if (180 <= h && h < 240) {
    return [Math.round(m), Math.round(x + m), Math.round(c + m)];
  } else if (240 <= h && h < 300) {
    return [Math.round(x + m), Math.round(m), Math.round(c + m)];
  } else if (300 <= h && h < 360) {
    return [Math.round(c + m), Math.round(m), Math.round(x + m)];
  }
}

export function hwb2rgb(h: number, w: number, b: number): [number, number, number] {
  const rgb = hsl2rgb(h, 100, 50);
  
  return [
    Math.round((((rgb[0] / 255) * (1 - w/100 - b/100)) + w/100) * 255),
    Math.round((((rgb[1] / 255) * (1 - w/100 - b/100)) + w/100) * 255),
    Math.round((((rgb[2] / 255) * (1 - w/100 - b/100)) + w/100) * 255)
  ];
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
  rgba.pop()
  return rgba
}

export function toColor(color_string: string) : { color: string, opacity: string } {
  const rgba = toRGBA(color_string);
  const color = rgba ? rgba.slice(0, 3).join(', ') : color_string;
  const opacity = rgba ? rgba[3].toString() : '1';

  return { color, opacity };
}
