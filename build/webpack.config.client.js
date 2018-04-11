const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const baseConfig = require('./webpack.config.base');

const isDev = process.env.NODE_ENV === 'development';

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.resolve(__dirname, '../client/App.js'),
  },
  output: {
    filename: '[name].[hash:5].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../client/template.html'),
    }),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!' + path.resolve(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs'
    }),
  ],
});

if (isDev) {
  config.devtool = '#cheap-module-eval-source-map';
  config.entry = {
    app: ['react-hot-loader/patch', path.resolve(__dirname, '../client/App.js')],
  };
  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    // contentBase: path.resolve(__dirname, '../dist'),
    hot: true,
    overlay: {
      errors: true,
    },
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html',
    },
    proxy: {
      '/api': 'http://localhost:3333',
    }
  };
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  config.entry = {
    app: [path.resolve(__dirname, '../client/App.js')],
    vendor: ['react', 'react-dom', 'react-router-dom', 'mobx', 'mobx-react', 'axios', 'query-string'],
  }
  config.output.filename = '[name].[chunkhash:8].js';
  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new UglifyJsPlugin(),
    new webpack.NamedModulesPlugin(),
    new NameAllModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      }
    }),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk.mapModules(m => path.relative(m.context, m.request)).join('-');
    })
  );
}

module.exports = config;
