import { Utility } from "./handler";
import { hex2RGB, dashToCamel, toType } from "../../utils/tools";
import { Property, Style } from "../../utils/style";
import { linearGradient, minMaxContent } from "../../utils/style/prefixer";
import {
  generateKeyframe,
  generateFontSize,
  expandDirection,
} from "../../utils/helpers";

import type { PluginUtils, FontSize, Output } from "../../interfaces";

// https://tailwindcss.com/docs/container
function container(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === "container") {
    const className = utility.class;
    const baseStyle = new Property("width", "100%").toStyle(utility.class);
    const paddingDefault = toType(theme("container.padding.DEFAULT"), "string");
    if (paddingDefault) baseStyle.add(new Property("padding", paddingDefault));
    if (theme("container.center"))
      baseStyle.add(new Property(["margin-left", "margin-right"], "auto"));
    const output: Style[] = [baseStyle];
    const screens = toType(theme("screens"), "object") ?? {};
    for (const [screen, size] of Object.entries(screens)) {
      const props = [new Property("max-width", `${size}`)];
      const padding = theme(`container.padding.${screen}`);
      if (padding && typeof padding === "string")
        props.push(new Property("padding", padding));
      output.push(
        new Style(className, props).atRule(`@media (min-width: ${size})`)
      );
    }
    return output;
  }
}

// https://tailwindcss.com/docs/object-position
function objectPosition(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme("objectPosition"))
    .createProperty(["-o-object-position", "object-position"]);
}

// https://tailwindcss.com/docs/top-right-bottom-left
function inset(utility: Utility, { theme }: PluginUtils): Output {
  const value = utility.handler
    .handleStatic(theme("inset"))
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNegative()
    .handleVariable().value;
  if (!value) return;
  switch (utility.identifier) {
    case "top":
    case "right":
    case "bottom":
    case "left":
      return new Property(utility.identifier, value);
    case "inset":
      if (utility.raw.match(/^-?inset-x/)) {
        return new Property(["right", "left"], value);
      } else if (utility.raw.match(/^-?inset-y/)) {
        return new Property(["top", "bottom"], value);
      } else {
        return new Property(["top", "right", "bottom", "left"], value);
      }
  }
}

// https://tailwindcss.com/docs/z-index
function zIndex(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme("zIndex"))
    .handleNumber(0, 99999, "int")
    .handleNegative()
    .handleVariable()
    .createProperty("z-index");
}

// https://tailwindcss.com/docs/flex
// https://tailwindcss.com/docs/flex-grow
// https://tailwindcss.com/docs/flex-shrink
function flex(utility: Utility, { theme }: PluginUtils): Output {
  const className = utility.raw;
  if (className.startsWith("flex-grow")) {
    const map = (toType(theme("flexGrow"), "object") ?? {}) as {
      [key: string]: string;
    };
    let amount = className.replace(/flex-grow-?/, "");
    if (amount === "") amount = "DEFAULT";
    if (Object.keys(map).includes(amount))
      return new Property(
        [
          "-webkit-box-flex",
          "-ms-flex-positive",
          "-webkit-flex-grow",
          "flex-grow",
        ],
        map[amount]
      ).toStyle(utility.class);
  } else if (className.startsWith("flex-shrink")) {
    const map = (toType(theme("flexShrink"), "object") ?? {}) as {
      [key: string]: string;
    };
    let amount = className.replace(/flex-shrink-?/, "");
    if (amount === "") amount = "DEFAULT";
    if (Object.keys(map).includes(amount))
      return new Property(
        ["-ms-flex-negative", "-webkit-flex-shrink", "flex-shrink"],
        map[amount]
      ).toStyle(utility.class);
  } else {
    const value = utility.handler.handleStatic(theme("flex")).value?.trim();
    if (value) {
      return new Style(utility.class, [
        new Property(
          "-webkit-box-flex",
          value.startsWith("0") || value === "none" ? "0" : "1"
        ),
        new Property(["-ms-flex", "-webkit-flex", "flex"], value),
      ]);
    }
  }
}

// https://tailwindcss.com/docs/order
function order(utility: Utility, { theme }: PluginUtils): Output {
  const value = utility.handler
    .handleStatic(theme("order"))
    .handleNumber(1, 9999, "int")
    .handleNegative()
    .handleVariable().value;
  if (value)
    return new Style(utility.class, [
      new Property(
        "-webkit-box-ordinal-group",
        value.startsWith("var")
          ? `calc(${value}+1)`
          : (parseInt(value) + 1).toString()
      ),
      new Property(["-webkit-order", "-ms-flex-order", "order"], value),
    ]);
}

// https://tailwindcss.com/docs/grid-template-columns
// https://tailwindcss.com/docs/grid-template-rows
function gridTemplate(utility: Utility, { theme }: PluginUtils): Output {
  let type;

  if (utility.raw.match(/^grid-rows-/)) {
    type = "rows";
  } else if (utility.raw.match(/^grid-cols-/)) {
    type = "columns";
  } else {
    return;
  }

  return utility.handler
    .handleStatic(
      type === "rows" ? theme("gridTemplateRows") : theme("gridTemplateColumns")
    )
    .handleNumber(1, undefined, "int")
    .handleVariable()
    .createProperty(`grid-template-${type}`, (value: string) =>
      value === "none" ? "none" : `repeat(${value}, minmax(0, 1fr));`
    );
}

