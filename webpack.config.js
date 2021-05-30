const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/rsql-browser.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'rsql-browser.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
