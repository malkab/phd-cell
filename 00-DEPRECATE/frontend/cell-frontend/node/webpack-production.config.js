const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const webpack = require('webpack');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

var proxyBaseUrl = '';

module.exports = {
  entry: [ './src/main.ts', './src/googleAnalytics.ts' ],
  mode: "production",

  plugins: [
    new CleanWebpackPlugin(['dist-production']),
    new HtmlWebpackPlugin({
      title: 'Frontend APP'
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [ 
        'css/main.css',
        // This is the Material theme, change here
        'css/indigo-pink.css'
      ],
      append: false
    }),
    new UglifyJSPlugin(),
    new FaviconsWebpackPlugin('./ui-ux-logo.png'),
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      'src', // location of your src
      {}
    ),
    new TransferWebpackPlugin([
      {from: 'static', to: 'static'},
      {from: 'css', to: 'css'}
    ], path.resolve(__dirname, 'src'))
  ],

  output: {
    filename: 'main.js',
    publicPath: proxyBaseUrl,
    path: path.resolve(__dirname, 'dist-production')
  },

  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        loaders: [ 'style-loader', 'css-loader', 'sass-loader' ],
        include: [ /node_modules/ ]
      },
      {
        test: /\.(s*)css$/,
        loaders: [ 'to-string-loader', 'css-loader', 'sass-loader' ],
        exclude: [ /node_modules/ ]
      },
      {
        test: /\.tsx?$/,
        loaders: [
          {
            loader: 'ts-loader',
          },
          'angular2-template-loader'
        ],
        exclude: [ "/node_modules/" ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      },
      {
        test: /\.(csv|tsv)$/,
        use: 'csv-loader'
      },
      {
        test: /\.xml$/,
        use: 'xml-loader'
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      }
    ]
  },

  node: {
    fs: "empty"
  },

  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    modules: [ 'node_modules', 'src', 'config' ],
    alias: {
      leaflet_css: path.join(__dirname + "/node_modules/leaflet/dist/leaflet.css"),
      proj4: path.join(__dirname + "/node_modules/proj4/dist/proj4.js"),
      config$: path.resolve(__dirname, "config/production.js"),
    }
  }
};
