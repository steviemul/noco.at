const webpack = require('webpack');

module.exports = {
  entry: './app/client/main.js',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    }]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/app/static/js',
    filename: 'bundle.js'
  }
};