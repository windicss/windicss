import { defineConfig } from '../src';

defineConfig({
  theme: {
    // @ts-expect-error disallow coexist of theme and extend
    extend: {},
    animation: {},
  },
});

defineConfig({
  theme: {
    // @ts-expect-error disallow nested configs
    extend: {
      extend: {},
    },
  },
});

// works
defineConfig({
  theme: {
    extend: {
      animation: {},
    },
  },
});

// works
defineConfig({
  theme: {},
});

// works
defineConfig({
  theme: {
    random: [],
  },
});

// works
defineConfig({
  theme: {
    extend: {
      random: [],
    },
  },
});

// works
defineConfig({
  random: [],
});
