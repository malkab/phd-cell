// Doc version: 2020-12-10

// This will create a huge autocontained bundle
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
  entry: {
    coveringcells: './src/coveringcells.ts',
    gridder: './src/gridder.ts',
    griddersetup: './src/griddersetup.ts'
  },

  mode: "production",
  target: "node",
  plugins: [

    new CleanWebpackPlugin()

  ],

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js'
  },

  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: [

        path.join(__dirname, '/node_modules/'),
        path.join(__dirname, "/test/")

      ]
    }]
  },

  optimization: {

    minimize: true,
    minimizer: [new TerserPlugin({
      parallel: true,
      terserOptions: {
        extractComments: true,
        mangle: {
          toplevel: true
        },
        output: {
          comments: false
        }
      }
    })]

  },

  node: {
    fs: "empty"
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },

  plugins: [
    new FilterWarningsPlugin({
      exclude: /Critical dependency: the request of a dependency is an expression/
    })
  ]

};
