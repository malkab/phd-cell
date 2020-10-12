const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require("webpack-node-externals");
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  mode: "production",
  target: "node",
  plugins: [

    new CleanWebpackPlugin(['dist']),

    new UglifyJSPlugin(),

    new TypedocWebpackPlugin({
      name: 'CELL-WORKER',
      mode: 'modules',
      includeDeclarations: true,
      exclude: [ "node_modules" ],
      ignoreCompilerErrors: true,
      excludeExternals: true,
      inlineSourceMap: true,
      excludePrivate: true,
      excludeNotExported: true,
      excludeProtected: true,
      out: "./typedoc/html"
    }, [ "./src/lib/" ]),

    new TypedocWebpackPlugin({
      name: 'CELL-WORKER',
      mode: 'modules',
      theme: 'markdown',
      includeDeclarations: true,
      exclude: [ "node_modules" ],
      ignoreCompilerErrors: true,
      excludeExternals: true,
      inlineSourceMap: true,
      excludeNotExported: true,
      excludePrivate: true,
      excludeProtected: true,
      out: "./typedoc/markdown"
    }, [ "./src/lib/" ]),

    new TypedocWebpackPlugin({
      name: 'CELL-WORKER',
      mode: 'modules',
      includeDeclarations: true,
      exclude: [ "node_modules" ],
      ignoreCompilerErrors: true,
      excludeExternals: true,
      inlineSourceMap: true,
      excludeNotExported: false,
      excludePrivate: false,
      excludeProtected: false,
      out: "./typedoc/html-full"
    }, [ "./src/lib/" ]),

    new TypedocWebpackPlugin({
      name: 'CELL-WORKER',
      mode: 'modules',
      theme: 'markdown',
      includeDeclarations: true,
      exclude: [ "node_modules" ],
      ignoreCompilerErrors: true,
      excludeExternals: true,
      inlineSourceMap: true,
      excludeNotExported: false,
      excludePrivate: false,
      excludeProtected: false,
      out: "./typedoc/markdown-full"
    }, [ "./src/lib/" ])

  ],

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  node: {
    fs: "empty"
  },

  externals: [ nodeExternals() ],

  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  }
};
