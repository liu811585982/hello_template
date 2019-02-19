import config from './config.js';
import el from './hui.js';

let login = {};
login.name = '智慧运维';
login.username = 'User Name';
login.password = 'Password';
login.btn = 'Login';
login.btnLoad = 'Logging in...';
login.vCode = 'Verification Code';
login.change = '换一张';
login.v1 = 'Please enter the user name.';
login.v2 = 'Please enter the password.';
login.v3 = 'Please enter the verification code.';
login.v4 = '用户或密码错误。';
login.err3 = '用户或密码错误。';
login.err4 = '用户或密码错误。';
login.err5 = 'Please enter the verification code';
login.err6 = '验证码无效';
login.err7 = '验证码超时';
login.err8 = '验证码输入错误，请重新输入。';
login.err9 = '用户或密码错误，请在1小时后登录系统。';
login.err10	=	"用户或密码错误，还剩{x}次机会，请重新输入。";
login.logout = 'Exit';

let pass = {};
pass.title1 = '修改初始化密码';
pass.title2 = 'Modify Password';
pass.tips = 'Please input the password. The password should contain 8 to 16 characters, which should be the combination of at least two types of numeric, lowercase letter, capital letter, and special symbol.'
pass.pass1 = 'Current password';
pass.pass2 = 'New Password';
pass.pass3 = 'Confirm Password';
pass.vali1 = 'Risk';
pass.vali2 = 'Weak';
pass.vali3 = 'Medium';
pass.vali4 = 'Strong';
pass.v1 = 'Please enter the current password.';
pass.v2 = 'Please enter the new password.';
pass.v3 = 'Please re-enter the password.';
pass.v4 = '新密码与当前密码相同。';
pass.v5 = 'The current password is weak.';
pass.v6 = '两次输入密码不一致。';
pass.v7 = '修改密码失败。';
pass.v8 = '非初始化密码修改。';
pass.v9 = '当前密码为初始化密码，请重新输入。';
pass.v10 = '当前密码错误，请重新输入。';
pass.length = '密码长度应为 {x}-{y} 位字符。';
pass.success = 'Edited.';

let menu = {};
menu.main = '首页';
menu.user = '用户中心';
menu.userInfo = '用户信息';
menu.space = '存储空间';
menu.spaceInfo = 'Bucket';
menu.userCount = '用户统计';
menu.countInfo = '基础数据';
menu.log = '日志管理';
menu.logInfo = '操作日志';


menu.cluster = '集群管理';
menu.clusterList = '集群列表';
menu.clusterGroup = '组管理';
menu.clusterGroupAdd = '创建组';
menu.node = '节点管理';
menu.nodeList = '接入节点';
menu.volumes = "存储卷";
menu.domain = '域名管理';
menu.domainList = '域名列表';
menu.cloud = '云存储管理';
menu.cloudList = '云存储列表';
menu.cloudAdd = '创建'
menu.cloudEdit = '修改'
menu.userManagement = '用户管理';
menu.userList = '用户列表';
menu.system = "系统管理";
menu.network = "网络管理";
menu.config = "配置管理";
menu.deployment = '一键部署';

let common = {};
common.index = 'Index';
common.query = '查询'
common.reset = '重置'
common.more = '更多'
common.open = '展开'
common.close = '收起'
common.option = '操作'
common.rangeStr = '长度在 {x} 到 {y} 个字符'
common.rangeNum = '请输入整数,数值范围在 {x} 和 {y}之间'
common.loading = '数据加载中，请稍等...';
let ct_unknown = '未知'

let iconCollection = {};
iconCollection.table = 'Table'
iconCollection.manage = 'Library Manage'
iconCollection.newLib = 'New Library'
iconCollection.allDel = 'Batch Delete'
iconCollection.libName = 'Library Name'
iconCollection.iconType = 'Icon Type'
iconCollection.opration = 'Operation'
iconCollection.del = 'Delete'
iconCollection.name = 'Name'
iconCollection.type = 'Type'
iconCollection.edit = 'Modify'
iconCollection.cancel = 'Cancel'
iconCollection.sure = 'OK'
iconCollection.ok = 'OK';
iconCollection.confirm = 'OK to perform it?'
iconCollection.inputIconName = 'Please enter icon name'
iconCollection.choiceDelLib = 'Please choice delete library'
iconCollection.isDelIconLib = 'Is delete library'
iconCollection.tip = 'tip'
iconCollection.delSuccess = 'Delete Success'
iconCollection.delFail = 'Delete Fail'
iconCollection.addSuccess = 'Create Success'
iconCollection.addSuccessKeepUpload = 'Create Success, Is keeping Upload Icons'
iconCollection.addFailTryAgain = 'Create Fail, Please try again'

let data = {
  config,
  el,
  login,
  pass,
  menu,
  common,
  iconCollection
};
export default  data;
