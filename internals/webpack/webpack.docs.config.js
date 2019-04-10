const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');
const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: [
    isDev && 'webpack-hot-middleware/client?reload=true',
    path.join(process.cwd(), 'docs-src/app.js'), // Start with js/app.js
  ].filter((a) => a),
  output: {
    path: path.resolve(process.cwd(), 'docs'),
    publicPath: '/pcg32/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
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
        exclude: /node_modules/,
      }, {
        test: /\.(jpg|png|gif)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      }
    ]
  },
  plugins: [
    isDev && new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
    // new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'docs-src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
    new webpack.BannerPlugin({
      banner: [
        'pcg32.js demo (c) 2019 Martin Wind',
        'Released under the Apache License, Version 2.0',
      ].join('\n')
    }),
  ].filter((a) => a),
  target: 'web',
  devtool: 'source-map',
  performance: {
    hints: false,
  },
};
