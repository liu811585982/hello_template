module.exports = {
  // 指定一个服务地址，将在该服务下获取接口数据
  host: 'http://10.40.239.201:5000',
  upload: {
    // 上传多语言的目录（基于项目根目录）
    entry: 'src/i18n/zh_CN',
    // EASY TOOL平台的多语言模块ID
    id: '5c246bdab6c0a91158551cf8'
  },
  download: {
    // 下载多语言的目录（基于项目根目录，无需手动创建）
    output: 'static/i18n',
    // EASY TOOL平台的多语言模块ID集合
    ids: [
      '5c246bdab6c0a91158551cf8'
    ]
  }
}