// https://tailwindcss.com/docs/grid-column
function gridColumn(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  // col span
  const spans = (toType(theme("gridColumn"), "object") ?? {}) as {
    [key: string]: string;
  };
  if (Object.keys(spans).includes(body)) {
    return new Property(["-ms-grid-column-span", "grid-column"], spans[body]);
  }
  if (utility.raw.startsWith("col-span")) {
    return utility.handler
      .handleNumber(1, undefined, "int")
      .handleVariable()
      .createProperty(
        ["-ms-grid-column-span", "grid-column"],
        (value: string) => `span ${value} / span ${value}`
      );
  }
  // col end
  if (utility.raw.startsWith("col-end")) {
    return utility.handler
      .handleStatic(theme("gridColumnEnd"))
      .handleNumber(1, undefined, "int")
      .handleVariable()
      .createProperty("grid-column-end");
  }
  // col start
  if (utility.raw.startsWith("col-start")) {
    return utility.handler
      .handleStatic(theme("gridColumnStart"))
      .handleNumber(1, undefined, "int")
      .handleVariable()
      .createProperty("grid-column-start");
  }
}

// https://tailwindcss.com/docs/grid-row
function gridRow(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  // row span
  const spans = (toType(theme("gridRow"), "object") ?? {}) as {
    [key: string]: string;
  };
  if (Object.keys(spans).includes(body)) {
    return new Property(["-ms-grid-row-span", "grid-row"], spans[body]);
  }
  if (utility.raw.startsWith("row-span")) {
    return utility.handler
      .handleNumber(1, undefined, "int")
      .handleVariable()
      .createProperty(
        ["-ms-grid-row-span", "grid-row"],
        (value: string) => `span ${value} / span ${value}`
      );
  }
  // row end
  if (utility.raw.startsWith("row-end")) {
    return utility.handler
      .handleStatic(theme("gridRowEnd"))
      .handleNumber(1, undefined, "int")
      .handleVariable()
      .createProperty("grid-row-end");
  }
  // row start
  if (utility.raw.startsWith("row-start")) {
    return utility.handler
      .handleStatic(theme("gridRowStart"))
      .handleNumber(1, undefined, "int")
      .handleVariable()
      .createProperty("grid-row-start");
  }
}

// https://tailwindcss.com/docs/grid-auto-columns
// https://tailwindcss.com/docs/grid-auto-rows
function gridAuto(utility: Utility, { theme }: PluginUtils): Output {
  const type = utility.raw.startsWith("auto-cols")
    ? "columns"
    : utility.raw.startsWith("auto-rows")
    ? "rows"
    : undefined;
  if (!type) return;
  const value = utility.handler.handleStatic(
    theme(type === "columns" ? "gridAutoColumns" : "gridAutoRows")
  ).value;
  if (value) {
    const prefixer = minMaxContent(value);
    if (typeof prefixer === "string")
      return new Property(`grid-auto-${type}`, prefixer);
    return new Style(
      utility.class,
      prefixer.map((i) => new Property(`grid-auto-${type}`, i))
    );
  }
}

// https://tailwindcss.com/docs/gap
function gap(utility: Utility, { theme }: PluginUtils): Output {
  const value = utility.handler
    .handleStatic(theme("gap"))
    .handleSpacing()
    .handleSize()
    .handleVariable().value;
  if (!value) return;
  if (utility.raw.match(/^gap-x-/)) {
    return new Property(
      ["-webkit-column-gap", "-moz-column-gap", "column-gap"],
      value
    );
  } else if (utility.raw.match(/^gap-y-/)) {
    return new Property("row-gap", value);
  } else {
    return new Property("gap", value);
  }
}

// https://tailwindcss.com/docs/padding
function padding(utility: Utility, { theme }: PluginUtils): Output {
  const value = utility.handler
    .handleStatic(theme("padding"))
    .handleSpacing()
    .handleSize()
    .handleVariable().value;
  if (!value) return;
  const directions = expandDirection(utility.identifier.substring(1), false);
  if (directions) {
    if (directions[0] === "*") return new Property("padding", value);
    return new Property(
      directions.map((i) => `padding-${i}`),
      value
    );
  }
}

// https://tailwindcss.com/docs/margin
function margin(utility: Utility, { theme }: PluginUtils): Output {
  const value = utility.handler
    .handleStatic(theme("margin"))
    .handleSpacing()
    .handleSize()
    .handleNegative()
    .handleVariable().value;
  if (!value) return;
  const directions = expandDirection(utility.identifier.substring(1), false);
  if (directions) {
    if (directions[0] === "*") return new Property("margin", value);
    return new Property(
      directions.map((i) => `margin-${i}`),
      value
    );
  }
}

