import config from './config.js';
import el from './hui.js';

let login = {};
login.name = '加速接入集群管理平台';
login.username = '用户名';
login.password = '密码';
login.btn = '登 录';
login.btnLoad = '登录中...';
login.vCode = '验证码';
login.change = '换一张';
login.v1 = '请输入用户名。';
login.v2 = '请输入密码。';
login.v3 = '请输入验证码。';
login.v4 = '用户或密码错误。';
login.err3 = '用户或密码错误。';
login.err4 = '用户或密码错误。';
login.err5 = '请输入验证码。';
login.err6 = '验证码无效。';
login.err7 = '验证码超时。';
login.err8 = '验证码输入错误，请重新输入。';
login.err9 = '用户或密码错误次数超限，请在1小时后登录系统。';
login.err10	=	"用户名或密码错误，还剩{x}次机会，请重新输入。";
login.logout = '退出';

let pass= {};
pass.title1 = '修改初始化密码';
pass.title2 = '修改密码';
pass.tips = '请输入密码，8-16位字符，至少包含数字，小写字母，大写字母，特殊符号中的两类。';
pass.pass1 = '当前密码';
pass.pass2 = '新密码';
pass.pass3 = '确认密码';
pass.vali1 = '风险';
pass.vali2 = '弱';
pass.vali3 = '中';
pass.vali4 = '强';
pass.v1 = '请输入当前密码。';
pass.v2 = '请输入新密码。';
pass.v3 = '请再次输入密码。';
pass.v4 = '新密码与当前密码相同，请重新输入。';
pass.v5 = '当前密码为风险密码。';
pass.v6 = '两次输入密码不一致。';
pass.v7 = '修改密码失败。';
pass.v8 = '非初始化密码修改。';
pass.v9 = '当前密码为初始化密码，请重新输入。';
pass.v10 = '当前密码错误，请重新输入。';
pass.length = '密码长度应为 {x}-{y} 位字符。';
pass.success = '修改成功。';

const menu = {};

menu.main = '首页'
menu.demo = '示例模块'
menu.demoIndex = '索引页'
menu.demoChild = '子页面'

const common = {};
common.index = '序号'
common.query = '查询'
common.reset = '重置'
common.more = '更多'
common.open = '展开'
common.close = '收起'
common.option = '操作'
common.rangeStr = '长度在 {x} 到 {y} 个字符'
common.rangeNum = '请输入整数,数值范围在 {x} 和 {y}之间'
common.loading = '数据加载中，请稍等...'
const ct_unknown = '未知'

const iconCollection = {};
iconCollection.table = '表格'
iconCollection.manage = '图标库管理'
iconCollection.newLib = '新建图标库'
iconCollection.allDel = '批量删除'
iconCollection.libName = '图标库名称'
iconCollection.iconType = '图标类型'
iconCollection.opration = '操作'
iconCollection.del = '删除'
iconCollection.name = '名称'
iconCollection.type = '类型'
iconCollection.edit = '修 改'
iconCollection.cancel = '取 消'
iconCollection.sure = '确 定'
iconCollection.ok = '确认';
iconCollection.confirm = '确定执行此操作？'
iconCollection.inputIconName = '请输入图标库名称'
iconCollection.choiceDelLib = '请选择要删除的图标库'
iconCollection.isDelIconLib = '是否删除图标库'
iconCollection.tip = '提示'
iconCollection.delSuccess = '删除成功'
iconCollection.delFail = '删除失败'
iconCollection.addSuccess = '添加成功'
iconCollection.addSuccessKeepUpload = '添加成功，是否继续前往上传图标'
iconCollection.addFailTryAgain = '添加失败，请重试'

export {
  config,
  el,
  login,
  pass,
  menu,
  common,
  iconCollection
}
