var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './electronApp/src/entry.js',
  output: {
    path: path.resolve(__dirname, './electronApp/client/'),
    publicPath: '/',
    filename: 'build.js'
  },
  target: 'electron',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        }
      },
      {
        test: /\.sass$/,
        loaders:['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders:['css-loader', 'style-loader'],
        exclude: [
            /node_modules/,
            /lib/
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map',
  plugins: [
      new webpack.ExternalsPlugin('commonjs', [
          'electron'
      ])
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // uglifyjs was throwning an unexpected token error right before the 
    // meetup so I'm commenting it out for now and investigating later.
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
  })
  ])
}
