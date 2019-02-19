// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'vue',"vue-i18nstring"
  ],
  // add your custom rules here
  rules: {
    // 判断代码中是否存在中文
    // https://github.com/FlyDreame/eslint-plugin-vue-i18n
    "vue-i18nstring/no-chinese-character-vue": 1,
    "vue-i18nstring/no-chinese-character-js": 1,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,
    
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
  }
}
