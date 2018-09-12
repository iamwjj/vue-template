const config = required('./index.js')

module.exports = {
    entry: {
        app: '../src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        chunkFilename: '[name].js',
    }
}