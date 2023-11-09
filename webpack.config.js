const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  output: {
    // 利用path模块将相对路径转换为绝对路径
    path: path.resolve('./dist'),
    filename: 'scripts/bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      { test: /.ts$/, loader: 'ts-loader' }
    ]
  },
  resolve: {
    // 解析的时候，后缀名为js和ts都会进行解析
    extensions: ['.ts', '.js']
  }
}