// https://tailwindcss.com/docs/space
function space(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === "space-x-reverse")
    return new Property("--tw-space-x-reverse", "1");
  if (utility.raw === "space-y-reverse")
    return new Property("--tw-space-y-reverse", "1");
  const value = utility.handler
    .handleStatic(theme("space"))
    .handleSpacing()
    .handleSize()
    .handleNegative()
    .handleVariable().value;
  if (!value) return;
  if (utility.raw.match(/^-?space-x-/)) {
    return new Style(utility.class, [
      new Property("--tw-space-x-reverse", "0"),
      new Property(
        "margin-right",
        `calc(${value} * var(--tw-space-x-reverse))`
      ),
      new Property(
        "margin-left",
        `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`
      ),
    ]).child("> :not([hidden]) ~ :not([hidden])");
  }
  if (utility.raw.match(/^-?space-y-/)) {
    return new Style(utility.class, [
      new Property("--tw-space-y-reverse", "0"),
      new Property(
        "margin-top",
        `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`
      ),
      new Property(
        "margin-bottom",
        `calc(${value} * var(--tw-space-y-reverse))`
      ),
    ]).child("> :not([hidden]) ~ :not([hidden])");
  }
}

// https://tailwindcss.com/docs/width
// https://tailwindcss.com/docs/height
function size(utility: Utility, { theme }: PluginUtils): Output {
  const name = utility.identifier === "w" ? "width" : "height";
  const body = utility.body;
  const sizes = (toType(theme(name), "object") ?? {}) as {
    [key: string]: string;
  };
  // handle static
  if (Object.keys(sizes).includes(body)) {
    const value = sizes[body];
    if (value === "min-content") {
      return new Style(utility.class, [
        new Property(name, "-webkit-min-content"),
        new Property(name, "-moz-min-content"),
        new Property(name, "min-content"),
      ]);
    } else if (value === "max-content") {
      return new Style(utility.class, [
        new Property(name, "-webkit-max-content"),
        new Property(name, "-moz-max-content"),
        new Property(name, "max-content"),
      ]);
    } else {
      return new Style(utility.class, new Property(name, value));
    }
  }
  return utility.handler
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNxl((number: number) => `${(number - 3) * 8 + 48}rem`)
    .handleVariable()
    .createProperty(name);
}

// https://tailwindcss.com/docs/min-width
// https://tailwindcss.com/docs/min-height
// https://tailwindcss.com/docs/max-width
// https://tailwindcss.com/docs/max-height
function minMaxSize(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.raw.replace(/^(min|max)-[w|h]-/, "");
  const prop = utility.raw
    .substring(0, 5)
    .replace("h", "height")
    .replace("w", "width");
  const sizes = (toType(theme(dashToCamel(prop)), "object") ?? {}) as {
    [key: string]: string;
  };
  // handle static
  if (Object.keys(sizes).includes(body)) {
    const value = sizes[body];
    if (value === "min-content") {
      return new Style(utility.class, [
        new Property(prop, "-webkit-min-content"),
        new Property(prop, "-moz-min-content"),
        new Property(prop, "min-content"),
      ]);
    } else if (value === "max-content") {
      return new Style(utility.class, [
        new Property(prop, "-webkit-max-content"),
        new Property(prop, "-moz-max-content"),
        new Property(prop, "max-content"),
      ]);
    } else {
      return new Style(utility.class, new Property(prop, value));
    }
  }

  return utility.handler
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNxl((number: number) => `${(number - 3) * 8 + 48}rem`)
    .handleVariable()
    .createProperty(prop);
}

// https://tailwindcss.com/docs/font-size
// https://tailwindcss.com/docs/text-opacity
// https://tailwindcss.com/docs/text-color
function text(utility: Utility, { theme }: PluginUtils): Output {
  // handle font opacity
  if (utility.raw.startsWith("text-opacity"))
    return utility.handler
      .handleStatic(theme("textOpacity"))
      .handleNumber(0, 100, "int", (number: number) =>
        (number / 100).toString()
      )
      .handleVariable()
      .createProperty("--tw-text-opacity");
  // handle font sizes
  const amount = utility.amount;
  const fontSizes = (toType(theme("fontSize"), "object") ?? {}) as {
    [key: string]: FontSize;
  };
  if (Object.keys(fontSizes).includes(amount))
    return new Style(utility.class, generateFontSize(fontSizes[amount]));
  let value = utility.handler
    .handleNxl((number: number) => `${number}rem`)
    .handleSize().value;
  if (utility.raw.startsWith("text-size-$"))
    value = utility.handler.handleVariable().value;
  if (value)
    return new Style(utility.class, [
      new Property("font-size", value),
      new Property("line-height", "1"),
    ]);

  // handle colors
  value = utility.handler.handleColor(theme("textColor")).handleVariable()
    .value;
  if (value) {
    if (["transparent", "currentColor"].includes(value))
      return new Property("color", value);
    return new Style(utility.class, [
      new Property("--tw-text-opacity", "1"),
      new Property(
        "color",
        `rgba(${
          value.startsWith("var") ? value : hex2RGB(value)?.join(", ")
        }, var(--tw-text-opacity))`
      ),
    ]);
  }
}

// https://tailwindcss.com/docs/font-family
// https://tailwindcss.com/docs/font-weight
function font(utility: Utility, { theme }: PluginUtils): Output {
  const fonts = theme("fontFamily") as {[key:string]:string|string[]};
  const map:{[key:string]:string} = {};
  for (const [key, value] of Object.entries(fonts)) {
    map[key] = Array.isArray(value)? value.join(',') : value;
  }
  return (
    utility.handler
      .handleStatic(map)
      .createProperty("font-family") ||
    utility.handler
      .handleStatic(theme("fontWeight"))
      .handleNumber(0, 900, "int")
      .handleVariable()
      .createProperty("font-weight")
  );
}

