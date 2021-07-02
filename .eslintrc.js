module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'plugin:cypress/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'vue/html-self-closing': 'off',
    'vue/singleline-html-element-content-newline': 'off',
  },
};
