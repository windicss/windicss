import { DeepNestObject } from "../../interfaces";
import plugin from "../index";
import styles from "./styles";
import { uniq, castArray, isUsableColor } from "./utils";
import merge from "lodash.merge";

const computed:{[key:string]:(color:string)=>({[key:string]:unknown})} = {
  // Reserved for future "magic properties", for example:
  // bulletColor: (color) => ({ 'ul > li::before': { backgroundColor: color } }),
}

function configToCss(config: {[key:string]:string} = {}): DeepNestObject {
  return merge(
    {},
    ...Object.keys(config)
      .filter((key) => computed[key])
      .map((key) => computed[key](config[key])),
    ...castArray(config.css || {})
  )
}

export default plugin.withOptions(
  ({ modifiers, className = 'prose' }: { modifiers?: string[], className?:string} = {}) => {
    return function ({ addComponents, theme, variants }) {
      const DEFAULT_MODIFIERS = [
        'DEFAULT',
        'sm',
        'lg',
        'xl',
        '2xl',
        ...Object.entries(theme('colors') as {[key:string]:string|{[key:string]:string}})
          .filter(([color, values]) => {
            return isUsableColor(color, values)
          })
          .map(([color]) => color),
      ]
      modifiers = modifiers === undefined ? DEFAULT_MODIFIERS : modifiers
      const config = theme('typography') as {[key:string]:{[key:string]:string}}

      const all: string[] = uniq([
        'DEFAULT',
        ...modifiers,
        ...Object.keys(config).filter((modifier) => !DEFAULT_MODIFIERS.includes(modifier)),
      ])

      addComponents(
        all.map((modifier) => ({
          [modifier === 'DEFAULT' ? `.${className}` : `.${className}-${modifier}`]: configToCss(
            config[modifier]
          ),
        })),
        variants('typography')
      )
    }
  },
  () => ({
    theme: { typography: styles },
    variants: { typography: ['responsive'] },
  })
)
