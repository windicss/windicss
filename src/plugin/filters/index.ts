import plugin from "../index";
import type { PluginUtilOptions } from "../../interfaces";

export default plugin(
  function ({ addDynamic, theme, variants }) {
    addDynamic("filter", ({ Utility }) => {
      return Utility.handler
        .handleStatic(theme("filter"))
        .createProperty(["-webkit-filter", "filter"]);
      }, variants('filter') as PluginUtilOptions);

    addDynamic("backdrop", ({ Utility }) => {
      return Utility.handler
        .handleStatic(theme("backdropFilter"))
        .createProperty(["-webkit-backdrop-filter", "backdrop-filter"]);
      }, variants('backdropFilter') as PluginUtilOptions);

    addDynamic("blur", ({ Utility }) => {
      return Utility.handler
        .handleStatic(theme("blur"))
        .handleNumber(0, undefined, "float", (number)=>`${number}px`)
        .handleSize()
        .createProperty(
          ["-webkit-backdrop-filter", "backdrop-filter"],
          (value: string) => value
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
