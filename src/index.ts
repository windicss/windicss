import { Config } from './interfaces';

export { Processor as default } from './lib';

export function defineConfig(config: Config): Config {
  return config;
}
