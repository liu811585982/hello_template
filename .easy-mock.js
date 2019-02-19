module.exports = {
  output: "src/api", // 产出到项目下的 api 目录，不用手动创建
  host: "http://10.33.31.96:8899",  // 综合安防easy-mock
  template: "EmptyCup20/api", 
  projects: [
    {
      id: "5a72c2cd92dd612bd4b84404", // 例：58fef6ac5e43ae5dbea5eb53  
      name: "api" // 该项目下的 API 生成之后会被放到 api/{name} 目录下
    }
  ]
}