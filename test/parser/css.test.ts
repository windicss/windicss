import { Processor } from '../../src/lib';
import { CSSParser } from '../../src/utils/parser';

const PROCESSOR = new Processor();
const PARSER = new CSSParser();

describe('CSSParser', () => {
  it('Most Simple', () => {
    const css = 'font-size: 12px;';
    expect(PARSER.parse(css).build()).toEqual('font-size: 12px;');
  });

  it('Single Level', () => {
    const css = `
    img,
    video {
      max-width: 100%;
      height: auto;
    }
    .navigation {
      font-size: 12px;
    }
    .logo {
      width: 300px;
    }
    `;
    expect(PARSER.parse(css).build()).toMatchSnapshot('css');
  });

  it('Nesting', () => {
    const css = `
      #header {
        color: black;
        .navigation {
          font-size: 12px;
        }
        .logo {
          width: 300px;
        }
      }`;
    expect(PARSER.parse(css).build()).toMatchSnapshot('css');
  });

  it('Deep Nesting', () => {
    const css = `
      #header {
        color: black;
        .navigation {
          font-size: 12px;
          .logo {
            width: 300px;
            .abc {
              color: white;
            }
            height: 200px;
          }
        }
      }
    `;
    expect(PARSER.parse(css).build()).toMatchSnapshot('css');
  });

  it('Pseudo Classes', () => {
    const css = `
    #bundle {
      .button {
        display: block;
        border: 1px solid black;
        background-color: grey;
        &:hover {
          background-color: white;
        }
        &::first-line {
          color: red;
        }
        &__abc {
          &:focus {
            color: blue;
          }
        }
      }
      .logo {
        width: 300px;
      }
    }
    `;
    expect(PARSER.parse(css).build()).toMatchSnapshot('css');
  });

  it('One line AtRule', () => {
    const css = `
      @import "library";
      @import "typo.css";
    `;
    expect(PARSER.parse(css).build()).toMatchSnapshot('css');
  });

  it('AtRule wrap properties', () => {
    const css = `
    @font-face {
      font-family: Proxima Nova;
      font-weight: 400;
      src: url(/fonts/proxima-nova/400-regular.woff) format("woff");
    }
    `;
    expect(PARSER.parse(css).build()).toMatchSnapshot('css');
  });

  it('Simple atRule', () => {
    const css = `
    @media (min-width: 768px) {
      .test {
        color: red;
      }
    }
    `;
    expect(PARSER.parse(css).build()).toMatchSnapshot('css');
  });

  it('Nested At-Rules and Bubbling', () => {
    const css = `
      .component {
        width: 300px;
        @media (min-width: 768px) {
          width: 600px;
          @media (min-resolution: 192dpi) {
            background-image: url(/img/retina2x.png);
          }
        }
        @media (min-width: 1280px) {
          width: 800px;
        }
      }
    `;
    expect(PARSER.parse(css).build()).toMatchSnapshot('css');
  });

  it('Nested At-Rules', () => {
    const css = `
      @media (min-width: 768px) {
        .test {
          width: 300px !important;
        }
        @media (min-resolution: 192dpi) {
          .component {
            background-image: url(/img/retina2x.png);
          }
        }
      }
    `;
    expect(PARSER.parse(css).build()).toMatchSnapshot('css');
  });

  it('Keyframes', () => {
    const css = `
    @media (min-width: 640px) {
      @media (prefers-color-scheme: dark) {
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      }
    }`;
    expect(PARSER.parse(css).build()).toMatchSnapshot('css');
  });

  it('Directives and Functions', () => {
    const css = `
    @screen sm {
      .test {
        padding-top: 1px;
      }
    }

    .container {
      width: 100%;
      margin-right: auto;
      margin-left: auto;
      padding-right: 1rem;
      padding-left: 1rem;
      @apply font-bold lg:bg-green-300 md:text-lg !important;
      @apply text-gray-900;
    }

    @media (min-width: 640px) {
      .container {
        max-width: 640px; /* this is comment */
      }
    }

    @media (min-width: 768px) {
      .container {
        max-width: 768px;
      }
    }

    @screen dark {
      .test {
        @apply bg-gray-300;
      }
    }

    @variants dark {
      .test {
        @apply font-medium;
      }
    }

    @variants lg:hover, focus {
      .button {
        @apply text-green-300;
      }
    }

    .link:hover {
      @apply bg-red-500;
    }

    .link:hover {
      opacity: 1;
    }`;

    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse().build()).toMatchSnapshot('css');
  });

  it('apply chain', () => {
    const css = `.base {
      @apply w-9 h-9 rounded-md;
    }
    .extend-base {
      @apply base bg-white;
    }`;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse().build()).toMatchSnapshot('css');
  });

  it('apply hover with multiple selector', () => {
    const css = `.a, .b {
      @apply hover:text-red-200;
    }`;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse().build()).toMatchSnapshot('css');
  });

  it('do not change apply order', () => {
    const css = `.test-border {
      @apply border-red-500;
      border-right-color: transparent;
      border-bottom-color: transparent;
      border-left-color: transparent;
    }`;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse().build()).toMatchSnapshot('css');
  });

  it('theme function', () => {
    const css = `.btn-blue {
      background-color: theme('colors.blue.500');
    }
    .content-area {
      height: calc(100vh - theme('spacing[2.5]', '0.625rem')) + theme('spacing.2', '0.5rem');
    }
    .content-area2 {
      height: calc(100vh - theme('spacing.a', '4rem'));
    }`;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse().build()).toMatchSnapshot('css');
  });

  it('allow last rule without semicolon', () => {
    const css = '.btn-red {background-color: red  }';
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse().build()).toEqual('.btn-red {\n  background-color: red;\n}');
  });

  it('layer directive', () => {
    const css = `
    .test {
      @apply font-bold text-red-500;
    }
    @layer components {
      .components {
        @apply bg-red-500;
      }
    }

    @layer utilities {
      .utilities {
        max-width: 768px;
      }
    }

    @layer base {
      base {
        margin-left: auto;
      }
    }

    .normal {
      marign-right: auto; /* components by default */
    }
    `;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse().sort().children.map(i => i.build()).join('\n')).toMatchSnapshot('css');
  });

  it('keeps multiple @font-face', () => {
    const css = `
    @font-face {
      font-family: Proxima Nova;
      font-weight: 400;
      src: url(/fonts/proxima-nova/400-regular.woff) format("woff");
    }
    @font-face {
      font-family: Proxima Nova;
      font-weight: 700;
      src: url(/fonts/proxima-nova/700-regular.woff) format("woff");
    }
    `;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  it('animations with @apply', () => {
    const css = `
    .pulse-class {
      @apply relative w-40 h-40 rounded-full bg-teal-500 opacity-60 animate-pulse;
    }

    @screen dark {
      .ping-class {
        @apply animate-ping;
      }
    }
    `;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  it('comma separated selectors', () => {
    const css = `
    .dark {
      .parent {
        & h2, & h3 {
          & > a {
            &::after {
              color: red;
            }
          }
        }
      }
    }

    .Comp1,
    .Comp2 {
      border: 1px solid red;

      &-child {
        border:10px solid green;
      }
    }

    .alert, .warning {
      ul, p {
        margin-left: 0;
      }
    });


    `;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  it('single line comment', () => {
    const css = `
// comment a
.test {
// comment b
  &-child {
    border: 10px solid green;
    // this is another comment
  }
}
`;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  it('multiple line comment', () => {
    const css = `
    .box {
      border: 10px solid green;
    }
    /* .test {
      &-child {
        border: 10px solid green;
      }
    } */
    `;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  it('last rule without semicolon', () => {
    const css = '.font-bold { @apply font-bold; display: block }';
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  it('background-image url', () => {
    const css = `.background {
      background-image: url('https://awebsite.com/an-image.png');
      &__overlay {
        // any rule
        background-color: #023761;
      }
    }`;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  it('@import url', () => {
    const css = `@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap');
    #app {
      color: red;
    }`;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  it('nesting', () => {
    const css = `.Comp.is-active {
      .a, .b {
        border: 5px solid pink;
      }
    }`;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  it('nesting self referencing', () => {
    const css = `.Comp.is-active {
      &,
      .Comp-child {
        border: 5px solid pink;
      }
    }`;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  // #239
  it('@apply twice', () => {
    const css = `.rounded-box {
      border-radius: var(--rounded-box, 1rem);
    }
    .card {
      @apply rounded-box;
    }
    .artboard {
      @apply rounded-box;
    }`;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  it('variables', () => {
    const css = `
    $font-stack: Helvetica, sans-serif;
    $primary-color: #333;

    body {
      font: 100% $font-stack;
      color: $primary-color;
    }
    `;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  // #262
  it('!important leak out to subsequent style rules', () => {
    const css = `
    .button {
      @apply text-red-500 !important;
      color: green;
    }
    `;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  // #269
  it('parse data url may break', () => {
    const css = `
    @font-face {
      font-family:swiper-icons;
      src:url('data:application/font-woff;charset=utf-8;base64, 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')
    }
    `;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse(css).build()).toMatchSnapshot('css');
  });

  it('apply order', () => {
    const css = `
    .test {
      @apply relative fixed;
    }
    `;
    expect(new CSSParser(css, PROCESSOR).parse().build()).toMatchSnapshot('css');
  });
});
