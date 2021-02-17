import type {
  Plugin,
  PluginUtils,
  DictStr,
} from "../interfaces";
import type { BaseConfig } from '../config'

const createPlugin: Plugin = (
  plugin: (utils: PluginUtils) => void,
  config?: BaseConfig
) => {
  return {
    handler: plugin,
    config,
  };
};

createPlugin.withOptions = function (
  pluginFunction: (options: DictStr) => (utils: PluginUtils) => void,
  configFunction: (options: DictStr) => BaseConfig = () => ({}),
) {
  const optionsFunction = function (options: DictStr) {
    return {
      __options: options,
      handler: pluginFunction(options),
      config: configFunction(options),
    };
  };

  optionsFunction.__isOptionsFunction = true as const;

  // Expose plugin dependencies so that `object-hash` returns a different
  // value if anything here changes, to ensure a rebuild is triggered.
  optionsFunction.__pluginFunction = pluginFunction;
  optionsFunction.__configFunction = configFunction;

  return optionsFunction;
};

export default createPlugin;
