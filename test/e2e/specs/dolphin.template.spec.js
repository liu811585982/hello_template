import {Selector} from 'testcafe'

fixture('dolphin_template')
  .page('http://localhost:8080/hello')

test('is import dolphin_common UI', async t => {
  const pageHeaderSpan =  Selector('.page .page-header .el-breadcrumb span')
  const pageHeader =  Selector('.page-header')
  const pageBreadcrumb =  Selector('.page-breadcrumb')
  const elBreadcrumb =  Selector('.page-breadcrumb .el-breadcrumb')
  const pageBody =  Selector('.page-body')
  const pageMain =  Selector('.page-main')
  const pageLoading = Selector('.page-loading')

  await t
    .expect(pageHeaderSpan.exists).ok()
    .expect(pageHeader.getStyleProperty('position')).eql('absolute')
    // .expect(pageHeader.getStyleProperty('padding')).eql('0px 16px')
    .expect(pageBreadcrumb.getStyleProperty('height')).eql('47px')
    .expect(elBreadcrumb.getStyleProperty('line-height')).eql('47px')
    .expect(pageBody.getStyleProperty('position')).eql('relative')
    .expect(pageMain.getStyleProperty('position')).eql('relative')
    .expect(pageLoading.exists).notOk()
})