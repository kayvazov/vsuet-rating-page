require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: [
    "./src/js/index.js",
    './src/scss/index.scss'
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "js/[name].[hash:5].js",
  },
  optimization: {
    minimizer: [new TerserJSPlugin({})],
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        },
        global: {
          name: 'global',
          test: /global/,
          chunks: 'all',
          enforce: true
        },
        pages: {
          name: 'pages',
          test: /pages/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            }
          },
          // далее, по .css файлу проходиться postcss-loader да бы, проставить все нужные полифиллы и префиксы к свойствам
          'postcss-loader',
          // в начале sass-loader переводить .scss файл в .css
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
                indentedSyntax: true // optional
              },
            }
          }
        ]
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // fonts
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          publicPath: 'fonts',
          outputPath: 'fonts',
          name: '[name].[sha1:hash:base64:5].[ext]'
        },
      },
      {
        test: /\.(svg|png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          publicPath: '',
          outputPath: 'imgs',
          name: '[name].[sha1:hash:base64:5].[ext]'
        },
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/main.[hash:4].css',
    }),
    new VueLoaderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      inject: true,
      version: process.env.VERSION,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      title: 'Успеваемость студентов ВГУИТ',
      description: 'Более удобная версия сайта с ведомостями с успеваемостями студентов ВГУИТ!',
      url: 'https://rating.kenan.agency',
      template: './index.template.ejs',
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        output: {
          comments: false,
          beautify: false
        }
      }
    }),
  ],
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue: 'vue/dist/vue.runtime.min.js',
      'vue-router': 'vue-router/dist/vue-router.min.js',
      'vuex': 'vuex/dist/vuex.min.js',
      'axios': 'axios/dist/axios.min.js'
    }
  },
  node: {
    module: 'empty',
    fsevents: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};