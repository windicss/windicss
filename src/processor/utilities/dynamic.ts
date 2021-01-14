import { Property, Style, GlobalStyle } from '../../utils/style';
import { Utility } from './handler';
import { roundUp, hex2RGB } from '../../utils/tools';

type Output = Property | Style | (Property|Style)[] | undefined;

// https://tailwindcss.com/docs/container
function container(utility: Utility): Output {
    if (utility.raw === 'container') {
        const className = utility.class;
        return [
            new Property('width', '100%').toStyle(className),
            new Property('max-width', '640px').toStyle(className).atRule('@media (min-width: 640px)'),
            new Property('max-width', '768px').toStyle(className).atRule('@media (min-width: 768px)'),
            new Property('max-width', '1024px').toStyle(className).atRule('@media (min-width: 1024px)'),
            new Property('max-width', '1280px').toStyle(className).atRule('@media (min-width: 1280px)'),
            new Property('max-width', '1536px').toStyle(className).atRule('@media (min-width: 1536px)')
        ];
    }
}

// https://tailwindcss.com/docs/top-right-bottom-left
function inset(utility: Utility): Output {
    let value = utility.handler
        .handleStatic({ 'auto': 'auto', 'full': '100%', 'px': '1px' })
        .handleNumber(0, undefined, 'float', (number: number) => number === 0 ? '0px' : `${roundUp(number / 4, 6)}rem`)
        .handleFraction()
        .handleSize()
        .handleValue((value:string)=>utility.isNegative? '-' + value : value)
        .handleVariable()
        .value
    if (!value) return;
    switch (utility.identifier) {
        case 'top':
        case 'right':
        case 'bottom':
        case 'left':
            return new Property(utility.identifier, value);
        case 'inset':
            if (utility.raw.match(/^-?inset-x/)) {
                return new Property(['right', 'left'], value);
            } else if (utility.raw.match(/^-?inset-y/)) {
                return new Property(['top', 'bottom'], value);
            } else {
                return new Property(['top', 'right', 'bottom', 'left'], value);
            }
    }
}

// https://tailwindcss.com/docs/z-index
function zIndex(utility: Utility): Output {
    return utility.handler
        .handleStatic({ 'auto': 'auto' })
        .handleNumber(0, 99999, 'int')
        .handleVariable()
        .createProperty('z-index')
}

// https://tailwindcss.com/docs/order
function order(utility: Utility): Output {
    let value = utility.handler
        .handleStatic({ 'first': '9999', 'last': '-9999', 'none': '0' })
        .handleNumber(1, 9999, 'int')
        .handleValue((value:string)=>utility.isNegative && value !== '0' ? '-' + value : value)
        .handleVariable()
        .value;
    if (value) return new Style(utility.class, [new Property('-webkit-box-ordinal-group', value.startsWith('var')?`calc(${value}+1)`:(parseInt(value)+1).toString()), new Property(['-webkit-order', '-ms-flex-order', 'order'], value)]);
}

// https://tailwindcss.com/docs/grid-template-columns
// https://tailwindcss.com/docs/grid-template-rows
function gridTemplate(utility: Utility): Output {
    let type;

    if (utility.raw.match(/^grid-rows-/)) {
        type = 'rows';
    } else if (utility.raw.match(/^grid-cols-/)) {
        type = 'columns';
    } else {
        return;
    }
    
    return utility.handler
        .handleStatic({'none': 'none'})
        .handleNumber(1, undefined, 'int')
        .handleVariable()
        .createProperty(`grid-template-${type}`, (value:string) => value === 'none' ? 'none': `repeat(${value}, minmax(0, 1fr));`)
   
}

// https://tailwindcss.com/docs/grid-column
function gridColumn(utility: Utility): Output {
    if (utility.raw === 'col-auto') return new Property('grid-column', 'auto');
    if (utility.raw === 'col-span-full') return new Property('grid-column', '1 / -1');
    let value  = utility.handler
            .handleStatic({'auto': 'auto'})
            .handleNumber(1, undefined, 'int')
            .handleVariable()
            .value;
    if (!value) return;
    if (utility.raw.match(/^col-span-/)) {
        return new Style(utility.class, [new Property('-ms-grid-column-span', value), new Property('grid-column', `span ${value} / span ${value}`)]);
    } else if (utility.raw.match(/^col-start-/)) {
        return new Property('grid-column-start', value);
    } else if (utility.raw.match(/^col-end-/)) {
        return new Style(utility.class, [new Property('-ms-grid-column-span', value), new Property('grid-column-end', value)]);
    }
}

