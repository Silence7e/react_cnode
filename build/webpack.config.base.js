const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/public/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash:8]'
          },
        }],
      }
    ],
  },
};
