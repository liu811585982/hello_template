let data = {
  validator:{},
  log: {},
  bucket:{},
  node: {},
  common:{},
  cluster:{},
  cloud:{},
  network: {}
};

// ====================== Common ======================
data.common.innerServerError      = '服务器内部错误。';
data.common.requestTimeout        = '请求超时。';
data.common.tbAction              = '操作';
data.common.tbNodeIp              = '节点IP';
data.common.tbOnline              = '在线状态';
data.common.tplOnlineState1       = '在线';
data.common.tplOnlineState0       = '离线';
data.common.tbRunningState        = '运行状态';
data.common.tplRunningState1      = '正常';
data.common.tplRunningState2      = '异常';
data.common.tplRunningState3      = '不可用';
data.common.tplNormal             = '正常';
data.common.tplAbnormal           = '异常';
data.common.tplUnavailable        = '不可用';
data.common.tplLow                = '低';
data.common.tplMedium             = '中';
data.common.tplHigh               = '高';
data.common.tplFullSpeed          = '全速';
data.common.tbConsumption         = '消耗[CPU/Memory]（%）';
data.common.tbNetworkIO           = '网络[in/out]（Mbps）';
data.common.tbVersion             = '版本';
data.common.btnOK                 = '确 定';
data.common.btnCancel             = '取 消';
data.common.confirm_on            = '确定开启？'
data.common.confirm_off           = '确定关闭？'
data.common.btnSet                = '设置';
data.common.noChange              = '修改信息没有变化。';

// ====================== 校验 ======================
data.validator.required = '该输入项为必填项。';
data.validator.selectData = '请选择1条数据。';
data.validator.string0 = '存在不支持的特殊字符（例如转义符，单双引号等）。';
data.validator.ip = '请输入IP地址。';
data.validator.validIp = '请输入合法IP地址。';
data.validator.passwordInvalid = '密码设置不符合要求。';
data.validator.rePassword = '两次输入的密码不一致, 请重新输入。';
data.validator.dbCache = '请输入数据库缓存最大值。';
data.validator.nodeAdded = '节点已添加。';
data.validator.hostname = '请输入主机名。';
data.validator.validHostname = '请输入合法主机名（3~15位字符，包含小写字母、数字及中划线，只能以字母开头，不能以中划线结尾，且不能有空格）。';
data.validator.cloudId = '请输入云ID。';

data.validator.cloudName = '请输入云名称。';
data.validator.DRServerAndBKDRServer = 'DRServer和BKDRServer不能在同一个节点上。';
data.validator.NNodeAndBKNNode = 'NNode和BKNNode不能在同一个节点上。';
data.validator.utils_string1 = '请输入有效的字符（可以使用字母、数字、中划线及下划线）。';

data.bucket.ruleStatus1 = '启用';
data.bucket.ruleStatus0 = '停用';

data.log.username ='操作用户';
data.log.role = '角色';
data.log.client_ip = '客户端IP';
data.log.server_ip = '操作IP';
data.log.create_time = '操作时间';
data.log.describe = '操作详情';
data.log.export = '导出';
data.log.expLog = '导出操作日志';

data.alarmStatus0        = '正常';
data.alarmStatus1        = '异常';
data.alarmStatus_1       = '撤防';

data.node.onlineState1 = '在线';
data.node.onlineState0 = '离线';

data.node.deviceStatus1 = '正常';
data.node.deviceStatus2 = '同步';
data.node.deviceStatus3 = '恢复';
data.node.deviceStatus4 = '重构';
data.node.deviceStatus5 = '降级';
data.node.deviceStatus6 = '自检';
data.node.deviceStatus7 = '修复';
data.node.deviceStatus8 = '不可用';
data.node.deviceStatus16 = '丢失';

data.node.formatStatus1 = '未格式化';
data.node.formatStatus2 = '正在格式化';
data.node.formatStatus3 = '等待恢复数据库';
data.node.formatStatus4 = '正在恢复数据库';
data.node.formatStatus5 = '恢复数据库失败';
data.node.formatStatus6 = '正在扫描';
data.node.formatStatus7 = '已格式化';

