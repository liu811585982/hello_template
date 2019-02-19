## 更新日志
### 2.0.1
-  整体结构
  -  增加请求返回0x50102,显示错误页面

### 2.0.0

- 整体结构
  - 优化多语言和样式文件的加载顺序
  - 添加页面加载前的缺省页
  

### 1.1.0
- 单元测试
  - 采用vue-test-utils的工具类去实现，还需在项目中测试
  - 添加karma的polyfill配置
  - 因为要有testing方式，将一些配置 === 'development' 改成了 !== 'production'
  - 海豚技术性验证测试
    + 是否引入了hui (zhangxin14)
    + 是否引入了dolphin_common (zhangxin14)
    + 是否使用了面包削 (zhangxin14)
    + 是否引入了多语言
- E2E测试
  - 完成了对项目的e2e流程测试，主要测试了是否是海豚common的；
- gitignore
  - 保留对config/index的处理，去掉会导致项目刚开始起不来
- api
  - 增加多语言多输入参数方法
- eslint
  - 增加 “判断代码中是否存在中文” eslint的配置 (liumeng 6) https://github.com/FlyDreame/eslint-plugin-vue-i18n


### 1.0.0
- 发布正式版
  - errorpage会出现403和404的，统一在路由里面改了下
  - 应用下面的左侧菜单如果没有权限自动隐藏
  - 皮肤和多语言单独抛出error
  - 多语言工具统一放到build.i18里面