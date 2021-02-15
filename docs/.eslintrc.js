// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    'plugin:vue/recommended', // https://github.com/vuejs/eslint-plugin-vue
    '@vue/standard', // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  // add your custom rules here
  rules: {
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }],
    'comma-dangle': ['error', 'always-multiline'],
    'no-console': process.env.NODE_ENV === 'production' ? ['error', { allow: ['warn', 'error', 'info'] }] : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // Vue Rules from eslint-plugin-vue
    'vue/attribute-hyphenation': ['error', 'never', {
      ignore: [
        'stroke-dasharray',
        'stroke-width',
      ],
    }],
    'vue/html-closing-bracket-spacing': ['error', {
      selfClosingTag: 'never',
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 5,
      multiline: {
        max: 1,
        allowFirstLine: false,
      },
    }],
    'vue/multiline-html-element-content-newline': 0,
    'vue/no-v-html': 0,
    'vue/singleline-html-element-content-newline': 0,
  },
}