// https://tailwindcss.com/docs/letter-spacing
function letterSpacing(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme("letterSpacing"))
    .handleSize()
    .handleNegative()
    .handleVariable()
    .createProperty("letter-spacing");
}

// https://tailwindcss.com/docs/line-height
function lineHeight(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme("lineHeight"))
    .handleNumber(
      0,
      undefined,
      "int",
      (number: number) => `${number * 0.25}rem`
    )
    .handleSize()
    .handleVariable()
    .createProperty("line-height");
}

// https://tailwindcss.com/docs/list-style-type
function listStyleType(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme("listStyleType"))
    .createProperty("list-style-type");
}

// https://tailwindcss.com/docs/placeholder-color
// https://tailwindcss.com/docs/placeholder-opacity
function placeholder(utility: Utility, { theme }: PluginUtils): Output {
  // handle placeholder opacity
  if (utility.raw.startsWith("placeholder-opacity"))
    return utility.handler
      .handleStatic(theme("placeholderOpacity"))
      .handleNumber(0, 100, "int", (number: number) =>
        (number / 100).toString()
      )
      .handleVariable()
      .createProperty("--tw-placeholder-opacity");
  const value = utility.handler
    .handleColor(theme("placeholderColor"))
    .handleVariable().value;
  if (value) {
    if (["transparent", "currentColor"].includes(value))
      return new Property("color", value);
    const rgb = value.startsWith("var") ? value : hex2RGB(value)?.join(", ");
    return [
      new Style(utility.class, [
        new Property("--tw-placeholder-opacity", "1"),
        new Property("color", `rgba(${rgb}, var(--tw-placeholder-opacity))`),
      ]).pseudoElement("-webkit-input-placeholder"),
      new Style(utility.class, [
        new Property("--tw-placeholder-opacity", "1"),
        new Property("color", `rgba(${rgb}, var(--tw-placeholder-opacity))`),
      ]).pseudoElement("-moz-placeholder"),
      new Style(utility.class, [
        new Property("--tw-placeholder-opacity", "1"),
        new Property("color", `rgba(${rgb}, var(--tw-placeholder-opacity))`),
      ]).pseudoClass("-ms-input-placeholder"),
      new Style(utility.class, [
        new Property("--tw-placeholder-opacity", "1"),
        new Property("color", `rgba(${rgb}, var(--tw-placeholder-opacity))`),
      ]).pseudoElement("-ms-input-placeholder"),
      new Style(utility.class, [
        new Property("--tw-placeholder-opacity", "1"),
        new Property("color", `rgba(${rgb}, var(--tw-placeholder-opacity))`),
      ]).pseudoElement("placeholder"),
    ];
  }
}

// https://tailwindcss.com/docs/background-color
// https://tailwindcss.com/docs/background-opacity
// https://tailwindcss.com/docs/background-position
// https://tailwindcss.com/docs/background-size
// https://tailwindcss.com/docs/background-image
function background(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  // handle background positions
  const positions = toType(theme("backgroundPosition"), "object") as {
    [key: string]: string;
  };
  if (Object.keys(positions).includes(body)) {
    return new Property("background-position", positions[body]);
  }
  // handle background sizes
  const sizes = toType(theme("backgroundSize"), "object") as {
    [key: string]: string;
  };
  if (Object.keys(sizes).includes(body)) {
    return new Property("background-size", sizes[body]);
  }
  // handle background image
  const images = toType(theme("backgroundImage"), "object") as {
    [key: string]: string;
  };
  if (Object.keys(images).includes(body)) {
    const prefixer = linearGradient(images[body]);
    if (Array.isArray(prefixer)) {
      return new Style(
        utility.class,
        prefixer.map((i) => new Property("background-image", i))
      );
    }
    return new Property("background-image", prefixer);
  }
  // handle background opacity
  if (utility.raw.startsWith("bg-opacity"))
    return utility.handler
      .handleStatic(theme("backgroundOpacity"))
      .handleNumber(0, 100, "int", (number: number) =>
        (number / 100).toString()
      )
      .handleVariable()
      .createProperty("--tw-bg-opacity");
  // handle background color
  const value = utility.handler
    .handleColor(theme("backgroundColor"))
    .handleVariable().value;
  if (value) {
    if (["transparent", "currentColor"].includes(value))
      return new Property("background-color", value);
    return new Style(utility.class, [
      new Property("--tw-bg-opacity", "1"),
      new Property(
        "background-color",
        `rgba(${
          value.startsWith("var") ? value : hex2RGB(value)?.join(", ")
        }, var(--tw-bg-opacity))`
      ),
    ]);
  }
}

// https://tailwindcss.com/docs/gradient-color-stops from
function gradientColorFrom(utility: Utility, { theme }: PluginUtils): Output {
  const value = utility.handler
    .handleColor(theme("gradientColorStops"))
    .handleVariable().value;
  if (value) {
    let rgb;
    switch (value) {
      case "transparent":
        rgb = "0, 0, 0";
        break;
      case "current":
        rgb = "255, 255, 255";
        break;
      default:
        rgb = value.startsWith("var") ? value : hex2RGB(value)?.join(", ");
    }
    return new Style(utility.class, [
      new Property("--tw-gradient-from", value),
      new Property(
        "--tw-gradient-stops",
        `var(--tw-gradient-from), var(--tw-gradient-to, rgba(${rgb}, 0))`
      ),
    ]);
  }
}

