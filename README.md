Backwards compatibility 

- [] Processor -> rewrite `https://github.dev/windicss/windicss/tree/main/src` into `index.ts`
  - [] interpret
  - [] preflight
  - [] attributify
  - [] e
  - [] config
- [] Stylesheet & Style -> rewrite `https://github.dev/windicss/windicss/tree/main/src` & `https://github.dev/windicss/windicss/tree/main/src` into `styles.ts`
  - [] build
  - [] children
  - [] prefixer
  - [] sort
- [] CSSParser -> rewrite `https://github.dev/windicss/windicss/tree/main/src` into `parsers/css.ts` to have smaller footprint but also keep backward compatibility
- [] defineConfig
- [] FullConfig
- [] @apply -> not sure yet