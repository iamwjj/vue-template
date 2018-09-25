const path = require('path')
const config = require('./index.js')
// vue-loader 15.x版本必须引入这个插件
const vueLoaderPlugin = require('vue-loader/lib/plugin')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: path.join(__dirname, '../src/main.js')
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    module: {
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new vueLoaderPlugin()       // 将其他rules复制并应用到.vue文件相应的语言块。
    ],
    resolve: {
        alias: {
            '@': resolve('src')
        },
        extensions: ['.vue', '.js', '.json']        // 自动解析扩展，import的时候就可以不用带上扩展名
    }
}