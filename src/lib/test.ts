import { Utility } from './utilities/handler';
import { staticUtilities, dynamicUtilities } from './utilities';
import type { Processor } from './index';

export function testStatic(processor: Processor, className:string): boolean {
  // eslint-disable-next-line no-prototype-builtins
  if (!staticUtilities.hasOwnProperty(className)) return false;
  const { meta } = staticUtilities[className];
  if (processor._plugin.core && !processor._plugin.core[meta.group]) return false;
  return true;
}

export default function test(
  processor: Processor,
  className: string,
  prefix?: string,
): boolean {

  // handle static base utilities
  if (!prefix && className in staticUtilities) return testStatic(processor, className);
  if (prefix && className.startsWith(prefix)) {
    className = className.replace(new RegExp(`^${prefix}`), '');
    if (className in staticUtilities) return testStatic(processor, className);
  }
  // handle static plugin utilities & components
  const staticPlugins = { ...processor._plugin.utilities, ...processor._plugin.components, ...processor._plugin.shortcuts };
  if (className in staticPlugins) return true;

  const utility = new Utility(className, processor._handler);


  // handle dynamic plugin utilities
  for (const [key, generator] of Object.entries(processor._plugin.dynamic)) {
    if (className.match(new RegExp(`^-?${key}`))) {
      if (generator(utility)) return true;
    }
  }

  // handle dynamic base utilities
  const matches = className.match(/\w+/);
  const key = matches ? matches[0] : undefined;
  // eslint-disable-next-line no-prototype-builtins
  if (key && dynamicUtilities.hasOwnProperty(key)) {
    const style = dynamicUtilities[key](utility, processor.pluginUtils);
    if (!style) return false;
    if (processor._plugin.core && !processor._plugin.core[Array.isArray(style) ? style[0].meta.group : style.meta.group]) return false;
    return true;
  }
  return false;
}
