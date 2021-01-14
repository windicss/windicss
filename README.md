# windicss

<p>
  <a href="https://www.npmjs.com/package/windicss">
    <img src="https://img.shields.io/npm/v/windicss.svg" alt="package version">
  </a>
  <a href="https://www.npmjs.com/package/windicss">
    <img src="https://img.shields.io/npm/dt/windicss.svg" alt="total downloads">
  </a>
  <a href="https://github.com/voorjaar/windicss/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/windicss.svg" alt="license">
  </a>
</p>

windicss is a css compiler or css interpreter, which is based on the grammar of [tailwindcss](https://github.com/tailwindlabs/tailwindcss) and adds other features.

The original idea of this project was to replace the tailwindcss workflow of (postcss + purgecss + autoprefixer).

## How it works

The following html as an example:

```html
<div class="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
  <img class="block mx-auto h-24 rounded-full sm:mx-0 sm:flex-shrink-0" src="/img/erin-lindford.jpg" alt="Woman's Face">
  <div class="text-center space-y-2 sm:text-left">
    <div class="space-y-0.5">
      <p class="text-lg text-black font-semibold">
        Erin Lindford
      </p>
      <p class="text-gray-500 font-medium">
        Product Engineer
      </p>
    </div>
    <button class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Message</button>
  </div>
</div>
```

### Interpretation mode

Interpret mode is similar to the traditional [tailwindcss](https://github.com/tailwindlabs/tailwindcss) workflow, based on the input HTML text, and parse the classes in the HTML, then build our css file based on these classes.

```css
/* preflight... */

.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
}

.block {
  display: block;
}

/* ... */

@media (min-width: 640px) {
  .sm\:flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  }
  .sm\:flex-shrink-0 {
    -ms-flex-negative: 0;
    -webkit-flex-shrink: 0;
    flex-shrink: 0;
  }
  /* ... */
}
```

### Compilation mode

The compilation mode synthesizes all the css attributes corresponding to the className in the class attribute, which brings us back to the traditional css writing method, and includes all the great features of tailwindcss. This mode is conducive to JavaScript Frameworks based on SFC templates like [vuejs](https://github.com/vuejs/vue) and [sveltejs](https://github.com/sveltejs/svelte). All we need is a preprocessor.

```html
<div class="windi-15wa4me">
<img class="windi-1q7lotv" src="/img/erin-lindford.jpg" alt="Woman's Face">
<div class="windi-7831z4">
  <div class="windi-x3f008">
    <p class="windi-2lluw6">
      Erin Lindford
    </p>
    <p class="windi-1caa1b7">
      Product Engineer
    </p>
  </div>
  <button class="windi-d2pog2">Message</button>
</div>
</div>
```

```css
/* preflight... */

.windi-15wa4me {
  --tw-bg-opacity: 1; /* bg-white */
  --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
  -webkit-box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow); /* shadow-md */
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity)); /* bg-white */
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow); /* shadow-md */
  margin-left: auto; /* mx-auto */
  margin-right: auto; /* mx-auto */
  max-width: 24rem; /* max-w-sm */
  padding-left: 2rem; /* px-8 */
  padding-right: 2rem; /* px-8 */
  padding-top: 2rem; /* py-8 */
  padding-bottom: 2rem; /* py-8 */
}

/* ... */

@media (min-width: 640px) {
  .windi-15wa4me {
    -ms-flex-align: center; /* items-center */
    -webkit-align-items: center; /* items-center */
    -webkit-box-align: center; /* items-center */
    align-items: center; /* items-center */
    display: -ms-flexbox; /* flex */
    display: -webkit-box; /* flex */
    display: -webkit-flex; /* flex */
    display: flex; /* flex */
    padding-top: 1rem; /* py-4 */
    padding-bottom: 1rem; /* py-4 */
  }
  
  /* ... */
}

```

## Features

* Cross browser support

    Each utility of windicss built with cross-browser support, which means you don't need an autoprefixer plugin.

* Minify support

    You can simply generate the minimized css.

* Preflight support

    You can generate preflights based on html tags.

* Zero dependencies

    Make it easy to use and run fast.

* Only build what you needed

    So no need to add purgecss plugin at all.

* Unrestricted build

    1. Number

        ```js
        p-${float[0,...infinite]} -> padding: (${float/4})rem
        
        p-2.5 -> padding: 0.625rem;

        p-3.2 -> padding: 0.8rem;
        ```

    2. Size

        ${size} should end up with rem|em|px|vh|vw

        ```js
        p-${size} -> padding: ${size}
        
        p-3px -> padding: 3px;

        p-4rem -> padding: 4rem;
        ```

    3. Fraction

        ```js
        w-${fraction} -> width: ${fraction -> precent}

        w-9/12 -> width: 75%;

    4. Color

        ```js
        bg-${color} -> background-color: rgba(...)

        bg-gray-300 -> background-color: rgba(209, 213, 219, var(--tw-bg-opacity);
        
        bg-hex-${hex} -> background-color: rgba(...)

        bg-hex-1c1c1e -> background-color: rgba(28, 28, 30, var(--tw-bg-opacity));
        ```

    5. Variable

        ```js
        bg-$${variableName}

        .bg-$test-variable {
          --tw-bg-opacity: 1;
          background-color: rgba(var(--test-variable), var(--tw-bg-opacity));
        }

        // You should define css variables in inline style to apply dynamic rendering. eg. <div class="bg-$test-variable" style="--test-variable: 23, 22, 21;">...</div>
        ```

* New variants

    1. Screens

        ```css
        sm: @media (min-width:640px);
        +sm: @media (min-width:640px) and (max-width:768px);
        -sm: @media (max-width:640px);
        ...
        ```

    2. Themes

        ```css
        dark: .dark
        @dark: @media (prefers-color-scheme:dark);
        light: .light
        @light: @media (prefers-color-scheme:light);
        ```

    3. States

        Support all css [pseudo elements and pseudo classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes).

## Usage

### CLI Application

`npm i -g windicss`

#### Learn how to use it

`windicss --help`

#### Initialize a simple html project

`windicss --init <project>`

`windicss --init <project> --compile`

#### Compile to `tailwind.css`

`windicss './**/*.html' -to tailwind.css`

`windicss './**/*.html' -mto tailwind.min.css`

#### Transform tailwindcss to normal css file

`windicss './**/*.html' -cto windi.css`

`windicss './**/*.html' -ts`

`windicss './**/*.html' -cts`

### Interaction with Javascript Frameworks

vue: [vue-windicss-preprocess](https://github.com/voorjaar/vue-windicss-preprocess)

svelte: [svelte-windicss-preprocess](https://github.com/voorjaar/svelte-windicss-preprocess)

react and angular: webpack plugin (coming soon...).

### Programming interface

Go check [example/*](https://github.com/voorjaar/windicss/tree/v1.0.0/example)

## Resources

* [Roadmap](https://github.com/voorjaar/windicss/projects/1)

* [Documents](https://github.com/voorjaar/windicss)

* [Discussions](https://github.com/voorjaar/windicss/discussions)

* [MIT License](https://github.com/voorjaar/windicss/blob/main/LICENSE)

## Future work

  The project is still in its early stages and contributions will be very helpful.

* ~~Utilities support.~~
* ~~Preflights support.~~
* ~~Autoprefix support.~~
* ~~Minify support.~~
* ~~CLI support.~~
* ~~Svelte Plugin.~~
* ~~Vue Plugin.~~
* ~~Add tailwind directives support.~~
* ~~Group support (eg. sm:hover:(bg-black-300 dark:text-gray-200)).~~
* ~~Add tailwind.config.js support.~~
* ~~(x) Function support (eg. prop(font-size, 1em), bg-hsla(...), bg-raw(#fff) ...).~~
* ~~Add new utility && variant && variable support~~
* Add some unit tests.
* Write documentations.
* Online playground (maybe fork from [tailwind playground](https://github.com/tailwindlabs/play.tailwindcss.com)).

## Special thanks

Learned a lot from [twin.macro](https://github.com/ben-rogerson/twin.macro), if you want to use css-in-js with tailwindcss, you can check it.