// https://tailwindcss.com/docs/grid-row
function gridRow(utility: Utility): Output {
    if (utility.raw === 'row-auto') return new Property('grid-row', 'auto');
    if (utility.raw === 'row-span-full') return new Property('grid-row', '1 / -1');
    let value  = utility.handler
            .handleStatic({'auto': 'auto'})
            .handleNumber(1, undefined, 'int')
            .handleVariable()
            .value;
    if (!value) return;
    if (utility.raw.match(/^row-span-/)) {
        return new Style(utility.class, [new Property('-ms-grid-row-span', value), new Property('grid-row', `span ${value} / span ${value}`)]);
    } else if (utility.raw.match(/^row-start-/)) {
        return new Property('grid-row-start', value);
    } else if (utility.raw.match(/^row-end-/)) {
        return new Style(utility.class, [new Property('-ms-grid-row-span', value), new Property('grid-row-end', value)]);
    }
}

// https://tailwindcss.com/docs/gap
function gap(utility: Utility): Output {
    let value = utility.handler
        .handleStatic({ 'px': '1px' })
        .handleNumber(0, undefined, 'float', (number: number) => number === 0 ? '0px' : `${roundUp(number / 4, 6)}rem`)
        .handleSize()
        .handleVariable()
        .value;
    if (!value) return;
    if (utility.raw.match(/^gap-x-/)) {
        return new Property(['-webkit-column-gap', '-moz-column-gap', 'column-gap'], value);
    } else if (utility.raw.match(/^gap-y-/)) {
        return new Property('row-gap', value);
    } else {
        return new Property('gap', value);
    }
}

// https://tailwindcss.com/docs/padding
function padding(utility: Utility): Output {
    let value = utility.handler
        .handleStatic({ 'px': '1px' })
        .handleNumber(0, undefined, 'float', (number: number) => number === 0 ? '0px' : `${roundUp(number / 4, 6)}rem`)
        .handleSize()
        .handleVariable()
        .value;
    if (!value) return;
    switch (utility.identifier) {
        case 'p':
            return new Property('padding', value);
        case 'py':
            return new Property(['padding-top', 'padding-bottom'], value);
        case 'px':
            return new Property(['padding-left', 'padding-right'], value);
        case 'pt':
            return new Property('padding-top', value);
        case 'pr':
            return new Property('padding-right', value);
        case 'pb':
            return new Property('padding-bottom', value);
        case 'pl':
            return new Property('padding-left', value);
    }
};

// https://tailwindcss.com/docs/margin
function margin(utility: Utility): Output {
    let value = utility.handler
        .handleStatic({ 'auto': 'auto', 'px': '1px' })
        .handleNumber(0, undefined, 'float', (number: number) => number === 0 ? '0px' : `${roundUp(number / 4, 6)}rem`)
        .handleSize()
        .handleValue((value:string)=>utility.isNegative && value !== '0px' ? '-' + value : value)
        .handleVariable()
        .value;
    if (!value) return;
    switch (utility.identifier) {
        case 'm':
            return new Property('margin', value);
        case 'my':
            return new Property(['margin-top', 'margin-bottom'], value);
        case 'mx':
            return new Property(['margin-left', 'margin-right'], value);
        case 'mt':
            return new Property('margin-top', value);
        case 'mr':
            return new Property('margin-right', value);
        case 'mb':
            return new Property('margin-bottom', value);
        case 'ml':
            return new Property('margin-left', value);
    }
};

// https://tailwindcss.com/docs/space
function space(utility: Utility):Output {
    if (utility.raw === 'space-x-reverse') return new Property('--tw-space-x-reverse', '1');
    if (utility.raw === 'space-y-reverse') return new Property('--tw-space-y-reverse', '1');
    let value = utility.handler
    .handleStatic({ 'px': '1px' })
    .handleNumber(0, undefined, 'float', (number: number) => number === 0 ? '0px' : `${roundUp(number / 4, 6)}rem`)
    .handleSize()
    .handleValue((value:string)=>utility.isNegative && value !== '0px' ? '-' + value : value)
    .handleVariable()
    .value;
    if (!value) return;
    if (utility.raw.match(/^-?space-x-/)) {
        return new Style(utility.class, [
            new Property('--tw-space-x-reverse', '0'), 
            new Property('margin-right', `calc(${value} * var(--tw-space-x-reverse))`),
            new Property('margin-left', `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`)
        ]).child('> :not([hidden]) ~ :not([hidden])');
    } 
    if (utility.raw.match(/^-?space-y-/)) {
        return new Style(utility.class, [
            new Property('--tw-space-y-reverse', '0'), 
            new Property('margin-top', `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`),
            new Property('margin-bottom', `calc(${value} * var(--tw-space-y-reverse))`)
        ]).child('> :not([hidden]) ~ :not([hidden])');
    }
}

