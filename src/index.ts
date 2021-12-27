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

  constructor() {
    this.UNO = createGenerator({}, {
      presets: [preset({})],
    });
  }

  public interpret(classNames: string) {
    return this.UNO.generate(classNames, {})
  }
}

export default Processor