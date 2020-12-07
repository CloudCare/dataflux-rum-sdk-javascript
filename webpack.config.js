const path = require('path')
const mode = process.env.NODE_ENV
const webConfig = {
  entry: './src/index.js',
  devServer: {
    contentBase: path.join(__dirname, 'demo'),
    port: 9000,
    hot: true
  }
}
module.exports = (env, args) => ({
  mode: args.mode,
  devtool: args.mode === 'development' ? 'inline-source-map' : 'false',
  ...webConfig,
  output: {
    filename: 'dataflux-rum.js',
    path:
      args.mode === 'development'
        ? path.resolve(__dirname, 'demo')
        : path.resolve(__dirname, 'dist')
  }
})