// https://tailwindcss.com/docs/width
// https://tailwindcss.com/docs/height
function size(utility:Utility):Output {
    let type;
    switch (utility.identifier) {
        case 'w':
            type = 'width';
            break;
        case 'h':
            type = 'height';
            break;
        default:
            return;
    }
    const amount = utility.amount;
    if (amount === 'min') {
        return new Style(utility.class, [new Property(type, '-webkit-min-content'), new Property(type, '-moz-min-content'), new Property(type, 'min-content')]);
    } else if (amount === 'max') {
        return new Style(utility.class, [new Property(type, '-webkit-max-content'), new Property(type, '-moz-max-content'), new Property(type, 'max-content')]);
    }
    if (utility.raw.match(/^[w|h]-screen-/)) {
        return utility.handler.handleStatic({'sm': '640px', 'md': '768px', 'lg': '1024px', 'xl': '1280px', '2xl': '1536px'}).createProperty(type)
    };
    return utility.handler
            .handleStatic({ 'auto': 'auto', 'full': '100%', 'px': '1px', 'screen': type==='width'?'100vw':'100vh', 'none': 'none', 'xs': '20rem', 'sm': '24rem', 'md': '28rem', 'lg': '32rem', 'prose': '65ch'})
            .handleNumber(0, undefined, 'float', (number: number) => number === 0 ? '0px' : `${roundUp(number / 4, 6)}rem`)
            .handleFraction()
            .handleSize()
            .handleNxl((number:number)=>{
                switch (number) {
                    case 1:
                        return '36rem';
                    case 2:
                        return '42rem';
                    case 3:
                        return '48rem';
                    default:
                        return `${(number-3)*8+48}rem`;
                }
            })
            .handleVariable()
            .createProperty(type)
}

// https://tailwindcss.com/docs/min-width
// https://tailwindcss.com/docs/min-height
// https://tailwindcss.com/docs/max-width
// https://tailwindcss.com/docs/max-height
function minMaxSize(utility:Utility):Output {
    const identifier = utility.raw.replace(/^(min|max)-[w|h]-/, '');
    const name = utility.raw.substring(0, 5).replace('h', 'height').replace('w', 'width');

    if (identifier.startsWith('screen-')) {
        return utility.handler.handleStatic({'sm': '640px', 'md': '768px', 'lg': '1024px', 'xl': '1280px', '2xl': '1536px'}).createProperty(name)
    };

    return utility.handler
            .handleStatic({ 'auto': 'auto', 'full': '100%', 'px': '1px', 'screen': name.endsWith('width')?'100vw':'100vh', 'min': 'min-content', 'max': 'max-content', 'none': 'none', 'xs': '20rem', 'sm': '24rem', 'md': '28rem', 'lg': '32rem', 'prose': '65ch'})
            .handleNumber(0, undefined, 'float', (number: number) => number === 0 ? '0px' : `${roundUp(number / 4, 6)}rem`)
            .handleFraction()
            .handleSize()
            .handleNxl((number:number)=>{
                switch (number) {
                    case 1:
                        return '36rem';
                    case 2:
                        return '42rem';
                    case 3:
                        return '48rem';
                    default:
                        return `${(number-3)*8+48}rem`;
                }
            })
            .handleVariable()
            .createProperty(name);
}

// https://tailwindcss.com/docs/font-size
// https://tailwindcss.com/docs/text-opacity
// https://tailwindcss.com/docs/text-color
function text(utility:Utility):Output {
    // handle font opacity
    if (utility.raw.startsWith('text-opacity')) return utility.handler.handleNumber(0, 100, 'int', (number:number)=>(number/100).toString()).handleVariable().createProperty('--tw-text-opacity');
    // handle font sizes
    const staticMap:{[key:string]:{[key:string]:string}} = {
        'xs': {'font-size':'0.75rem', 'line-height':'1rem'},
        'sm': {'font-size':'0.875rem', 'line-height':'1.25rem'},
        'base': {'font-size':'1rem', 'line-height':'1.5rem'},
        'lg': {'font-size':'1.125rem', 'line-height':'1.75rem'},
        'xl': {'font-size':'1.25rem', 'line-height':'1.75rem'},
        '2xl': {'font-size':'1.5rem', 'line-height':'2rem'},
        '3xl': {'font-size':'1.875rem', 'line-height':'2.25rem'},
        '4xl': {'font-size':'2.25rem', 'line-height':'2.5rem'},
        '5xl': {'font-size':'3rem', 'line-height':'1'},
        '6xl': {'font-size':'3.75rem', 'line-height':'1'},
        '7xl': {'font-size':'4.5rem', 'line-height':'1'},
        '8xl': {'font-size':'6rem', 'line-height':'1'},
        '9xl': {'font-size':'8rem', 'line-height':'1'},
    }
    const amount = utility.amount;
    if (amount in staticMap) return new Style(utility.class, [new Property('font-size', staticMap[amount]['font-size']), new Property('line-height', staticMap[amount]['line-height'])]);
    let value = utility.handler.handleNxl((number:number)=>`${number}rem`).handleSize().value;
    if (utility.raw.startsWith('text-size-$')) value = utility.handler.handleVariable().value;
    if (value) return new Style(utility.class, [new Property('font-size', value), new Property('line-height', '1')]);

    // handle colors
    value = utility.handler.handleColor().handleVariable().value;
    if (value) {
        if (['transparent', 'currentColor'].includes(value)) return new Property('color', value);
        return new Style(utility.class, [new Property('--tw-text-opacity', '1'), new Property('color', `rgba(${value.startsWith('var')?value:hex2RGB(value)?.join(', ')}, var(--tw-text-opacity))`)]);
    }
}


