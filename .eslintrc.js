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
  rules: {
    "@typescript-eslint/indent": "off",
    "import/prefer-default-export": "off",
    "operator-linebreak": "off",
    "class-methods-use-this": "off",
    "implicit-arrow-linebreak": "off",
    "function-paren-newline": "off",
    "no-plusplus": "off",
    "no-continue": "off",
    "jest/lowercase-name": "off",
    "jest/no-hooks": "off",
  },
};
