module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['jest'],
  //eslint-config-airbnb-typescript import/no-unresolved throws an error when a custom path is used
  rules: {
    'no-restricted-syntax': 0,
    'no-irregular-whitespace': 0,
    'import/no-unresolved': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-case-declarations': 0,
  },
  env: {
    'jest/globals': true,
  },
};