// https://tailwindcss.com/docs/font-weight
function fontWeight(utility:Utility):Output {
    return utility.handler
        .handleStatic({
            thin: '100',
            extralight: '200',
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800',
            black: '900',
        })
        .handleNumber(0, 900, 'int')
        .handleVariable()
        .createProperty('font-weight');
}


// https://tailwindcss.com/docs/letter-spacing
function letterSpacing(utility:Utility):Output {
    return utility.handler
        .handleStatic({
            tighter: '-0.05em',
            tight: '-0.025em',
            normal: '0em',
            wide: '0.025em',
            wider: '0.05em',
            widest: '0.1em',
        })
        .handleSize()
        .handleValue((value:string)=>utility.isNegative && value !== '0em' ? '-' + value : value)
        .handleVariable()
        .createProperty('letter-spacing');
}

// https://tailwindcss.com/docs/line-height
function lineHeight(utility:Utility):Output {
    return utility.handler
        .handleStatic({
            none: '1',
            tight: '1.25',
            snug: '1.375',
            normal: '1.5',
            relaxed: '1.625',
            loose: '2',
        })
        .handleNumber(0, undefined, 'int', (number:number)=>`${number*0.25}rem`)
        .handleSize()
        .handleVariable()
        .createProperty('line-height');
}

// https://tailwindcss.com/docs/placeholder-color
// https://tailwindcss.com/docs/placeholder-opacity
function placeholder(utility:Utility):Output {
    // handle placeholder opacity
    if (utility.raw.startsWith('placeholder-opacity')) return utility.handler.handleNumber(0, 100, 'int', (number:number)=>(number/100).toString()).handleVariable().createProperty('--tw-placeholder-opacity');
    let value = utility.handler.handleColor().handleVariable().value;
    if (value) {
        if (['transparent', 'currentColor'].includes(value)) return new Property('color', value);
        const rgb = value.startsWith('var')? value:hex2RGB(value)?.join(', ');
        return [
            new Style(utility.class, [new Property('--tw-placeholder-opacity', '1'), new Property('color', `rgba(${rgb}, var(--tw-placeholder-opacity))`)]).pseudoElement('-webkit-input-placeholder'),
            new Style(utility.class, [new Property('--tw-placeholder-opacity', '1'), new Property('color', `rgba(${rgb}, var(--tw-placeholder-opacity))`)]).pseudoElement('-moz-placeholder'),
            new Style(utility.class, [new Property('--tw-placeholder-opacity', '1'), new Property('color', `rgba(${rgb}, var(--tw-placeholder-opacity))`)]).pseudoClass('-ms-input-placeholder'),
            new Style(utility.class, [new Property('--tw-placeholder-opacity', '1'), new Property('color', `rgba(${rgb}, var(--tw-placeholder-opacity))`)]).pseudoElement('-ms-input-placeholder'),
            new Style(utility.class, [new Property('--tw-placeholder-opacity', '1'), new Property('color', `rgba(${rgb}, var(--tw-placeholder-opacity))`)]).pseudoElement('placeholder')
        ]
    }
}

// https://tailwindcss.com/docs/background-color
// https://tailwindcss.com/docs/background-opacity
function background(utility:Utility):Output {
     // handle background opacity
     if (utility.raw.startsWith('bg-opacity')) return utility.handler.handleNumber(0, 100, 'int', (number:number)=>(number/100).toString()).handleVariable().createProperty('--tw-bg-opacity');
     // handle background color
     let value = utility.handler.handleColor().handleVariable().value;
     if (value) {
         if (['transparent', 'currentColor'].includes(value)) return new Property('background-color', value);
         return new Style(utility.class, [new Property('--tw-bg-opacity', '1'), new Property('background-color', `rgba(${value.startsWith('var')?value:hex2RGB(value)?.join(', ')}, var(--tw-bg-opacity))`)])
     }
}

// https://tailwindcss.com/docs/gradient-color-stops from
function gradientColorFrom(utility:Utility):Output {
    let value = utility.handler.handleColor().handleVariable().value;
     if (value) {
        let rgb;
        switch (value) {
            case 'transparent':
                rgb = '0, 0, 0';
                break;
            case 'current':
                rgb = '255, 255, 255';
                break;
            default:
                rgb = value.startsWith('var')?value:hex2RGB(value)?.join(', ');
        }
        return new Style(utility.class, [new Property('--tw-gradient-from', value), new Property('--tw-gradient-stops', `var(--tw-gradient-from), var(--tw-gradient-to, rgba(${rgb}, 0))`)]);
     }
}


