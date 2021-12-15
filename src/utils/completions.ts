import type { Processor } from '../lib';
import { flatColors } from './tools';
const utilities: { [key:string]: string[]} = {
  // Layout
  columns: [
    'columns-${static}',
    'columns-${float}',
    'columns-${size}',
    'columns-${int}xl',
  ],
  container: [
    'container',
  ],
  objectPosition: [
    'object-${static}',
  ],
  inset: [
    'inset-${static}',
    'inset-${float}',
    'inset-${fraction}',
    'inset-${size}',

    'inset-y-${static}',
    'inset-y-${float}',
    'inset-y-${fraction}',
    'inset-y-${size}',

    'inset-x-${static}',
    'inset-x-${float}',
    'inset-x-${fraction}',
    'inset-x-${size}',

    'top-${static}',
    'top-${float}',
    'top-${fraction}',
    'top-${size}',

    'right-${static}',
    'right-${float}',
    'right-${fraction}',
    'right-${size}',

    'bottom-${static}',
    'bottom-${float}',
    'bottom-${fraction}',
    'bottom-${size}',

    'left-${static}',
    'left-${float}',
    'left-${fraction}',
    'left-${size}',
  ],
  zIndex: [
    'z-${static}',
    'z-${int}',
  ],
  // Flexbox
  flex: [
    'flex-${static}',
  ],
  flexGrow: [
    'flex-grow-${static}',
  ],
  flexShrink: [
    'flex-shrink-${static}',
  ],
  order: [
    'order-${static}',
    'order-${int}',
  ],
  // Grid
  gridTemplateColumns: [
    'grid-cols-${static}',
    'grid-cols-${int}',
  ],
  gridTemplateRows: [
    'grid-rows-${static}',
    'grid-rows-${int}',
  ],
  gridColumn: [
    'col-${static}',
    'col-span-${int}',
  ],
  gridColumnEnd: [
    'col-end-${static}',
    'col-end-${int}',
  ],
  gridColumnStart: [
    'col-start-${static}',
    'col-start-${int}',
  ],
  gridRow: [
    'row-${static}',
    'row-span-${int}',
  ],
  gridRowEnd: [
    'row-end-${static}',
    'row-end-${int}',
  ],
  gridRowStart: [
    'row-start-${static}',
    'row-start-${int}',
  ],
  gap: [
    'gap-${static}',
    'gap-x-${static}',
    'gap-y-${static}',

    'gap-${float}',
    'gap-x-${float}',
    'gap-y-${float}',

    'gap-${size}',
    'gap-x-${size}',
    'gap-y-${size}',
  ],
  // Box Alignment
  // Spacing
  padding: [
    'p-${static}',
    'py-${static}',
    'px-${static}',
    'pt-${static}',
    'pr-${static}',
    'pb-${static}',
    'pl-${static}',

    'p-${float}',
    'py-${float}',
    'px-${float}',
    'pt-${float}',
    'pr-${float}',
    'pb-${float}',
    'pl-${float}',

    'p-${size}',
    'py-${size}',
    'px-${size}',
    'pt-${size}',
    'pr-${size}',
    'pb-${size}',
    'pl-${size}',
  ],
  margin: [
    'm-${static}',
    'my-${static}',
    'mx-${static}',
    'mt-${static}',
    'mr-${static}',
    'mb-${static}',
    'ml-${static}',

    'm-${float}',
    'my-${float}',
    'mx-${float}',
    'mt-${float}',
    'mr-${float}',
    'mb-${float}',
    'ml-${float}',

    'm-${size}',
    'my-${size}',
    'mx-${size}',
    'mt-${size}',
    'mr-${size}',
    'mb-${size}',
    'ml-${size}',
  ],
  space: [
    'space-y-${static}',
    'space-y-reverse',
    'space-x-${static}',
    'space-x-reverse',
    'space-y-${float}',
    'space-x-${float}',
  ],
  width: [
    'w-${static}',
    'w-${float}',
    'w-${fraction}',
    'w-${int}xl',
    'w-${size}',
  ],
  minWidth: [
    'min-w-${static}',
    'min-w-${float}',
    'min-w-${fraction}',
    'min-w-${int}xl',
    'min-w-${size}',
  ],
  maxWidth: [
    'max-w-${static}',
    'max-w-${float}',
    'max-w-${fraction}',
    'max-w-${int}xl',
    'max-w-${size}',
  ],
  height: [
    'h-${static}',
    'h-${float}',
    'h-${fraction}',
    'h-${int}xl',
    'h-${size}',
  ],
  minHeight: [
    'min-h-${static}',
    'min-h-${float}',
    'min-h-${fraction}',
    'min-h-${int}xl',
    'min-h-${size}',
  ],
  maxHeight: [
    'max-h-${static}',
    'max-h-${float}',
    'max-h-${fraction}',
    'max-h-${int}xl',
    'max-h-${size}',
  ],
  // Typography
  fontSize: [
    'text-${static}',
    'text-${int}xl',
  ],
  textOpacity: [
    'text-opacity-${static}',
    'text-opacity-${int<=100}',
  ],
  textColor: [
    'text-${color}',
  ],
  fontFamily: [
    'font-${static}',
  ],
  fontWeight: [
    'font-${static}',
    'font-${int}',
  ],
  letterSpacing: [
    'tracking-${static}',
    'tracking-${size}',
  ],
  lineHeight: [
    'leading-${static}',
    'leading-${int}',
    'leading-${size}',
  ],
  listStyleType: [
    'list-${static}',
  ],
  placeholderColor: [
    'placeholder-${color}',
  ],
  placeholderOpacity: [
    'placeholder-opacity-${static}',
    'placeholder-opacity-${int<=100}',
  ],
  // Backgrounds
  backgroundColor: [
    'bg-${color}',
  ],
  backgroundOpacity: [
    'bg-opacity-${static}',
    'bg-opacity-${int<=100}',
  ],
  backgroundPosition: [
    'bg-${static}',
  ],
  backgroundSize: [
    'bg-${static}',
  ],
  backgroundImage: [
    'bg-${static}',
  ],
  gradientColorStops: [
    'from-${color}',
    'via-${color}',
    'to-${color}',
  ],
  // Borders
  borderRadius: [
    'rounded-${static}',
    'rounded-t-${static}',
    'rounded-l-${static}',
    'rounded-r-${static}',
    'rounded-b-${static}',
    'rounded-tl-${static}',
    'rounded-tr-${static}',
    'rounded-br-${static}',
    'rounded-bl-${static}',

    'rounded-${int}xl',
    'rounded-${size}',
    'rounded-t-${int}xl',
    'rounded-t-${size}',
    'rounded-l-${int}xl',
    'rounded-l-${size}',
    'rounded-r-${int}xl',
    'rounded-r-${size}',
    'rounded-b-${int}xl',
    'rounded-b-${size}',
    'rounded-tl-${int}xl',
    'rounded-tl-${size}',
    'rounded-tr-${int}xl',
    'rounded-tr-${size}',
    'rounded-br-${int}xl',
    'rounded-br-${size}',
    'rounded-bl-${int}xl',
    'rounded-bl-${size}',
  ],
  borderWidth: [
    'border-${static}',
    'border-${int}',
    'border-${size}',
    'border-t-${int}',
    'border-t-${size}',
    'border-r-${int}',
    'border-r-${size}',
    'border-b-${int}',
    'border-b-${size}',
    'border-l-${int}',
    'border-l-${size}',
  ],
  borderColor: [
    'border-${color}',
  ],
  borderOpacity: [
    'border-opacity-${static}',
    'border-opacity-${int<=100}',
  ],
  divideWidth: [
    'divide-y-reverse',
    'divide-x-reverse',
    'divide-y-${int}',
    'divide-x-${int}',
  ],
  divideColor: [
    'divide-${color}',
  ],
  divideOpacity: [
    'divide-${static}',
    'divide-opacity-${int<=100}',
  ],
  ringOffsetWidth: [
    'ring-offset-${static}',
    'ring-offset-${int}',
  ],
  ringOffsetColor: [
    'ring-offset-${color}',
  ],
  ringWidth: [
    'ring-${static}',
    'ring-${int}',
  ],
  ringColor: [
    'ring-${color}',
  ],
  ringOpacity: [
    'ring-${static}',
    'ring-opacity-${int<=100}',
  ],
  // Effects
  boxShadow: [
    'shadow-${static}',
  ],
  opacity: [
    'opacity-${static}',
    'opacity-${int<=100}',
  ],
  transition: [
    'transition-${static}',
  ],
  transitionDuration: [
    'duration-${static}',
    'duration-${int}',
  ],
  transitionTimingFunction: [
    'ease-${static}',
  ],
  transitionDelay: [
    'delay-${static}',
    'delay-${int}',
  ],
  animation: [
    'animate-${static}',
  ],
  // Transforms
  transformOrigin: [
    'origin-${static}',
  ],
  scale: [
    'scale-${static}',
    'scale-${int}',
    'scale-x-${static}',
    'scale-x-${int}',
    'scale-y-${static}',
    'scale-y-${int}',
  ],
  rotate: [
    'rotate-${static}',
    'rotate-${float}',
  ],
  translate: [
    'translate-${static}',
    'translate-x-${static}',
    'translate-y-${static}',
    'translate-x-${float}',
    'translate-x-${fraction}',
    'translate-x-${size}',
    'translate-y-${float}',
    'translate-y-${fraction}',
    'translate-y-${size}',
  ],
  skew: [
    'skew-x-${static}',
    'skew-x-${float}',
    'skew-y-${static}',
    'skew-y-${float}',
  ],
  cursor: [
    'cursor-${static}',
  ],
  // Interactivity
  outline: [
    'outline-${static}',
  ],
  outlineColor: [
    'outline-${color}',
    'outline-solid-${color}',
    'outline-dotted-${color}',
  ],
  // SVG
  fill: [
    'fill-${color}',
  ],
  // Stroke
  stroke: [
    'stroke-${color}',
  ],
  strokeWidth: [
    'stroke-${int}',
  ],

  // Plugins
  typography: [
    'prose-sm',
    'prose',
    'prose-lg',
    'prose-xl',
    'prose-2xl',
    'prose-red',
    'prose-yellow',
    'prose-green',
    'prose-blue',
    'prose-indigo',
    'prose-purple',
    'prose-pink',
  ],
  aspectRatio: [
    'aspect-none',
    'aspect-auto',
    'aspect-square',
    'aspect-video',
    'aspect-w-${float}',
    'aspect-h-${float}',
    'aspect-${fraction}',
  ],
  lineClamp: [
    'line-clamp-none',
    'line-clamp-${int}',
  ],
  filter: [
    'filter-${static}',
  ],
  backdropFilter: [
    'backdrop-${static}',
  ],
  blur: [
    'blur-${static}',
    'blur-${float}',
    'blur-${size}',
  ],
};