// https://tailwindcss.com/docs/gradient-color-stops via
function gradientColorVia(utility: Utility, { theme }: PluginUtils): Output {
  let value = utility.handler
    .handleColor(theme("gradientColorStops"))
    .handleVariable().value;
  if (value) {
    let rgb;
    switch (value) {
      case "transparent":
        rgb = "0, 0, 0";
        break;
      case "current":
        rgb = "255, 255, 255";
        break;
      default:
        if (value.startsWith("var")) {
          rgb = value;
          value = `rgb(${value})`;
        } else {
          rgb = hex2RGB(value)?.join(", ");
        }
    }
    return new Property(
      "--tw-gradient-stops",
      `var(--tw-gradient-from), ${value}, var(--tw-gradient-to, rgba(${rgb}, 0))`
    );
  }
}

// https://tailwindcss.com/docs/gradient-color-stops to
function gradientColorTo(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleColor(theme("gradientColorStops"))
    .handleVariable()
    .createProperty("--tw-gradient-to");
}

// https://tailwindcss.com/docs/border-radius
function borderRadius(utility: Utility, { theme }: PluginUtils): Output {
  const raw = [
    "rounded",
    "rounded-t",
    "rounded-l",
    "rounded-r",
    "rounded-b",
    "rounded-tl",
    "rounded-tr",
    "rounded-br",
    "rounded-bl",
  ].includes(utility.raw)
    ? utility.raw + "-DEFAULT"
    : utility.raw;
  utility = new Utility(raw);
  const directions = expandDirection(
    utility.center.replace(/-?\$[\w-]+/, ""),
    true
  );
  if (!directions) return;
  return utility.handler
    .handleStatic(theme("borderRadius"))
    .handleNxl((number: number) => `${number * 0.5}rem`)
    .handleSize()
    .handleVariable()
    .createProperty(
      directions[0] === "*"
        ? "border-radius"
        : directions.map((i) => `border-${i}-radius`)
    );
}

// https://tailwindcss.com/docs/border-width
// https://tailwindcss.com/docs/border-color
// https://tailwindcss.com/docs/border-opacity
function border(utility: Utility, { theme }: PluginUtils): Output {
  // handle border opacity
  if (utility.raw.startsWith("border-opacity"))
    return utility.handler
      .handleStatic(theme("borderOpacity"))
      .handleNumber(0, 100, "int", (number: number) =>
        (number / 100).toString()
      )
      .handleVariable()
      .createProperty("--tw-border-opacity");

  // handle border color
  const value = utility.handler
    .handleColor(theme("borderColor"))
    .handleVariable((variable: string) =>
      utility.raw.startsWith("border-$") ? `var(--${variable})` : undefined
    ).value;
  if (value) {
    if (["transparent", "currentColor"].includes(value))
      return new Property("border-color", value);
    return new Style(utility.class, [
      new Property("--tw-border-opacity", "1"),
      new Property(
        "border-color",
        `rgba(${
          value.startsWith("var") ? value : hex2RGB(value)?.join(", ")
        }, var(--tw-border-opacity))`
      ),
    ]);
  }
  // handle border width
  const directions = expandDirection(utility.raw.substring(7, 8), false) ?? [
    "*",
  ];
  const borders = (toType(theme("borderWidth"), "object") ?? {}) as {
    [key: string]: string;
  };
  const raw = [
    "border",
    "border-t",
    "border-r",
    "border-b",
    "border-l",
  ].includes(utility.raw)
    ? `${utility.raw}-${borders.DEFAULT ?? "1px"}`
    : utility.raw;
  return new Utility(raw).handler
    .handleStatic(borders)
    .handleNumber(0, undefined, "int", (number: number) => `${number}px`)
    .handleSize()
    .handleVariable()
    .createProperty(
      directions[0] === "*"
        ? "border-width"
        : directions.map((i) => `border-${i}-width`)
    );
}

