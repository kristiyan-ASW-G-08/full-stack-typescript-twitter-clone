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
    'import/no-unresolved': 0,
    'no-underscore-dangle': 0,
  },
  env: {
    'jest/globals': true,
  },
};
