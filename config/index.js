'use strict'
// Template version: 1.2.7
// see http://vuejs-templates.github.io/webpack for documentation.
//const SERVER_IP = 'http://10.192.77.241:5123'; //http://10.192.75.31';
//const SERVER_IP = 'http://10.192.66.11:5123'; //吴
//const SERVER_IP = 'http://10.192.66.206:5123'; //王
//const SERVER_IP = 'http://10.192.66.141:5123'; //卢
//const SERVER_IP = 'http://10.192.66.9:5123';//熊
//const SERVER_IP = 'http://10.192.75.33:5123';
//const SERVER_IP = 'http://10.192.89.59:5123';
//const SERVER_IP = 'http://10.192.66.36:5123'; //刘磊
//const SERVER_IP = 'http://10.192.66.153:5123'; //李世红
//const SERVER_IP = 'http://10.192.66.25:5123'; //彭
// const SERVER_IP = 'http://10.192.71.141:5123'; //集成测试环境
//const SERVER_IP = 'http://10.192.71.186:5123'; // 最新测试环境
//const SERVER_IP = 'http://10.192.83.40:5123' ; 
// const SERVER_IP = 'http://10.192.83.41:5123'; 
const SERVER_IP = 'http://10.192.71.55:5123'; 
const path = require('path')

const basePath = '/'

module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    // test
    proxyTable: {
      '/api': {
        target: SERVER_IP,
        pathRewrite: {'^/api': ''},
        changeOrigin: true
      }
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 9999, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    // devtool: 'eval-source-map',
    devtool: 'source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: basePath,
    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
