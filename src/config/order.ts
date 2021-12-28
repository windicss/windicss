export const variantOrder = [
  'hover',
  'focus',
  'active',
  'visited',
  'link',
  'target',
  'focus-visible',
  'focus-within',
  'checked',
  'not-checked',
  'default',
  'disabled',
  'enabled',
  'indeterminate',
  'invalid',
  'valid',
  'optional',
  'required',
  'placeholder-shown',
  'read-only',
  'read-write',
  'not-disabled',
  'first-of-type',
  'not-first-of-type',
  'last-of-type',
  'not-last-of-type',
  'first',
  'last',
  'not-first',
  'not-last',
  'only-child',
  'not-only-child',
  'only-of-type',
  'not-only-of-type',
  'even',
  'odd',
  'even-of-type',
  'odd-of-type',
  'root',
  'empty',
  'before',
  'after',
  'first-letter',
  'first-line',
  'file-selector-button',
  'selection',
  'svg',
  'all',
  'children',
  'siblings',
  'sibling',
  'ltr',
  'rtl',
  'group-hover',
  'group-focus',
  'group-active',
  'group-visited',
  'motion-safe',
  'motion-reduce',
];

export enum layerOrder {
  base = 10,
  components = 150,
  shortcuts = 160,
  utilities = 20000,
}

export enum pluginOrder {
  'columns' = 80,
  'container' = 100,
  'space' = 200,
  'divideWidth' = 300,
  'divideColor' = 400,
  'divideStyle' = 500,
  'divideOpacity' = 600,
  'accessibility' = 700,
  'appearance' = 800,
  'backgroundAttachment' = 900,
  'backgroundClip' = 1000,
  'backgroundColor' = 1100,
  'backgroundImage' = 1200,
  'gradientColorStops' = 1300,
  'backgroundOpacity' = 1400,
  'backgroundPosition' = 1500,
  'backgroundRepeat' = 1600,
  'backgroundSize' = 1700,
  'backgroundOrigin' = 1750,
  'borderCollapse' = 1800,
  'borderColor' = 1900,
  'borderOpacity' = 2000,
  'borderRadius' = 2100,
  'borderStyle' = 2200,
  'borderWidth' = 2300,
  'boxDecorationBreak' = 2350,
  'boxSizing' = 2400,
  'cursor' = 2500,
  'captionSide' = 2550,
  'emptyCells' = 2560,
  'display' = 2600,
  'flexBasis' = 2699,
  'flexDirection' = 2700,
  'flexWrap' = 2800,
  'placeItems' = 2900,
  'placeContent' = 3000,
  'placeSelf' = 3100,
  'alignItems' = 3200,
  'alignContent' = 3300,
  'alignSelf' = 3400,
  'justifyItems' = 3500,
  'justifyContent' = 3600,
  'justifySelf' = 3700,
  'flex' = 3800,
  'flexGrow' = 3900,
  'flexShrink' = 4000,
  'order' = 4100,
  'float' = 4200,
  'clear' = 4300,
  'fontFamily' = 4400,
  'fontWeight' = 4500,
  'height' = 4600,
  'fontSize' = 4700,
  'lineHeight' = 4800,
  'listStylePosition' = 4900,
  'listStyleType' = 5000,
  'margin' = 5100,
  'maxHeight' = 5200,
  'maxWidth' = 5300,
  'minHeight' = 5400,
  'minWidth' = 5500,
  'objectFit' = 5600,
  'objectPosition' = 5700,
  'opacity' = 5800,
  'outline' = 5900,
  'overflow' = 6000,
  'overscrollBehavior' = 6100,
  'padding' = 6200,
  'placeholderColor' = 6300,
  'placeholderOpacity' = 6400,
  'caretColor' = 6450,
  'caretOpacity' = 6460,
  'tabSize' = 6470,
  'pointerEvents' = 6500,
  'position' = 6600,
  'inset' = 6700,
  'resize' = 6800,
  'boxShadow' = 6900,
  'boxShadowColor' = 6950,
  'ringWidth' = 7000,
  'ringOffsetColor' = 7100,
  'ringOffsetWidth' = 7200,
  'ringColor' = 7300,
  'ringOpacity' = 7400,
  'fill' = 7500,
  'stroke' = 7600,
  'strokeWidth' = 7700,
  'strokeDashArray' = 7750,
  'strokeDashOffset' = 7760,
  'tableLayout' = 7800,
  'textAlign' = 7900,
  'textColor' = 8000,
  'textOpacity' = 8100,
  'textOverflow' = 8200,
  'textShadow' = 8250,
  'fontStyle' = 8300,
  'textTransform' = 8400,
  'textDecorationStyle' = 8450,
  'textDecorationLength' = 8455,
  'textDecorationColor' = 8460,
  'textDecorationOpacity' = 8470,
  'textDecorationOffset' = 8480,
  'textDecorationThickness' = 8490,
  'textDecoration' = 8500,
  'textIndent' = 8550,
  'textStrokeColor' = 8560,
  'textStrokeWidth' = 8570,
  'content' = 8580,
  'fontSmoothing' = 8600,
  'fontVariantNumeric' = 8700,
  'letterSpacing' = 8800,
  'userSelect' = 8900,
  'verticalAlign' = 9000,
  'visibility' = 9100,
  'backfaceVisibility' = 9150,
  'whitespace' = 9200,
  'wordBreak' = 9300,
  'writingMode' = 9340,
  'hyphens' = 9350,
  'width' = 9400,
  'zIndex' = 9500,
  'isolation' = 9550,
  'gap' = 9600,
  'gridAutoFlow' = 9700,
  'gridTemplateColumns' = 9800,
  'gridAutoColumns' = 9900,
  'gridColumn' = 10000,
  'gridColumnStart' = 10100,
  'gridColumnEnd' = 10200,
  'gridTemplateRows' = 10300,
  'gridAutoRows' = 10400,
  'gridRow' = 10500,
  'gridRowStart' = 10600,
  'gridRowEnd' = 10700,
  'transform' = 10800,
  'transformOrigin' = 10900,
  'scale' = 11000,
  'rotate' = 11100,
  'translate' = 11200,
  'skew' = 11300,
  'perspective' = 11350,
  'perspectiveOrigin' = 11360,
  'transitionProperty' = 11400,
  'transitionTimingFunction' = 11500,
  'transitionDuration' = 11600,
  'transitionDelay' = 11700,
  'keyframes' = 11800,
  'animation' = 11900,
  'imageRendering' = 11950,
  'mixBlendMode' = 12000,
  'backgroundBlendMode' = 12100,
  'filter' = 12200,
  'blur' = 12300,
  'brightness' = 12400,
  'contrast' = 12500,
  'dropShadow' = 12600,
  'grayscale' = 12700,
  'hueRotate' = 12800,
  'invert' = 12900,
  'saturate' = 13000,
  'sepia' = 13100,
  'backdropFilter' = 13200,
  'backdropBlur' = 13300,
  'backdropBrightness' = 13400,
  'backdropContrast' = 13500,
  'backdropGrayscale' = 13600,
  'backdropHueRotate' = 13700,
  'backdropInvert' = 13800,
  'backdropOpacity' = 13900,
  'backdropSaturate' = 14000,
  'backdropSepia' = 14100,
  'willChange' = 14200,
  'touchAction' = 14300,
  'scrollBehavior' = 14400,
  'accentColor' = 14500,
}