// https://tailwindcss.com/docs/divide-width
// https://tailwindcss.com/docs/divide-color
// https://tailwindcss.com/docs/divide-opacity
// https://tailwindcss.com/docs/divide-style
function divide(utility: Utility, { theme }: PluginUtils): Output {
  // handle divide style
  if (["solid", "dashed", "dotted", "double", "none"].includes(utility.amount))
    return new Property("border-style", utility.amount)
      .toStyle(utility.class)
      .child("> :not([hidden]) ~ :not([hidden])");
  // handle divide opacity
  if (utility.raw.startsWith("divide-opacity"))
    return utility.handler
      .handleStatic(theme("divideOpacity"))
      .handleNumber(0, 100, "int", (number: number) =>
        (number / 100).toString()
      )
      .handleVariable()
      .createProperty("--tw-divide-opacity");
  // handle divide color
  let value = utility.handler
    .handleColor(theme("divideColor"))
    .handleVariable((variable: string) =>
      utility.raw.startsWith("divide-$") ? `var(--${variable})` : undefined
    ).value;
  if (value) {
    if (["transparent", "currentColor"].includes(value))
      return new Property("border-color", value);
    return new Style(utility.class, [
      new Property("--tw-divide-opacity", "1"),
      new Property(
        "border-color",
        `rgba(${
          value.startsWith("var") ? value : hex2RGB(value)?.join(", ")
        }, var(--tw-divide-opacity))`
      ),
    ]).child("> :not([hidden]) ~ :not([hidden])");
  }
  // handle divide width
  switch (utility.raw) {
    case "divide-x-reverse":
      return new Style(
        utility.class,
        new Property("--tw-divide-x-reverse", "1")
      ).child("> :not([hidden]) ~ :not([hidden])");
    case "divide-y-reverse":
      return new Style(
        utility.class,
        new Property("--tw-divide-y-reverse", "1")
      ).child("> :not([hidden]) ~ :not([hidden])");
    case "divide-y":
      return new Style(utility.class, [
        new Property("--tw-divide-y-reverse", "0"),
        new Property(
          "border-top-width",
          "calc(1px * calc(1 - var(--tw-divide-y-reverse)))"
        ),
        new Property(
          "border-bottom-width",
          "calc(1px * var(--tw-divide-y-reverse))"
        ),
      ]).child("> :not([hidden]) ~ :not([hidden])");
    case "divide-x":
      return new Style(utility.class, [
        new Property("--tw-divide-x-reverse", "0"),
        new Property(
          "border-right-width",
          "calc(1px * var(--tw-divide-x-reverse))"
        ),
        new Property(
          "border-left-width",
          "calc(1px * calc(1 - var(--tw-divide-x-reverse)))"
        ),
      ]).child("> :not([hidden]) ~ :not([hidden])");
  }
  value = utility.handler
    .handleNumber(0, undefined, "float", (number: number) => `${number}px`)
    .handleSize()
    .handleVariable().value;
  if (value) {
    const centerMatch = utility.raw.match(/^-?divide-[x|y]/);
    if (centerMatch) {
      const center = centerMatch[0].replace(/^-?divide-/, "");
      switch (center) {
        case "x":
          return new Style(utility.class, [
            new Property("--tw-divide-x-reverse", "0"),
            new Property(
              "border-right-width",
              `calc(${value} * var(--tw-divide-x-reverse))`
            ),
            new Property(
              "border-left-width",
              `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`
            ),
          ]).child("> :not([hidden]) ~ :not([hidden])");
        case "y":
          return new Style(utility.class, [
            new Property("--tw-divide-y-reverse", "0"),
            new Property(
              "border-top-width",
              `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`
            ),
            new Property(
              "border-bottom-width",
              `calc(${value} * var(--tw-divide-y-reverse))`
            ),
          ]).child("> :not([hidden]) ~ :not([hidden])");
      }
    }
  }
}

// https://tailwindcss.com/docs/ring-offset-width
// https://tailwindcss.com/docs/ring-offset-color
function ringOffset(utility: Utility, { theme }: PluginUtils): Output {
  let value;
  // handle ring offset width variable
  if (utility.raw.startsWith("ring-offset-width-$")) {
    value = utility.handler.handleVariable().value;
    if (value)
      return new Style(utility.class.replace("ringOffset", "ring-offset"), [
        new Property("--tw-ring-offset-width", value),
        new Property(
          ["-webkit-box-shadow", "box-shadow"],
          "0 0 0 var(--ring-offset-width) var(--ring-offset-color), var(--ring-shadow)"
        ),
      ]);
  }

  // handle ring offset width
  if (utility.center === "") {
    value = utility.handler
      .handleStatic(theme("ringOffsetWidth"))
      .handleNumber(0, undefined, "float", (number: number) => `${number}px`)
      .handleSize().value;
    if (value)
      return new Style(utility.class.replace("ringOffset", "ring-offset"), [
        new Property("--tw-ring-offset-width", value),
        new Property(
          ["-webkit-box-shadow", "box-shadow"],
          "0 0 0 var(--ring-offset-width) var(--ring-offset-color), var(--ring-shadow)"
        ),
      ]);
  }

  // handle ring offset color
  value = utility.handler.handleColor(theme("ringOffsetColor")).handleVariable()
    .value;
  if (value)
    return new Style(utility.class.replace("ringOffset", "ring-offset"), [
      new Property("--tw-ring-offset-color", value),
      new Property(
        ["-webkit-box-shadow", "box-shadow"],
        "0 0 0 var(--ring-offset-width) var(--ring-offset-color), var(--ring-shadow)"
      ),
    ]);
}

// https://tailwindcss.com/docs/ring-width
// https://tailwindcss.com/docs/ring-color
// https://tailwindcss.com/docs/ring-opacity
function ring(utility: Utility, utils: PluginUtils): Output {
  // handle ring offset
  if (utility.raw.startsWith("ring-offset"))
    return ringOffset(
      new Utility(utility.raw.replace("ring-offset", "ringOffset")), utils);
  // handle ring opacity
  if (utility.raw.startsWith("ring-opacity"))
    return utility.handler
      .handleStatic(utils.theme("ringOpacity"))
      .handleNumber(0, 100, "int", (number: number) =>
        (number / 100).toString()
      )
      .handleVariable()
      .createProperty("--tw-ring-opacity");
  // handle ring color
  let value = utility.handler
    .handleColor(utils.theme("ringColor"))
    .handleVariable((variable: string) =>
      utility.raw.startsWith("ring-$") ? `var(--${variable})` : undefined
    ).value;
  if (value) {
    if (["transparent", "currentColor"].includes(value))
      return new Property("--tw-ring-color", value);
    return new Property(
      "--tw-ring-color",
      `rgba(${hex2RGB(value)?.join(", ")}, var(--tw-ring-opacity))`
    );
  }
  // handle ring width
  if (utility.raw === "ring-inset")
    return new Property("--tw-ring-inset", "inset");
  if (utility.raw === "ring")
    value = toType(utils.theme("ringWidth.DEFAULT"), "string") ?? "3px";
  value = utility.handler
    .handleStatic(utils.theme("ringWidth"))
    .handleNumber(0, undefined, "float", (number: number) => `${number}px`)
    .handleSize()
    .handleVariable().value;
  if (value)
    return new Property(
      ["-webkit-box-shadow", "box-shadow"],
      `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`
    );
}

