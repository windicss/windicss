import Processor from "../../src";
import plugin from "../../src/plugin";
import type { PluginUtils, PluginFunction } from "../../src/interfaces";

describe("plugin interface test", () => {
  it("import", () => {
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".skew-10deg": {
          transform: "skewY(-10deg)",
        },
        ".skew-15deg": {
          transform: "skewY(-15deg)",
        },
      };

      addUtilities(newUtilities);
    });
  });

  it("require", () => {
    const plugin = require("../../dist/plugin");
    plugin(function ({ addUtilities }: PluginUtils) {
      const newUtilities = {
        ".skew-10deg": {
          transform: "skewY(-10deg)",
        },
        ".skew-15deg": {
          transform: "skewY(-15deg)",
        },
      };

      addUtilities(newUtilities);
    });
    expect(plugin.withOptions).toBeDefined();
  });

  it("addComponents order", () => {
    const plugin: PluginFunction = (utils) => {
      utils.addComponents({
        "[data-theme=dark]": {
          "-P": "259 94% 61%",
        },
        "@media (prefers-color-scheme:dark)": {
          ":root": {
            "-P": "259 94% 61%",
          },
        },
        "[data-theme=light]": {
          "-P": "259 94% 51%",
        },
      });
    };
    const processor = new Processor({
      plugins: [plugin],
    });

    expect(processor.preflight(' ', false, false, true).build()).toMatchSnapshot('css')
  });
});
