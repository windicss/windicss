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
    expect(parser.parse().sort(true).children.map(i => i.build()).join('\n')).toMatchSnapshot('css');
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
});
