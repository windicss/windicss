import type { UnoGenerator } from "@unocss/core";
import { createGenerator, Preset } from "@unocss/core";
import { rules } from "./rules";
import type { Theme } from './theme';
import { theme } from './theme';

const preset = (options: {}): Preset<Theme> => ({
  name: 'windicss',
  theme,
  rules,
  options
})

export class Processor {
  UNO: UnoGenerator;
  CSSPARSER: any;

  constructor() {
    this.UNO = createGenerator({}, {
      presets: [preset({})],
    });
  }

  public interpret(classNames: string) {
    
    // takes classNames and uses UNO to generates CSS
    const generatedCSS = this.UNO.generate(classNames);

    // uses windi CSSParser to parse the generated CSS into windi StyleSheet
    const parsedCSS = this.CSSPARSER.parse(generatedCSS);

    // returns windi StyleSheet
    //return parsedCSS;
    return undefined
  }
}

export default Processor