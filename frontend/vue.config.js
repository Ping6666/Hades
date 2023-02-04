const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    webSocketServer: false,
    // hot: false,
    // liveReload: false,
  },
  transpileDependencies: true,
})
