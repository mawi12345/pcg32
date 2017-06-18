const path = require('path');
const webpack = require('webpack');
const ClosureCompilerPlugin = require('webpack-closure-compiler');

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
      }
    ]
  },
  plugins: [
    new ClosureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'ADVANCED'
      },
      concurrency: 3,
    }),
    new webpack.BannerPlugin({
      banner: [
        'pcg32.js (c) 2017 Martin Wind',
        'Released under the Apache License, Version 2.0',
        'this build includes parts of',
        '  long.js (c) 2013 Daniel Wirtz <dcode@dcode.io>',
        '  Released under the Apache License, Version 2.0',
      ].join('\n')
    }),
  ],
  target: 'web',
};