// ====================== 集群 ======================
data.cluster.formNodeIp = '节点IP';
data.cluster.formVIp = '虚拟IP';
data.cluster.formCloudId = '云ID';
data.cluster.formCloudName = '云名称';
data.cluster.formDbCacheLimit = '数据库缓存最大值（GB）';
data.cluster.formDbCacheLimitTip = '（务必低于单台设备物理内存的 1/2）';
data.cluster.btnCheckAndAdd = '检测并添加';
data.cluster.btnSetTime = '全部校时';
data.cluster.btnRefreshAll = '全部刷新';
data.cluster.btnReviseTime = '校时';
data.cluster.btnRefresh = '刷新';
data.cluster.btnDelete = '删除';
data.cluster.btnCheck = '检测';
data.cluster.btnCreateCluster = '组建集群';
data.cluster.btnInitializeCluster = '初始化';
data.cluster.btnExpand = '扩容';
data.cluster.btnModify = '修改';
data.cluster.btnClose = '关闭';
data.cluster.tbNodeIp = '节点 IP';
data.cluster.tbDeployType = '部署模式';
data.cluster.tbHostname = '主机名';
data.cluster.tbSystemTime = '系统时间';
data.cluster.tbLVSRole = '负载均衡角色';
data.cluster.tbDDBRole = '分布式数据库角色';
data.cluster.tbAction = '操作';
data.cluster.updateHostname0 = '修改主机名失败。';
data.cluster.tbCloudName = '所属云';
data.cluster.tbCloudType = '云类型';
data.cluster.tplStandCloud = '标准云';
data.cluster.tplMicroCloud = '微视云';
data.cluster.tbVip = '虚拟IP';
data.cluster.tbState = 'License状态';
data.cluster.tbCreateTime = '创建时间';
data.cluster.tbEditTime = '修改时间';
data.cluster.tbCloudVersion = '云版本';
data.cluster.initStatus2 = '已初始化';
data.cluster.initStatus0 = '未初始化';
data.cluster.initStatus1 = '正在初始化';
data.cluster.initStatus9 = '初始化失败';
data.cluster.initStatus100 = '改造中';
data.cluster.initStatus101 = '改造失败';
data.cluster.dlgClusterCreated = '已组建集群';
data.cluster.dlgIPInconsistent = 'IP地址不一致';
data.cluster.tbMaxCreateBucket = '创建Bucket最大数';
data.cluster.tbCoverThreshold = '容量覆盖阈值';
data.cluster.tbRebuildSpeed = '重构速度';
data.cluster.tbTimeDiskOffline = '磁盘下线启动重构(分钟)';
data.cluster.tbTimeOsdOffline = '存储节点下线启动重构(分钟)';
data.cluster.dlgCreateCluster0 = '组建集群失败';
data.cluster.setParam = '设置参数';
data.cluster.expandNode = '集群扩容';

data.cluster.status0 = '未初始化';
data.cluster.status1 = '正在初始化';
data.cluster.status2 = '已初始化';
data.cluster.status9 = '初始化失败';
data.cluster.status100 = '集群改造中';
data.cluster.status101 = '集群改造失败';

// 网络管理
data.network.connectStatus1         = '已连接';
data.network.connectStatus0         = '未连接';
data.network.networkInterfaceType1  = '管理网口';
data.network.networkInterfaceType0  = '数据网口';
data.network.bindingMode0           = '平衡轮循环策略';
data.network.bindingMode1           = '主-备份策略';
data.network.bindingMode2           = '平衡策略';
data.network.bindingMode3           = '广播策略';
data.network.bindingMode4           = 'IEEE802.3ad 动态链接聚合';
data.network.bindingMode5           = '适配器传输负载均衡';
data.network.bindingMode6           = '适配器适应性负载均衡';
data.network.setIPCheck1            = '不支持修改管理网口IP。';

data.cloud.deleteCloudMsg = '1、{x}会造成数据丢失，请慎重操作。\n2、通过密码验证才能执行此操作。';

export default data;
