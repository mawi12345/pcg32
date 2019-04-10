const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
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
    rules: [
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: [
        'pcg32.js (c) 2019 Martin Wind',
        'Released under the Apache License, Version 2.0',
      ].join('\n')
    }),
  ],
  target: 'web',
};
