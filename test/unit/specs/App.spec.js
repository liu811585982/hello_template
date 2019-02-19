import appInstance from '../../../src/main.js'
import i18n from '../../../src/i18n'
import { el } from '../../../src/i18n/zh_CN'

describe('dolphin check', () => {
  it('is import hui', () => {
    expect(typeof appInstance.$message).to.equal('function')
  })

  it('is import common', () => {
    expect(typeof appInstance.$reg).to.equal('object')
  })

  // 简单测试是否有hui中文语言包，为纳入项目中 xx
  it('is have zh_CN', () => {
    expect(el).to.exist
  })

  it('is use breadcrumb', () => {
    /* eslint-disable no-unused-expressions */
    expect(appInstance.$store.state.userInfo.breadcrumb).to.exist
  })

  it('it import i18n', () => {
    i18n.setLocaleMessage('zh_CN', el)
    i18n.locale = 'zh_CN'
    expect(appInstance.$i18n.messages.zh_CN.colorpicker.confirm).to.equal('确定')
  })
})
