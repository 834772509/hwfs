const path = require("path");
const commonConfig = require("./webpack.base.config");
const { merge } = require("webpack-merge");
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");

module.exports = merge(commonConfig, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "../../../assets"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // Babel预设
            presets: ["@babel/preset-env"],
            // Babel插件
            plugins: [],
          },
        },
      },
    ],
  },
  plugins: [
    // new ParallelUglifyPlugin({
    //   uglifyJS: {
    //     output: {
    //       // 是否保留代码中的注释，默认为保留
    //       comments: false,
    //     },
    //     // 是否在UglifyJS删除没有用到的代码时输出警告信息，默认为false
    //     warnings: true,
    //     compress: {
    //       // 是否删除代码中所有的console语句，默认为false
    //       drop_console: true,
    //       // 是否内嵌虽然已经定义了，但是只用到一次的变量， 默认值false
    //       collapse_vars: true,
    //       // 是否提取出现了多次但是没有定义成变量去引用的静态值，默认为false
    //       reduce_vars: true,
    //     },
    //   },
    // }),
  ],
});
