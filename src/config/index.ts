export { baseConfig } from './base';
export { colors } from './colors';
export const twExclude = [
  /-hex-/,                          // disable hex color
  /-\$/,                            // disable variable
  /(rem|em|px|rpx|vh|vw|ch|ex)$/,   // disable size
  /-\d*[13579]$/,                   // disable odd number
  /-([0-9]{1,}[.][0-9]*)$/,         // disable float
  /^!/,                             // disable important utility
];
