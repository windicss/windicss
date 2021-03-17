import { defineConfig } from '../../src/helpers';

defineConfig({
  theme: {
    extend: {
      // @ts-expect-error disallow nested configs
      extend: {},
    },
  },
});

// works
defineConfig({
  theme: {
    spacing: {
      '128': '32rem',
      '144': '36rem',
    },
    extend: {
      animation: {},
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