// https://tailwindcss.com/docs/gradient-color-stops via
function gradientColorVia(utility:Utility):Output {
    let value = utility.handler.handleColor().handleVariable().value;
     if (value) {
        let rgb;
        switch (value) {
            case 'transparent':
                rgb = '0, 0, 0';
                break;
            case 'current':
                rgb = '255, 255, 255';
                break;
            default:
                if (value.startsWith('var')) {
                    rgb = value;
                    value = `rgb(${value})`;
                } else {
                    rgb = hex2RGB(value)?.join(', ');
                }
        }
        return new Property('--tw-gradient-stops', `var(--tw-gradient-from), ${value}, var(--tw-gradient-to, rgba(${rgb}, 0))`);
     }
}

// https://tailwindcss.com/docs/gradient-color-stops to
function gradientColorTo(utility:Utility):Output {
    return utility.handler.handleColor().handleVariable().createProperty('--tw-gradient-to');
}

// https://tailwindcss.com/docs/border-radius
function borderRadius(utility:Utility):Output {
    let properties:string|string [] = [];
    switch (utility.center.replace(/-?\$[\w-]+/, '')) {
        case '':
            properties = 'border-radius';
            break;
        case 't':
            properties = ['border-top-left-radius', 'border-top-right-radius'];
            break;
        case 'r':
            properties = ['border-top-right-radius', 'border-bottom-right-radius'];
            break;
        case 'b':
            properties = ['border-bottom-right-radius', 'border-bottom-left-radius'];
            break;
        case 'l':
            properties = ['border-top-left-radius', 'border-bottom-left-radius'];
            break;
        case 'tl':
            properties = 'border-top-left-radius';
            break;
        case 'tr':
            properties = 'border-top-right-radius';
            break;
        case 'br':
            properties = 'border-bottom-right-radius';
            break;
        case 'bl':
            properties = 'border-bottom-left-radius';
            break;
        default:
            return;
    }
    return utility.handler
        .handleStatic({
            'none': '0px',
            sm: '0.125rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
            full: '9999px',
        })
        .handleNxl((number:number)=>`${number*0.5}rem`)
        .handleSize()
        .handleVariable()
        .createProperty(properties);
}

// https://tailwindcss.com/docs/border-width
// https://tailwindcss.com/docs/border-color
// https://tailwindcss.com/docs/border-opacity
function border(utility:Utility):Output {
    // handle border opacity
    if (utility.raw.startsWith('border-opacity')) return utility.handler.handleNumber(0, 100, 'int', (number:number)=>(number/100).toString()).handleVariable().createProperty('--tw-border-opacity');
    
    // handle border color
    let value = utility.handler.handleColor().handleVariable((variable:string)=>utility.raw.startsWith('border-$')?`var(--${variable})`:undefined).value;
     if (value) {
         if (['transparent', 'currentColor'].includes(value)) return new Property('border-color', value);
         return new Style(utility.class, [new Property('--tw-border-opacity', '1'), new Property('border-color', `rgba(${value.startsWith('var')?value:hex2RGB(value)?.join(', ')}, var(--tw-border-opacity))`)])
     }
    // handle border width
    let property = '';
    switch (utility.center.replace(/-?width-\$[\w-]+/, '')) {
        case '':
            property = 'border-width';
            break;
        case 't':
            property = 'border-top-width';
            break;
        case 'r':
            property = 'border-right-width';
            break;
        case 'b':
            property = 'border-bottom-width';
            break;
        case 'l':
            property = 'border-left-width';
            break;
        default:
            return;
    };
    return utility.handler.handleNumber(0, undefined, 'int', (number:number)=>`${number}px`).handleSize().handleVariable().createProperty(property);
}

