const webpack = require('webpack')
const path = require('path')
const merge  = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const config = require('./index')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const packageConfig = require('../package.json')
const notifier = require('node-notifier')

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',  // 设置开发环境的mode

    devServer: {
        clientLogLevel: 'warning',
        compress: true,  // 开启gzip压缩
        host: config.dev.host,
        port: config.dev.port,
        open: config.dev.autoOpenBrowser,  // 是否自动打开浏览器
        hot: true,  // 启用模块热替换，需添加webpack.HotModuleReplacementPlugin
        noInfo: true  // 隐藏每次启动或保存时命令行输出的bundle信息
    },

    plugins:[
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
})

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            // process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: (severity, errors) => {
                    if (severity !== 'error') return
                    const error = errors[0]
                    const filename = error.file && error.file.split('!').pop()
                    // 桌面通知
                    notifier.notify({
                        title: packageConfig.name,
                        message: severity + ': ' + error.name,
                        subtitle: filename || ''
                    })
                }
            }))

            resolve(devWebpackConfig)
        }
    })
})