//基于node的 遵循commonjs规范的

let path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
//热更新
let webpack = require('webpack'); //启动热更新的第二步
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
// let MiniCssTractPlugin = require('mini-css-extract-plugin');

module.exports = {
  //单页html引用多个js
  entry: path.join(__dirname, './src/main.js'),//入口

  // //多页 a.html index.js/ b.html a.js
  // //entry:[
  //     './src/index.js',
  //     './src/a.js'
  // ],//入口
  output: {
    // filename:'index.js',//可以通过hash添加hash哥码
    // //这个路径必须是绝对路径
    // path:path.resolve('./build')
    path: path.join(__dirname, 'dist'),
    filename: 'build.js'
  },//出口
  devServer: {
    open: true, //自动打开浏览器
    port: 3000,//设置端口号
    contentBase: './build', //直接跳转到当前目录
    compress: true, //服务器压缩
    hot: true, //热更新的第一步
    

  },//开发服务器
  module: {//这个节点，用于配置所有第三方模块加载器
    rules: [//从右边往左写
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          use: 'css-loader',
          fallback: 'style-loader'
        })
      },
      //  {
      //     test: /\.css$/,
      //     use: [
      //         MiniCssTractPlugin.loader,
      //         {loader:'css-loader'}
      //     ]
      // },
      //babel-loader
      {
        test: /\.less$/,
        use: ['style-loader','css-loader','less-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader','css-loader','sass-loader'],
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
        // options: {
        //     presets: ['es2015'], //关键字
        //     plugins: ['transform-runtime'], //函数
        //  }
      },
      //vue-loader
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              css: ExtractTextWebpackPlugin.extract({
                use: 'css-loader',
                fallback: 'vue-style-loader'
              })
            }
          }
        }
      },
      {
        test: /vue-preview.src.*?js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(jpg|png|bmp|jpeg|eot|svg|ttf|woff|woff2|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096, //4096字节以上生成文件，否则base64
              name: '[hash:8]-[name].[ext]'//hash表示每张图片放一张八位的哈希值
            }
          }
        ]
      }
      // {
      //     test:/\.less$/,use:[
      //     {loader:'style-loader'},
      //     {loader:'css-loader'}
      //     {loader:'less-loader'}
      //     ]
      // }
      // ,{
      //     test: /\.(jpg|png|svg|ttf|woff|woff2|gif)$/,
      //     loader: 'url-loader',
      //     options: {
      //         limit: 4096, //4096字节以上生成文件，否则base6
      //         name: '[name].[ext]'
      //     }
      // }
    ]
  },//模块配置
  plugins: [
    //清除Html插件
    new CleanWebpackPlugin(
      ['./build']
    ),
    //打包html插件
    new HtmlWebpackPlugin({
      template: path.join(__dirname,'./src/index.html'),
      title: '我不是作者',
      // minify:{
      //     removeAttributeQuotes:true,//把双引号删掉
      //     collapseWhitespace:true,//删除空格
      // },
      // hash:true
      filename:'index.html'//指定生成页面的名字

    }),
    new webpack.HotModuleReplacementPlugin(),//启动hot的第三步
    new ExtractTextWebpackPlugin({
      filename: 'index.css'
    }),
    new VueLoaderPlugin()
    // new MiniCssTractPlugin({
    //     filename:'index.css'
    // })
  ],//插件的配置
  mode: 'development',//可以更改模式
  // resolve:{
  //   alias: {
  //     'vue$':'vue/dist/vue.js' //修改vue被导入时的路径
  //   }
  // },//配置解析
}
//1.在webpack中如何安装配置开发服务器 webpack-dev-server
//2.webpack插件 将html打包到build下可以自动引入js