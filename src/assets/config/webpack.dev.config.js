const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.base.config");

module.exports = merge(commonConfig, {
  mode: "development",
  // 关闭 webpack 性能提示
  performance: {
    hints: false,
  },
  devtool: "eval-cheap-module-source-map",
  devServer: {
    // 设置主机地址
    host: "0.0.0.0",
    // 设置端口
    port: 8080,
    // 是否打开浏览器
    open: false,
    // 配置模块热替换，应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个页面
    hot: true,
    // 配置备用目录，当 Webpack 资源不存在时请求 contentBase 目录的资源
    static: "./public",
  },
});
