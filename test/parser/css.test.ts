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

.link:hover {
  @apply bg-red-500;
}

.link:hover {
  opacity: 1;
}
`;

const MINICSS = String.raw`*, ::before, ::after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:-moz-focusring{outline:1px dotted ButtonText}:-moz-ui-invalid{box-shadow:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}::-webkit-inner-spin-button, ::-webkit-outer-spin-button{height:auto}::-webkit-search-decoration{-webkit-appearance:none}::moz-focus-inner{border-style:none;padding:0}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}[type='search']{-webkit-appearance:textfield;outline-offset:-2px}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:Graphik,sans-serif;line-height:1.5}a{color:inherit;text-decoration:inherit}code{font-size:1em;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace}img{border-style:solid;display:block;max-width:100%;height:auto}p{margin:0}ul{list-style:none;margin:0;padding:0}.testApply.svelte-z54hh{padding-top:1.5rem;font-size:1rem;line-height:1.5rem;font-weight:700}.min-h-screen{min-height:100vh}.bg-gray-100{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.justify-center{-webkit-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center}.flex{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.flex-col{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.relative{position:relative}.py-3{padding-top:0.75rem;padding-bottom:0.75rem}.absolute{position:absolute}.inset-0{top:0px;right:0px;bottom:0px;left:0px}.bg-gradient-to-r{background-image:-o-linear-gradient(left, var(--tw-gradient-stops));background-image:-webkit-gradient(linear, left top, right top, from(var(--tw-gradient-stops)));background-image:linear-gradient(to right, var(--tw-gradient-stops))}.shadow-lg{--tw-shadow:0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.transform{--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;-webkit-transform:translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));-ms-transform:translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));transform:translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-skew-y-6{--tw-skew-y:-6deg}.px-4{padding-left:1rem;padding-right:1rem}.py-10{padding-top:2.5rem;padding-bottom:2.5rem}.max-w-md{max-width:28rem}.mx-auto{margin-left:auto;margin-right:auto}.h-7{height:1.75rem}.divide-y > :not([hidden]) ~ :not([hidden]){--tw-divide-y-reverse:0;border-top-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(1px * var(--tw-divide-y-reverse))}.divide-gray-300 > :not([hidden]) ~ :not([hidden]){--tw-divide-opacity:1;border-color:rgba(209, 213, 219, var(--tw-divide-opacity))}.py-8{padding-top:2rem;padding-bottom:2rem}.text-base{font-size:1rem;line-height:1.5rem}.leading-6{line-height:1.5rem}.space-y-4 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.text-gray-700{--tw-text-opacity:1;color:rgba(55, 65, 81, var(--tw-text-opacity))}.list-disc{list-style-type:disc}.space-y-2 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.5rem * var(--tw-space-y-reverse))}.text-sm{font-size:0.875rem;line-height:1.25rem}.font-bold{font-weight:700}.text-gray-900{--tw-text-opacity:1;color:rgba(17, 24, 39, var(--tw-text-opacity))}@media(min-width: 480px){.testApply.svelte-z54hh{font-size:1.125rem;line-height:1.75rem}.sm\:py-12{padding-top:3rem;padding-bottom:3rem}.sm\:max-w-xl{max-width:36rem}.sm\:mx-auto{margin-left:auto;margin-right:auto}.sm\:skew-y-0{--tw-skew-y:0deg}.sm\:-rotate-6{--tw-rotate:-6deg}.sm\:rounded-3xl{border-radius:1.5rem}.sm\:p-20{padding:5rem}.sm\:h-8{height:2rem}.sm\:text-lg{font-size:1.125rem;line-height:1.75rem}.sm\:leading-7{line-height:1.75rem}}@media(min-width: 480px) and (max-width: 768px){ul.svelte-z54hh{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity));padding:0.5rem;border-radius:0.5rem}}svg{display:block}.flex{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-start{-webkit-box-align:start;-ms-flex-align:start;-webkit-align-items:flex-start;align-items:flex-start}.h-6{height:1.5rem}.items-center{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-shrink-0{-ms-flex-negative:0;-webkit-flex-shrink:0;flex-shrink:0}.h-5{height:1.25rem}.w-5{width:1.25rem}.ml-2{margin-left:0.5rem}@media(min-width: 480px){.sm\:h-7{height:1.75rem}}`;

const PROCESSOR = new Processor();


describe('CSSParser', () => {
    it('parse empty', () => {
        expect(new CSSParser().parse().build()).toEqual('');
        expect(new CSSParser(undefined, PROCESSOR).parse().build()).toEqual('');
        expect(new CSSParser().parse().build(true)).toEqual('');
        expect(new CSSParser(undefined, PROCESSOR).parse().build(true)).toEqual('');
    })

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
.link:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(239, 68, 68, var(--tw-bg-opacity));
  opacity: 1;
}
.button:focus {
  --tw-text-opacity: 1;
  color: rgba(110, 231, 183, var(--tw-text-opacity));
}
.dark .test {
  font-weight: 500;
}
.dtest {
  font-weight: 300;
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
}`)
    })

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
.link:hover {
  @apply bg-red-500;
  opacity: 1;
}
.dtest {
  @apply font-light;
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
}`)
    })
})