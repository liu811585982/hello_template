import { Role, Selector } from 'testcafe'
import getPageUrl from './getPageUrl'
/**
 * 获取登录角色
 * @param {*} {loginUrl = '', redirectUrl = '', userName = '', passWord = ''}
 * @returns
 */
const getLoginRole = ({loginUrl = '', redirectUrl = '', userName = '', passWord = ''}) => {
  return Role(`${loginUrl}/portal`, async t => {
    await t.navigateTo(`${loginUrl}/portal/cas/login/loginPage.do?service=${redirectUrl}`)
    await t.expect(getPageUrl()).contains('loginPage')
    const iptName = Selector('input.ipt-name')
    const iptPswd = Selector('input.ipt-pswd')
    const btnLogin = Selector('.btn-login')
    await t
      .typeText(iptName, userName)
      .typeText(iptPswd, passWord)
      .click(btnLogin)
      .wait(3000)
  }, {preserveUrl: true})
}

export default getLoginRole