const negative: { [key:string]: true} = {
  inset: true,
  zIndex: true,
  order: true,
  margin: true,
  space: true,
  letterSpacing: true,
  rotate: true,
  translate: true,
  skew: true,
};

export function generateCompletions(processor: Processor): { static: string[], color: string[], dynamic: string[]} {
  const completions : {
    static: string[],
    color: string[],
    dynamic: string[]
  } = { static: [], color: [], dynamic: [] };
  const colors = flatColors(processor.theme('colors') as {[key:string]:string|{[key:string]:string}});
  for (const [config, list] of Object.entries(utilities)) {
    list.forEach(utility => {
      const mark = utility.search(/\$/);
      if (mark === -1) {
        completions.static.push(utility);
      } else {
        const prefix = utility.slice(0, mark-1);
        const suffix = utility.slice(mark);
        switch(suffix) {
        case '${static}':
          completions.static = completions.static.concat(Object.keys(processor.theme(config, {}) as any).map(i => i === 'DEFAULT' ? prefix : i.charAt(0) === '-' ? `-${prefix}${i}` : `${prefix}-${i}`));
          break;
        case '${color}':
          for (const key of Object.keys(flatColors(processor.theme(config, colors) as any))) {
            if (key !== 'DEFAULT')
              completions.color.push(`${prefix}-${key}`);
          }
          break;
        default:
          completions.dynamic.push(utility);
          if (config in negative) completions.dynamic.push(`-${utility}`);
          break;
        }
      }
    });
  }
  return completions;
}
