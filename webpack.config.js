const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var pathToPhaser = path.join(__dirname, "/node_modules/phaser/");
var phaser = path.join(pathToPhaser, "dist/phaser.js");

const filesRule = {
  test: /\.(png|jpe?g|gif|svg)$/i,
  use: [
    {
      loader: 'file-loader',
    },
  ],
}
const tsRule = {
  test: /\.tsx?$/,
  use: 'ts-loader',
  exclude: /node_modules/
}

const phaserRule = {
  test: /phaser\.js$/, loader: "expose-loader?Phaser"
}


module.exports = {
  entry: {
    app: './src/index.ts',
    vendors: ['phaser']
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [ filesRule, tsRule, phaserRule ],
  },
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, 'src'),
      phaser: phaser
    },
    modules: [ path.resolve(__dirname, 'node_modules') ]
  },
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Flappy Bird ANN Genetic Algorithm'
    }),
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true)
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