// https://tailwindcss.com/docs/divide-width
// https://tailwindcss.com/docs/divide-color
// https://tailwindcss.com/docs/divide-opacity
// https://tailwindcss.com/docs/divide-style
function divide(utility:Utility):Output {
    // handle divide style
    if (['solid', 'dashed', 'dotted', 'double', 'none'].includes(utility.amount)) return new Property('border-style', utility.amount).toStyle(utility.class).child('> :not([hidden]) ~ :not([hidden])');
    // handle divide opacity
    if (utility.raw.startsWith('divide-opacity')) return utility.handler.handleNumber(0, 100, 'int', (number:number)=>(number/100).toString()).handleVariable().createProperty('--tw-divide-opacity');
    // handle divide color
    let value = utility.handler.handleColor().handleVariable((variable:string)=>utility.raw.startsWith('divide-$')?`var(--${variable})`:undefined).value;
    if (value) {
        if (['transparent', 'currentColor'].includes(value)) return new Property('border-color', value);
        return new Style(utility.class, [new Property('--tw-divide-opacity', '1'), new Property('border-color', `rgba(${value.startsWith('var')?value:hex2RGB(value)?.join(', ')}, var(--tw-divide-opacity))`)]).child('> :not([hidden]) ~ :not([hidden])');
    }
    // handle divide width
    switch (utility.raw) {
        case 'divide-x-reverse':
            return new Style(utility.class, new Property('--tw-divide-x-reverse', '1')).child('> :not([hidden]) ~ :not([hidden])');
        case 'divide-y-reverse':
            return new Style(utility.class, new Property('--tw-divide-y-reverse', '1')).child('> :not([hidden]) ~ :not([hidden])');
        case 'divide-y':
            return new Style(utility.class, [new Property('--tw-divide-y-reverse', '0'), new Property('border-top-width', 'calc(1px * calc(1 - var(--tw-divide-y-reverse)))'), new Property('border-bottom-width', 'calc(1px * var(--tw-divide-y-reverse))')]).child('> :not([hidden]) ~ :not([hidden])');
        case 'divide-x':
            return new Style(utility.class, [new Property('--tw-divide-x-reverse', '0'), new Property('border-right-width', 'calc(1px * var(--tw-divide-x-reverse))'), new Property('border-left-width', 'calc(1px * calc(1 - var(--tw-divide-x-reverse)))')]).child('> :not([hidden]) ~ :not([hidden])');
    };
    value = utility.handler.handleNumber(0, undefined, 'float', (number:number)=>`${number}px`).handleSize().handleVariable().value;
    if (value) {
        const centerMatch = utility.raw.match(/^-?divide-[x|y]/);
        if (centerMatch) {
            const center = centerMatch[0].replace(/^-?divide-/,'');
            switch (center) {
                case 'x':
                    return new Style(utility.class, [new Property('--tw-divide-x-reverse', '0'), new Property('border-right-width', `calc(${value} * var(--tw-divide-x-reverse))`), new Property('border-left-width', `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`)]).child('> :not([hidden]) ~ :not([hidden])');
                case 'y':
                    return new Style(utility.class, [new Property('--tw-divide-y-reverse', '0'), new Property('border-top-width', `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`), new Property('border-bottom-width', `calc(${value} * var(--tw-divide-y-reverse))`)]).child('> :not([hidden]) ~ :not([hidden])');
            };
        }
    }
}

// https://tailwindcss.com/docs/ring-offset-width
// https://tailwindcss.com/docs/ring-offset-color
function ringOffset(utility:Utility):Output {
    let value;
    // handle ring offset width variable
    if (utility.raw.startsWith('ring-offset-width-$')) {
        value = utility.handler.handleVariable().value;
        if (value) return new Style(utility.class.replace('ringOffset', 'ring-offset'), [new Property('--tw-ring-offset-width', value), new Property(['-webkit-box-shadow', 'box-shadow'], '0 0 0 var(--ring-offset-width) var(--ring-offset-color), var(--ring-shadow)')]);
    }

    // handle ring offset width
    if (utility.center === '') {
        value = utility.handler.handleNumber(0, undefined, 'float', (number:number)=>`${number}px`).handleSize().value;
        if (value) return new Style(utility.class.replace('ringOffset', 'ring-offset'), [new Property('--tw-ring-offset-width', value), new Property(['-webkit-box-shadow', 'box-shadow'], '0 0 0 var(--ring-offset-width) var(--ring-offset-color), var(--ring-shadow)')]);
    }
    
    // handle ring offset color
    value = utility.handler.handleColor().handleVariable().value;
    if (value) return new Style(utility.class.replace('ringOffset', 'ring-offset'), [new Property('--tw-ring-offset-color', value), new Property(['-webkit-box-shadow', 'box-shadow'], '0 0 0 var(--ring-offset-width) var(--ring-offset-color), var(--ring-shadow)')]);
}

// https://tailwindcss.com/docs/ring-width
// https://tailwindcss.com/docs/ring-color
// https://tailwindcss.com/docs/ring-opacity
function ring(utility:Utility):Output {
    // handle ring offset
    if (utility.raw.startsWith('ring-offset')) return ringOffset(new Utility(utility.raw.replace('ring-offset', 'ringOffset')));
    // handle ring opacity
    if (utility.raw.startsWith('ring-opacity')) return utility.handler.handleNumber(0, 100, 'int', (number:number)=>(number/100).toString()).handleVariable().createProperty('--tw-ring-opacity');
    // handle ring color
    let value = utility.handler.handleColor().handleVariable((variable:string)=>utility.raw.startsWith('ring-$')?`var(--${variable})`:undefined).value;
    if (value) {
        if (['transparent', 'currentColor'].includes(value)) return new Property('--tw-ring-color', value);
        return new Property('--tw-ring-color', `rgba(${hex2RGB(value)?.join(', ')}, var(--tw-ring-opacity))`);
    }
    // handle ring width
    if (utility.raw === 'ring-inset') return new Property('--tw-ring-inset', 'inset');
    if (utility.raw === 'ring') value = '3px';
    value = utility.handler.handleNumber(0, undefined, 'float', (number:number)=>`${number}px`).handleSize().handleVariable().value;
    if (value) return new Property(['-webkit-box-shadow', 'box-shadow'], `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`);
}

