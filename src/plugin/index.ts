import type {
  PluginBuilder,
  PluginUtils,
  Config,
  DictStr,
  PluginWithOptions,
} from '../interfaces';

const createPlugin: PluginBuilder = (
  plugin: (utils: PluginUtils) => void,
  config?: Config
) => {
  return {
    handler: plugin,
    config,
  };
};

createPlugin.withOptions = function<T = DictStr>(
  pluginFunction: (options: T) => (utils: PluginUtils) => void,
  configFunction: (options: T) => Config = () => ({}),
): PluginWithOptions<T> {
  const optionsFunction = function (options= {} as T) {
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
