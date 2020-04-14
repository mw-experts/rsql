module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  extends: [
    'airbnb-typescript/base',
    'plugin:jest/all',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
};
