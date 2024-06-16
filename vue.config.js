const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      // Or any other directory
      mainProcessFile: 'src/main.js',
      // Provide the main process file path
      outputDir: 'dist_electron'
    }
  },
  transpileDependencies: true
})
