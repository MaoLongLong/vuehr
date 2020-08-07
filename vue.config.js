const proxyObj = {};

proxyObj['/api'] = {
  ws: false,
  target: 'http://localhost:8081',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/',
  },
};

module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: proxyObj,
  },
};
