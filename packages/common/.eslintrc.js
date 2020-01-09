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
  //eslint-config-airbnb-typescript import/no-unresolved throws an error when a custom path is used
  rules: {
    'import/no-unresolved': 0,
  },
  plugins: ['jest'],
  env: {
    'jest/globals': true,
  },
  overrides: [
    {
      files: ['*.test.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 0,
      },
    },
  ],
};
