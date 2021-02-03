import forms from "../../src/plugin/forms";
import { Processor } from "../../src/lib";
import { StyleSheet } from "../../src/utils/style";
import { writeFileSync } from "fs";

describe("forms plugin", () => {
  it("preflight", () => {
    const processor = new Processor();
    const styleSheet = new StyleSheet();
    processor.loadPlugin(forms);
    Object.values(processor._plugin.preflights).forEach(styles => {
      styleSheet.add(styles);
    });
    writeFileSync('forms.css', styleSheet.build());
  })
})
