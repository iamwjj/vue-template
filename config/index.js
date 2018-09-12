const path = require('path')

module.exports = {
    dev: {
        host: 'localhost',  // host
        port: 8080,  // 端口号
        autoOpenBrowser: true,  // 是否自动打开浏览器

        useEslint: true  // 是否开启ESlint
    },
    build: {
        // 打包输出路径
        assetsRoot: path.resolve(__dirname, '../dist')
    }
}