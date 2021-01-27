export function linearGradient(value: string) {
  // Stupid method, will be changed in the next version...
  const map: { [key: string]: string[] } = {
    "linear-gradient(to top, var(--tw-gradient-stops))": [
      "-o-linear-gradient(bottom, var(--tw-gradient-stops))",
      "-webkit-gradient(linear, left bottom, left top, from(var(--tw-gradient-stops)))",
      "linear-gradient(to top, var(--tw-gradient-stops))",
    ],
    "linear-gradient(to top right, var(--tw-gradient-stops))": [
      "-o-linear-gradient(bottom left, var(--tw-gradient-stops))",
      "-webkit-gradient(linear, left bottom, right top, from(var(--tw-gradient-stops)))",
      "linear-gradient(to top right, var(--tw-gradient-stops))",
    ],
    "linear-gradient(to right, var(--tw-gradient-stops))": [
      "-o-linear-gradient(left, var(--tw-gradient-stops))",
      "-webkit-gradient(linear, left top, right top, from(var(--tw-gradient-stops)))",
      "linear-gradient(to right, var(--tw-gradient-stops))",
    ],
    "linear-gradient(to bottom right, var(--tw-gradient-stops))": [
      "-o-linear-gradient(top left, var(--tw-gradient-stops))",
      "-webkit-gradient(linear, left top, right bottom, from(var(--tw-gradient-stops)))",
      "linear-gradient(to bottom right, var(--tw-gradient-stops))",
    ],
    "linear-gradient(to bottom, var(--tw-gradient-stops))": [
      "-o-linear-gradient(top, var(--tw-gradient-stops))",
      "-webkit-gradient(linear, left top, left bottom, from(var(--tw-gradient-stops)))",
      "linear-gradient(to bottom, var(--tw-gradient-stops))",
    ],
    "linear-gradient(to bottom left, var(--tw-gradient-stops))": [
      "-o-linear-gradient(top right, var(--tw-gradient-stops))",
      "-webkit-gradient(linear, right top, left bottom, from(var(--tw-gradient-stops)))",
      "linear-gradient(to bottom left, var(--tw-gradient-stops))",
    ],
    "linear-gradient(to left, var(--tw-gradient-stops))": [
      "-o-linear-gradient(right, var(--tw-gradient-stops))",
      "-webkit-gradient(linear, right top, left top, from(var(--tw-gradient-stops)))",
      "linear-gradient(to left, var(--tw-gradient-stops))",
    ],
    "linear-gradient(to top left, var(--tw-gradient-stops))": [
      "-o-linear-gradient(bottom right, var(--tw-gradient-stops))",
      "-webkit-gradient(linear, right bottom, left top, from(var(--tw-gradient-stops)))",
      "linear-gradient(to top left, var(--tw-gradient-stops))",
    ],
  };
  if (Object.keys(map).includes(value)) return map[value];
  return value;
}

export function minMaxContent(value: string) {
  if (value === "min-content") {
    return ["-webkit-min-content", "min-content"];
  } else if (value === "max-content") {
    return ["-webkit-max-content", "max-content"];
  }
  return value;
}
