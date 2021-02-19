import { Processor } from '../../src/lib';
import { CSSParser } from '../../src/utils/parser';

const CSS = String.raw`
@charset "utf-8";

@tailwind base;

@font-face {
  font-family: Proxima Nova;
  font-weight: 400;
  src: url(/fonts/proxima-nova/400-regular.woff) format("woff");
}

@screen sm {
  * {
    padding-top: 1px;
  }
}

img,
video {
  max-width: 100%;
  height: auto;
}

.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 1rem;
  padding-left: 1rem;
  @apply font-bold lg:bg-green-300 md:text-lg;
  @apply text-gray-900;
}

.dtest {
  @apply font-light !important;
}

.container {
  padding: 1rem;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px; /* this is comment */
  }
}

@media (min-width: 640px) {
  .container {
    min-width: 640px;
  }
}

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 640px) {
  @media (prefers-color-scheme: dark) {
    @keyframes ping {
      0% {
        transform: scale(1);
        opacity: 1;
        @apply font-bold;
      }
      75%, 100% {
        transform: scale(2);
        opacity: 0;
        @apply bg-yellow-300 md:bg-red-500;
      }
    }
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
}
`;

const PROCESSOR = new Processor();

describe('CSSParser', () => {
  it('parse empty', () => {
    expect(new CSSParser().parse().build()).toEqual('');
    expect(new CSSParser(undefined, PROCESSOR).parse().build()).toEqual('');
    expect(new CSSParser().parse().build(true)).toEqual('');
    expect(new CSSParser(undefined, PROCESSOR).parse().build(true)).toEqual('');
  });

  it('transform parse', () => {
    const parser = new CSSParser(CSS, PROCESSOR);
    const styleSheet = parser.parse();
    expect(styleSheet.build()).toEqual(String.raw`@charset "utf-8";
@tailwind base;
@font-face {
  font-family: Proxima Nova;
  font-weight: 400;
  src: url(/fonts/proxima-nova/400-regular.woff) format("woff");
}
html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}
img,
video {
  max-width: 100%;
  height: auto;
}
.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 1rem;
  padding-left: 1rem;
  font-weight: 700;
  --tw-text-opacity: 1;
  color: rgba(17, 24, 39, var(--tw-text-opacity));
  padding: 1rem;
}
.dtest {
  font-weight: 300 !important;
}
.dark .test {
  font-weight: 500;
}
.button:focus {
  --tw-text-opacity: 1;
  color: rgba(110, 231, 183, var(--tw-text-opacity));
}
.link:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(239, 68, 68, var(--tw-bg-opacity));
  opacity: 1;
}
@media (min-width: 640px) {
  * {
    padding-top: 1px;
  }
  .container {
    max-width: 640px;
    min-width: 640px;
  }
}
@media (min-width: 768px) {
  .container {
    font-size: 1.125rem;
    line-height: 1.75rem;
    max-width: 768px;
  }
}
@media (min-width: 1024px) {
  .container {
    --tw-bg-opacity: 1;
    background-color: rgba(110, 231, 183, var(--tw-bg-opacity));
  }
  .button:hover {
    --tw-text-opacity: 1;
    color: rgba(110, 231, 183, var(--tw-text-opacity));
  }
}
@media (prefers-color-scheme: dark) {
  @media (min-width: 640px) {
    @keyframes ping {
      0% {
        transform: scale(1);
        opacity: 1;
        font-weight: 700;
      }
      75%, 100% {
        transform: scale(2);
        opacity: 0;
        --tw-bg-opacity: 1;
        background-color: rgba(252, 211, 77, var(--tw-bg-opacity));
      }
      @media (min-width: 768px) {
        75%, 100% {
          --tw-bg-opacity: 1;
          background-color: rgba(239, 68, 68, var(--tw-bg-opacity));
        }
      }
    }
  }
  .test {
    --tw-bg-opacity: 1;
    background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
  }
}`);
  });

  it('normal parse', () => {
    const parser = new CSSParser(CSS);
    const styleSheet = parser.parse();
    expect(styleSheet.build()).toEqual(String.raw`@charset "utf-8";
@tailwind base;
@font-face {
  font-family: Proxima Nova;
  font-weight: 400;
  src: url(/fonts/proxima-nova/400-regular.woff) format("woff");
}
html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}
img,
video {
  max-width: 100%;
  height: auto;
}
.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 1rem;
  padding-left: 1rem;
  @apply font-bold lg:bg-green-300 md:text-lg;
  @apply text-gray-900;
  padding: 1rem;
}
.dtest {
  @apply font-light !important;
}
.link:hover {
  @apply bg-red-500;
  opacity: 1;
}
@screen sm {
  * {
    padding-top: 1px;
  }
}
@media (min-width: 640px) {
  .container {
    max-width: 640px;
    min-width: 640px;
  }
}
@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}
@media (prefers-color-scheme: dark) {
  @media (min-width: 640px) {
    @keyframes ping {
      0% {
        transform: scale(1);
        opacity: 1;
        @apply font-bold;
      }
      75%, 100% {
        transform: scale(2);
        opacity: 0;
        @apply bg-yellow-300 md:bg-red-500;
      }
    }
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
}`);
  });

  it('apply chain', () => {
    const css = `.base {
      @apply w-9 h-9 rounded-md;
    }
    .extend-base {
      @apply base bg-white;
    }`;
    const parser = new CSSParser(css, PROCESSOR);
    expect(parser.parse().build()).toEqual(
      `.base {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.375rem;
}
.extend-base {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.375rem;
  --tw-bg-opacity: 1;
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
}`);
  });
});
