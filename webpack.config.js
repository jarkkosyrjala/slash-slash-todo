const path = require('path')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const WorkboxPlugin = require('workbox-webpack-plugin')
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
    filename: 'todo-app.[chunkhash].js',
    path: distPath,
    publicPath: '/',
  },
  devServer: {
    static: distPath,
    compress: true,
    port: 8888,
    http2: true,
    https: true,
    host: 'localhost',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '// TODO',
      favicon: path.resolve(srcPath, 'favicon.gif'),
    }),
    new WebpackPwaManifest({
      filename: './manifest.json',
      ios: {
        'apple-mobile-web-app-title': '// TODO',
        'apple-mobile-web-app-status-bar-style': 'black-translucent',
      },
      name: '// TODO',
      short_name: '// TODO',
      developerName: 'Jarkko Syrjälä',
      scope: '/',
      background_color: '#9876aa',
      theme_color: '#9876aa',
      orientation: 'portrait',
      display: 'standalone',
      appleStatusBarStyle: 'black-translucent',
      related_applications: [
        {
          platform: 'webapp',
          url: 'https://todo.syrjala.fi/manifest.json',
        },
      ],

      icons: [
        {
          src: path.resolve('src/assets/icon-small.png'),
          size: [144, 96, 72, 48, 36],
          destination: path.join('icons', 'android'),
        },
        {
          src: path.resolve('src/assets/icon-big.png'),
          size: [384, 192],
          destination: path.join('icons', 'android'),
        },
        {
          src: path.resolve('src/assets/icon-big.png'),
          size: [256, 512],
          destination: path.join('icons', 'android'),
        },
        {
          src: path.resolve('src/assets/icon-big.png'),
          sizes: [57, 60, 72, 76, 113, 120, 144, 152, 167, 180, 1024],
          destination: path.join('icons', 'ios'),
          ios: true,
        },
        {
          src: path.resolve('src/assets/icon-big.png'),
          sizes: 1024,
          destination: path.join('icons', 'ios'),
          ios: 'startup',
        },
      ],
      // TODO
    }),
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/sw.js',
      swDest: './sw.js',
      dontCacheBustURLsMatching: /\.(js|gif)$/i,
    }),
  ],
}
