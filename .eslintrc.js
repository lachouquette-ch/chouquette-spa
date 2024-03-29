module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'plugin:vue/recommended',
    'plugin:prettier-vue/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    indent: ['error', 2],
    // TODO: Remove when is https://github.com/babel/babel-eslint/issues/530 fixed
    'template-curly-spacing': 'off',
    // indent : "off"
  },
}
