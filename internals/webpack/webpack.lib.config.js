const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    pcg32: path.join(process.cwd(), 'pcg32.js'),
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].js',
    library: 'PCG32',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env']
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: [
        'pcg32.js (c) 2017 Martin Wind',
        'Released under the Apache License, Version 2.0',
      ].join('\n')
    }),
  ],
  target: 'web',
};
