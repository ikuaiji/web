module.exports = {
  publicPath: '',//子目录部署时需要在相对路径下寻找静态资源
  devServer: {
    proxy: 'http://localhost:8081'
  }
}
