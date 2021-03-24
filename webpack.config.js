const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const distPath = path.resolve(__dirname, 'dist')
const srcPath = path.resolve(__dirname, 'src')
module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.(js|tsx?)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.module.scss$/i,
        use: [
          'style-loader',
          { loader: 'css-modules-typescript-loader' },
          { loader: 'css-loader', options: { modules: true } },
          'sass-loader',
        ],
      },
      {
        test: /^(?:(?!\.module\b).)*\.scss$/i,
        use: ['style-loader', { loader: 'css-loader', options: { modules: true } }, 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss', '.module.scss'],
  },
  output: {
    filename: 'todo-app.js',
    path: distPath,
  },
  devServer: {
    static: distPath,
    compress: true,
    port: 8888,
    host: 'localhost',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '// TODO',
      favicon: path.resolve(srcPath, 'favicon.gif'),
    }),
  ],
}
