module.exports = {
  lintOnSave: false,
  pages: {
    index: {
      entry: "src/main.ts", // 入口文件
      title: "washhui", //
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(bin|txt|glb|gltf)$/,
          use: {
            loader: "url-loader",
            options: {
              name: "[name]_[hash].[ext]",
              outputPath: "images/",
              limit: 81920,
            },
          },
        },
      ],
    },
  },
};
