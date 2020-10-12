const path = require('path');
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: {
    main: "./src/main.ts",
    test: "./src/test.ts",
    mocha: "./src/mocha.ts"
  },
  mode: "development",
  watch: true,
  target: "node",
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './build'
  },

  output: {
    path: path.resolve(__dirname),
    filename: './build/[name].js'
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        ],
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