// https://tailwindcss.com/docs/box-shadow/
function boxShadow(utility: Utility, { theme }: PluginUtils): Output {
  let body = utility.body;
  if (body === "") body = "DEFAULT";
  const shadows = toType(theme("boxShadow"), "object") as {
    [key: string]: string;
  };
  if (Object.keys(shadows).includes(body)) {
    return new Style(utility.class, [
      new Property("--tw-shadow", shadows[body]),
      new Property(
        ["-webkit-box-shadow", "box-shadow"],
        "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)"
      ),
    ]);
  }
}

// https://tailwindcss.com/docs/opacity
function opacity(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme("opacity"))
    .handleNumber(0, 100, "int", (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty("opacity");
}

// https://tailwindcss.com/docs/transition-property
function transition(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  const props = (toType(theme("transitionProperty"), "object") ?? {}) as {
    [key: string]: string;
  };
  for (const [key, value] of Object.entries(props)) {
    if (body === key || (body === "" && key === "DEFAULT")) {
      if (value === "none")
        return new Property(
          [
            "-webkit-transition-property",
            "-o-transition-property",
            "transition-property",
          ],
          "none"
        );
      return new Style(utility.class, [
        new Property(
          "-webkit-transition-property",
          value.replace(/(?=(transform|box-shadow))/g, "-webkit-")
        ),
        new Property("-o-transition-property", value),
        new Property(
          "transition-property",
          value
            .replace(/transform/g, "transform, -webkit-transform")
            .replace(/box-shadow/g, "box-shadow, -webkit-box-shadow")
        ),
        new Property(
          [
            "-webkit-transition-timing-function",
            "-o-transition-timing-function",
            "transition-timing-function",
          ],
          toType(theme("transitionTimingFunction.DEFAULT"), "string") ??
            "cubic-bezier(0.4, 0, 0.2, 1)"
        ),
        new Property(
          [
            "-webkit-transition-duration",
            "-o-transition-duration",
            "transition-duration",
          ],
          toType(theme("transitionDuration.DEFAULT"), "string") ?? "150ms"
        ),
      ]);
    }
  }
}

// https://tailwindcss.com/docs/transition-duration
function duration(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme("transitionDuration"))
    .handleNumber(0, undefined, "int", (number: number) => `${number}ms`)
    .handleVariable()
    .createProperty([
      "-webkit-transition-duration",
      "-o-transition-duration",
      "transition-duration",
    ]);
}

// https://tailwindcss.com/docs/transition-timing-function
function transitionTimingFunction(
  utility: Utility,
  { theme }: PluginUtils
): Output {
  return utility.handler
    .handleBody(theme("transitionTimingFunction"))
    .createProperty([
      "-webkit-transition-timing-function",
      "-o-transition-timing-function",
      "transition-timing-function",
    ]);
}

// https://tailwindcss.com/docs/transition-delay
function delay(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme("transitionDelay"))
    .handleNumber(0, undefined, "int", (number: number) => `${number}ms`)
    .handleVariable()
    .createProperty([
      "-webkit-transition-delay",
      "-o-transition-delay",
      "transition-delay",
    ]);
}

// https://tailwindcss.com/docs/animation
function animation(utility: Utility, { theme }: PluginUtils): Output {
  const animations = (toType(theme("animation"), "object") ?? {}) as {
    [key: string]: string;
  };
  const amount = utility.amount;
  if (Object.keys(animations).includes(amount)) {
    const value = animations[amount];
    if (value === "none")
      return new Property(["-webkit-animation", "animation"], "none");
    return [
      new Style(
        utility.class,
        new Property(["-webkit-animation", "animation"], value)
      ),
      ...generateKeyframe(
        amount,
        (toType(theme(`keyframes.${amount}`), "object") ?? {}) as {
          [key: string]: { [key: string]: string };
        }
      ),
    ];
  }
}

// https://tailwindcss.com/docs/transform-origin
function transformOrigin(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  const origins = (toType(theme("transformOrigin"), "object") ?? {}) as {
    [key: string]: string;
  };
  if (Object.keys(origins).includes(body)) {
    return new Property(
      ["-webkit-transform-origin", "-ms-transform-origin", "transform-origin"],
      origins[body]
    );
  }
}

// https://tailwindcss.com/docs/scale
function scale(utility: Utility, { theme }: PluginUtils): Output {
  const value = utility.handler
    .handleStatic(theme("scale"))
    .handleNumber(0, undefined, "int", (number: number) =>
      (number / 100).toString()
    )
    .handleVariable()
    .value;
  if (!value) return;
  if (utility.raw.startsWith('scale-x')) return new Property("--tw-scale-x", value);
  if (utility.raw.startsWith('scale-y')) return new Property("--tw-scale-y", value);
  return new Property(["--tw-scale-x", "--tw-scale-y"], value);
}