// https://tailwindcss.com/docs/opacity
function opacity(utility:Utility):Output {
    return utility.handler.handleNumber(0, 100, 'int', (number:number)=>(number/100).toString()).handleVariable().createProperty('opacity');
}

// https://tailwindcss.com/docs/transition-duration
function duration(utility:Utility):Output {
    return utility.handler.handleNumber(0, undefined, 'int', (number:number)=>`${number}ms`).handleVariable().createProperty(['-webkit-transition-duration', '-o-transition-duration', 'transition-duration']);
}

// https://tailwindcss.com/docs/transition-delay
function delay(utility:Utility):Output {
    return utility.handler.handleNumber(0, undefined, 'int', (number:number)=>`${number}ms`).handleVariable().createProperty(['-webkit-transition-delay', '-o-transition-delay', 'transition-delay']);
}

// https://tailwindcss.com/docs/animation
function animation(utility:Utility):Output {
    // this need to be change
    switch (utility.amount) {
        case 'none':
            return new Property(['-webkit-animation', 'animation'], 'none');
        case 'spin':
            return [
                new Style(utility.class, new Property(['-webkit-animation', 'animation'], 'spin 1s linear infinite')),
                new GlobalStyle('from', new Property(['-webkit-transform', 'transform'], 'rotate(0deg)')).atRule('@keyframes spin'),
                new GlobalStyle('to', new Property(['-webkit-transform', 'transform'], 'rotate(360deg)')).atRule('@keyframes spin'),
                new GlobalStyle('from', new Property(['-webkit-transform', 'transform'], 'rotate(0deg)')).atRule('@-webkit-keyframes spin'),
                new GlobalStyle('to', new Property(['-webkit-transform', 'transform'], 'rotate(360deg)')).atRule('@-webkit-keyframes spin'),
            ];
        case 'ping':
            return  [
                new Style(utility.class, new Property(['-webkit-animation', 'animation'], 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite')), 
                new GlobalStyle('0%', [new Property(['-webkit-transform', 'transform'], 'scale(1)'), new Property('opacity', '1')]).atRule('@keyframes ping'),
                new GlobalStyle('75%, 100%', [new Property(['-webkit-transform', 'transform'], 'scale(2)'), new Property('opacity', '0')]).atRule('@keyframes ping'),
                new GlobalStyle('0%', [new Property(['-webkit-transform', 'transform'], 'scale(1)'), new Property('opacity', '1')]).atRule('@-webkit-keyframes ping'),
                new GlobalStyle('75%, 100%', [new Property(['-webkit-transform', 'transform'], 'scale(2)'), new Property('opacity', '0')]).atRule('@-webkit-keyframes ping'),
            ];
        case 'pulse':
            return [
                new Style(utility.class, new Property(['-webkit-animation', 'animation'], 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite')),
                new GlobalStyle('0%, 100%', new Property('opacity', '1')).atRule('@keyframes pulse'),
                new GlobalStyle('50%', new Property('opacity', '.5')).atRule('@keyframes pulse'),
                new GlobalStyle('0%, 100%', new Property('opacity', '1')).atRule('@-webkit-keyframes pulse'),
                new GlobalStyle('50%', new Property('opacity', '.5')).atRule('@-webkit-keyframes pulse'),
            ];
        case 'bounce':
            return [
                new Style(utility.class, new Property(['-webkit-animation', 'animation'], 'bounce 1s infinite')),
                new GlobalStyle('0%, 100%', [new Property(['-webkit-transform', 'transform'], 'translateY(-25%)'), new Property(['-webkit-animation-timing-function', 'animation-timing-function'], 'cubic-bezier(0.8, 0, 1, 1)')]).atRule('@keyframes bounce'),
                new GlobalStyle('50%', [new Property(['-webkit-transform', 'transform'], 'translateY(0)'), new Property(['-webkit-animation-timing-function', 'animation-timing-function'], 'cubic-bezier(0, 0, 0.2, 1)')]).atRule('@keyframes bounce'),
                new GlobalStyle('0%, 100%', [new Property(['-webkit-transform', 'transform'], 'translateY(-25%)'), new Property(['-webkit-animation-timing-function', 'animation-timing-function'], 'cubic-bezier(0.8, 0, 1, 1)')]).atRule('@-webkit-keyframes bounce'),
                new GlobalStyle('50%', [new Property(['-webkit-transform', 'transform'], 'translateY(0)'), new Property(['-webkit-animation-timing-function', 'animation-timing-function'], 'cubic-bezier(0, 0, 0.2, 1)')]).atRule('@-webkit-keyframes bounce'),
            ];
    }
}

// https://tailwindcss.com/docs/scale
function scale(utility:Utility):Output {
    return utility.handler.handleNumber(0, undefined, 'int', (number:number)=>(number/100).toString()).handleVariable().createProperty(['--tw-scale-x', '--tw-scale-y']);
}

// https://tailwindcss.com/docs/rotate
function rotate(utility:Utility):Output {
    return utility.handler.handleNumber(0, 360, 'float', (number:number)=>`${number}deg`).handleValue((value:string)=>utility.isNegative && value !== '0deg' ? '-' + value : value).handleVariable().createProperty('--tw-rotate');
}

// https://tailwindcss.com/docs/translate
function translate(utility:Utility):Output {
    const centerMatch = utility.raw.match(/^-?translate-[x|y]/);
    if (centerMatch) {
        const center = centerMatch[0].replace(/^-?translate-/,'');
        return utility.handler
            .handleStatic({full: '100%', px: '1px'})
            .handleNumber(0, undefined, 'float', (number:number)=>(number === 0)?'0px':`${roundUp(number/4, 6)}rem`)
            .handleFraction()
            .handleSize()
            .handleValue((value:string)=>utility.isNegative && value !== '0px' ? '-' + value : value)
            .handleVariable()
            .createProperty(`--tw-translate-${center}`);
    }
}

// https://tailwindcss.com/docs/skew
function skew(utility:Utility):Output {
    const centerMatch = utility.raw.match(/^-?skew-[x|y]/);
    if (centerMatch) {
        const center = centerMatch[0].replace(/^-?skew-/,'');
        return utility.handler
            .handleNumber(0, 360, 'float', (number:number)=>`${number}deg`)
            .handleValue((value:string)=>utility.isNegative && value !== '0deg' ? '-' + value : value)
            .handleVariable()
            .createProperty(`--tw-skew-${center}`);
    }
}

// https://tailwindcss.com/docs/outline
function outline(utility:Utility):Output {
    let value = utility.handler.handleStatic({'none': 'transparent', 'white': 'white', 'black': 'black'}).handleColor().handleVariable((variable:string)=>utility.raw.startsWith('outline-$')?`var(--${variable})`:undefined).value;
    if (value) return new Style(utility.class, [new Property('outline', `2px ${value==='transparent'?'solid':'dotted'} ${value}`), new Property('outline-offset', '2px')]);
    if (utility.raw.match(/^outline-(solid|dotted)/)) {
        const newUtility = new Utility(utility.raw.replace('outline-', ''));
        value = newUtility.handler.handleStatic({'none': 'transparent', 'white': 'white', 'black': 'black'}).handleColor().handleVariable().value;
        if (value) return new Style(utility.class, [new Property('outline', `2px ${newUtility.identifier} ${value}`), new Property('outline-offset', '2px')]);
    }
}

// https://tailwindcss.com/docs/fill
function fill(utility:Utility):Output {
    return utility.handler.handleColor().handleVariable().createProperty('fill');
}

// https://tailwindcss.com/docs/stroke
// https://tailwindcss.com/docs/stroke-width
function stroke(utility:Utility):Output {
    const value = utility.raw.startsWith('stroke-$')?utility.handler.handleVariable().createProperty('stroke-width'):utility.handler.handleNumber(0, undefined, 'int').createProperty('stroke-width');
    return value ?? utility.handler.handleColor().handleVariable().createProperty('stroke');
}

export default {
    container: container,
    inset: inset,
    top: inset,
    right: inset,
    bottom: inset,
    left: inset,
    z: zIndex,
    order: order,
    grid: gridTemplate,
    col: gridColumn,
    row: gridRow,
    gap: gap,
    p: padding,
    py: padding,
    px: padding,
    pt: padding,
    pr: padding,
    pb: padding,
    pl: padding,
    m: margin,
    my: margin,
    mx: margin,
    mt: margin,
    mr: margin,
    mb: margin,
    ml: margin,
    space: space,
    w: size,
    h: size,
    min: minMaxSize,
    max: minMaxSize,
    text: text,
    font: fontWeight,
    tracking: letterSpacing,
    leading: lineHeight,
    placeholder: placeholder,
    bg: background,
    from: gradientColorFrom,
    via: gradientColorVia,
    to: gradientColorTo,
    rounded: borderRadius,
    border: border,
    divide: divide,
    ring: ring,
    opacity: opacity,
    duration: duration,
    delay: delay,
    animate: animation,
    scale: scale,
    rotate: rotate,
    translate: translate,
    skew: skew,
    outline: outline,
    fill: fill,
    stroke: stroke,
} as { [key:string]: (utility:Utility)=>Output }