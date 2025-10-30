const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

const PORT = process.env.PORT || 3001;

module.exports = {
  entry: path.resolve(__dirname, 'src/index.jsx'),
  output: {
    publicPath: 'auto',
    clean: true,
    uniqueName: 'chat_app'
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
    hot: true,
    open: false
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'chat_app',
      filename: 'remoteEntry.js',
      remotes: {
        host: 'host@http://localhost:3000/remoteEntry.js'
      },
      exposes: {
        './ChatApp': './src/ChatApp.jsx'
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: false },
        'react-dom': { singleton: true, eager: true, requiredVersion: false }
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    })
  ]
};


