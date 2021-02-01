import plugin from "../index";
import type { PluginUtilOptions } from "../../interfaces";

module.exports = plugin(
  function ({ addDynamic, theme, variants }) {
    addDynamic("filter", ({ Utility }) => {
      return Utility.handler
        .handleStatic(theme("filter"))
        .createProperty(["-webkit-filter", "filter"]);
      }, variants('filter') as PluginUtilOptions);

    addDynamic("backdrop-filter", ({ Utility }) => {
      return Utility.handler
        .handleStatic(theme("backdrop-filter"))
        .createProperty(["-webkit-backdrop-filter", "backdrop-filter"]);
      }, variants('backdrop-filter') as PluginUtilOptions);

    addDynamic("blur", ({ Utility }) => {
      return Utility.handler
        .handleStatic(theme("blur"))
        .handleNumber(0, undefined, "float")
        .handleSize()
        .createProperty(
          ["-webkit-backdrop-filter", "backdrop-filter"],
          (value: string) => `${value}px`
        );
      }, variants('blur') as PluginUtilOptions);
  },
  {
    theme: {
      filter: {
        none: "none",
        grayscale: "grayscale(1)",
        invert: "invert(1)",
        sepia: "sepia(1)",
      },
      backdropFilter: {
        none: "none",
        blur: "blur(20px)",
      },
      blur: {
        none: "none",
      }
    },
    variants: {
      filter: ["responsive"],
      backdropFilter: ["responsive"],
    },
  }
);
