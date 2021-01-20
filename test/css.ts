import { Processor } from '../src/lib';
import { CSSParser } from '../src/utils/parser';
import { writeFileSync } from 'fs';

const css = `
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
  @apply font-light;
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
`

const processor = new Processor();
const parser = new CSSParser(css, processor);
const styleSheet = parser.parse(undefined);
writeFileSync('output.css', styleSheet.build());