// https://tailwindcss.com/docs/rotate
function rotate(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme("rotate"))
    .handleNumber(0, undefined, "float", (number: number) => `${number}deg`)
    .handleNegative()
    .handleVariable()
    .createProperty("--tw-rotate");
}

// https://tailwindcss.com/docs/translate
function translate(utility: Utility, { theme }: PluginUtils): Output {
  const centerMatch = utility.raw.match(/^-?translate-[x|y]/);
  if (centerMatch) {
    const center = centerMatch[0].replace(/^-?translate-/, "");
    return utility.handler
      .handleStatic(theme("translate"))
      .handleSpacing()
      .handleFraction()
      .handleSize()
      .handleNegative()
      .handleVariable()
      .createProperty(`--tw-translate-${center}`);
  }
}

// https://tailwindcss.com/docs/skew
function skew(utility: Utility, { theme }: PluginUtils): Output {
  const centerMatch = utility.raw.match(/^-?skew-[x|y]/);
  if (centerMatch) {
    const center = centerMatch[0].replace(/^-?skew-/, "");
    return utility.handler
      .handleStatic(theme("skew"))
      .handleNumber(0, undefined, "float", (number: number) => `${number}deg`)
      .handleNegative()
      .handleVariable()
      .createProperty(`--tw-skew-${center}`);
  }
}

// https://tailwindcss.com/docs/cursor
function cursor(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  const cursors = (toType(theme("cursor"), "object") ?? {}) as {
    [key: string]: string;
  };
  if (Object.keys(cursors).includes(body))
    return new Property("cursor", cursors[body]);
}

// https://tailwindcss.com/docs/outline
function outline(utility: Utility, { theme }: PluginUtils): Output {
  const amount = utility.amount;
  const staticMap = (toType(theme("outline"), "object") ?? {}) as {
    [key: string]: [outline: string, outlineOffset: string];
  };
  if (Object.keys(staticMap).includes(amount))
    return new Style(utility.class, [
      new Property("outline", staticMap[amount][0]),
      new Property("outline-offset", staticMap[amount][1]),
    ]);

  let value = utility.handler
    .handleColor()
    .handleVariable((variable: string) =>
      utility.raw.startsWith("outline-$") ? `var(--${variable})` : undefined
    ).value;
  if (value)
    return new Style(utility.class, [
      new Property(
        "outline",
        `2px ${value === "transparent" ? "solid" : "dotted"} ${value}`
      ),
      new Property("outline-offset", "2px"),
    ]);
  if (utility.raw.match(/^outline-(solid|dotted)/)) {
    const newUtility = new Utility(utility.raw.replace("outline-", ""));
    value = newUtility.handler
      .handleStatic({ none: "transparent", white: "white", black: "black" })
      .handleColor()
      .handleVariable().value;
    if (value)
      return new Style(utility.class, [
        new Property("outline", `2px ${newUtility.identifier} ${value}`),
        new Property("outline-offset", "2px"),
      ]);
  }
}

// https://tailwindcss.com/docs/fill
function fill(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleColor(theme("fill"))
    .handleVariable()
    .createProperty("fill");
}

// https://tailwindcss.com/docs/stroke
// https://tailwindcss.com/docs/stroke-width
function stroke(utility: Utility, { theme }: PluginUtils): Output {
  const value = utility.raw.startsWith("stroke-$")
    ? utility.handler.handleVariable().createProperty("stroke-width")
    : utility.handler
        .handleStatic(theme("strokeWidth"))
        .handleNumber(0, undefined, "int")
        .createProperty("stroke-width");
  return (
    value ??
    utility.handler
      .handleColor(theme("stroke"))
      .handleVariable()
      .createProperty("stroke")
  );
}

export default {
  container: container,
  object: objectPosition,
  inset: inset,
  top: inset,
  right: inset,
  bottom: inset,
  left: inset,
  z: zIndex,
  flex: flex,
  order: order,
  grid: gridTemplate,
  col: gridColumn,
  row: gridRow,
  auto: gridAuto,
  gap: gap,
  p: padding,
  py: padding,
  px: padding,
  pt: padding,
  pr: padding,
  pb: padding,
  pl: padding,
  m: margin,
  my: margin,
  mx: margin,
  mt: margin,
  mr: margin,
  mb: margin,
  ml: margin,
  space: space,
  w: size,
  h: size,
  min: minMaxSize,
  max: minMaxSize,
  text: text,
  font: font,
  tracking: letterSpacing,
  leading: lineHeight,
  list: listStyleType,
  placeholder: placeholder,
  bg: background,
  from: gradientColorFrom,
  via: gradientColorVia,
  to: gradientColorTo,
  rounded: borderRadius,
  border: border,
  divide: divide,
  ring: ring,
  shadow: boxShadow,
  opacity: opacity,
  transition: transition,
  duration: duration,
  ease: transitionTimingFunction,
  delay: delay,
  animate: animation,
  origin: transformOrigin,
  scale: scale,
  rotate: rotate,
  translate: translate,
  skew: skew,
  cursor: cursor,
  outline: outline,
  fill: fill,
  stroke: stroke,
} as { [key: string]: (utility: Utility, { theme }: PluginUtils) => Output };
