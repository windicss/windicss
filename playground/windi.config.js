module.exports = {
  extract: {
    include: ['**/*.{html,}'],
    exclude: ['**/node_modules/**', '.git', 'dist', 'personal'],
  },
  theme: {
    extend: {
      colors: {
        'windi-dark': '#171717',
        'windi-blue': '#48b0f1',
      },
    },
  },
};
