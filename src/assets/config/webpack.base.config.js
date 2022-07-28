const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const chalk = require("chalk");

module.exports = {
  target: "web",
  entry: "./src/main.js",
  resolve: {
    // 设置别名
    alias: {
      "@": path.resolve("./src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-withimg-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(jp?g|png|bmp|gif|svg)$/,
        type: "asset/inline",
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true,
      }),
    ],
  },
  plugins: [
    new ProgressBarPlugin({
      format: `build [:bar] ${chalk.green.bold(":percent")} (:elapsed seconds)`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          globOptions: {
            ignore: [
              "**/index.html",
              "**/*.mp4",
              "**/*.mp3",
              "**/*.jpg",
              "**/*.txt",
              "**/*.bin",
            ],
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "网页标题",
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: "index.css" }),
  ],
};
