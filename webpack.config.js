const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/rsql-browser.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.prod-browser.json'
          },
        }
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
