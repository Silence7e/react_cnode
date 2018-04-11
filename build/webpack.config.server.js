const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = webpackMerge(baseConfig, {
  target: 'node',
  entry: {
    app: path.resolve(__dirname, '../client/serverEntry.js')
  },
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    filename: 'serverEntry.js',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE': '"http://127.0.0.1:3333"',
    }),
  ],
});
