const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

const PORT = process.env.PORT || 3000;

module.exports = {
  entry: path.resolve(__dirname, 'src/index.jsx'),
  output: {
    publicPath: 'auto',
    clean: true,
    uniqueName: 'host'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    port: PORT,
    historyApiFallback: true,
    hot: false,
    liveReload: true,
    open: false
  },
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        chat_app: process.env.VERCEL_CHAT_URL
          ? `chat_app@https://${process.env.VERCEL_CHAT_URL}/remoteEntry.js`
          : 'chat_app@http://localhost:3001/remoteEntry.js',
        email_app: process.env.VERCEL_EMAIL_URL
          ? `email_app@https://${process.env.VERCEL_EMAIL_URL}/remoteEntry.js`
          : 'email_app@http://localhost:3002/remoteEntry.js'
      },
      exposes: {
        './design-system': './src/design-system/index.js',
        './design-system/Button': './src/design-system/Button.jsx',
        './design-system/Card': './src/design-system/Card.jsx',
        './event-bus': './src/eventBus.js'
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: false },
        'react-dom': { singleton: true, eager: true, requiredVersion: false }
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      favicon: false
    })
  ]
};


