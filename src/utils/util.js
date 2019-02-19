import http from '../api/index';
String.prototype.replaceAll = function(s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2); // g全局
};
String.prototype.trim=function()
{
  var str = this;
  str = str.replace(/^(\s|\u00A0)+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
};
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

let utils = {
  getScroll (top) {
    let ret = window['page' + (top ? 'Y' : 'X') + 'Offset']
    let method = 'scroll' + (top ? 'Top' : 'Left')
    if (typeof ret !== 'number') {
      var d = window.document
      // ie6,7,8 standard mode
      ret = d.documentElement[method]
      if (typeof ret !== 'number') {
        // quirks mode
        ret = d.body[method]
      }
    }
    return ret
  },
  getOffset (element, container = document.body) {
    const elRect = element.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const clientTop = element.clientTop || container.clientTop || 0
    const clientLeft = element.clientLeft || container.clientLeft || 0
    let top, left

    if (container === document.body) {
      top = this.getScroll(true)
      left = this.getScroll()
    } else {
      top = container.scrollTop - containerRect.top
      left = container.scrollLeft - containerRect.left
    }

    return {
      top: elRect.top + top - clientTop,
      left: elRect.left + left - clientLeft,
      right: elRect.right + left - clientLeft,
      bottom: elRect.bottom + top - clientTop
    }
  },
  getCloudType (data) {
    if (data == '1') {
      return vm.$t('config.cluster.tplStandCloud');
    } else if (data == '2') {
      return vm.$t('config.cluster.tplMicroCloud');
    } else {
      return '--';
    }
  },
  getCloudStatus (data) {
    return this.setTdStatus('config.cluster.initStatus',{
        'success': [2],
        'warning': [1,100],
        'error': [0,9,101]
    }, data,'-');
  },
  /**
   * @Author: wangjing9
   * @Date: 2018-03-01
   * @Desc: 容量单位转换
   */
  unitChange (data) {
    let unitStr = "0";
    if(data !=null && data != ""){
      if(data < 1048576)//1Tb
        unitStr = this.changeTwoDecimal_f2(data,1024)+"(GB)";
      else if( data >= 1048576 && data < 1073741824 ) //1PB
        unitStr = this.changeTwoDecimal_f2(data,1024*1024)+"(TB)";
      else if ( data >= 1073741824 && data < 1099511627776 ) //1EB
        unitStr = this.changeTwoDecimal_f2(data,1024*1024*1024)+"(PB)";
      else
        unitStr = this.changeTwoDecimal_f2(data,1024*1024*1024*1024)+"(EB)";
    }
    return unitStr;
  },
  //确定容量单位取GB还是TB
  confirmUnit (arr) {
  //取容量最小值，来确定容量单位是GB还是TB
    let unit = 'GB',
        division = 1;

    let caps = Object.keys(arr).map(function (key) {
      return arr[key];
    });

    if ( Math.min.apply(null,caps) > 1024 ) {
      unit = 'TB';
      division = 1024;
    }

    return {
      unit : unit,
      division: division
    }
  },
  //保留两位小数
  toFixed2 (num) {
    return Math.round(num * 100) / 100;
  },
  changeTwoDecimal_f2(x, divisor)
  {
    if(x == 0) {
      return '0';
    }
    x = x/divisor;

    var f_x = Math.round(x*100)/100;

    if (isNaN(f_x))
    {
      return false;
    }
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0)
    {
      pos_decimal = s_x.length;
      s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2)
    {
      s_x += '0';
    }
    if(s_x == '0.00') {
      s_x = '0';
    }

    return s_x;
  },
  /**
   * 获取节点在线状态
   * @author Stefan.Loo
   * @param data
   * @returns {string}
   */
  getOnlineState (data) {
    return this.setTdStatus('config.common.tplOnlineState',{
      'success': [1],
      'error': [0]
    }, data, '-');
  },

  /**
   * 节点运行状态
   * @author Stefan.Loo
   * @param data
   * @returns {string}
   */
  getRunningState (data) {
    return this.setTdStatus('config.common.tplRunningState',{
      'success': [1],
      'error': [2,3]
    }, data, '-');
  },

  /**
   * 显示业务/数据IP
   * @param businessIP
   * @param dataIP
   * @returns {string}
   */
  showNodeAllIP (businessIP, dataIP) {
    return this.tplDoNull(businessIP, '0.0.0.0') + '/' + this.tplDoNull(dataIP, '0.0.0.0');
  },

  isInArray (arr, value) {
    for(var i = 0; i < arr.length; i++){
      if(Number(value) === arr[i]){
        return true;
      }
    }
    return false;
  },
  /**
   * 重构速度
   * @author luzhou
   * @param data
   * @returns {string}
   */
  getRebuildSpeed(data) {
    if (data == '1') {
      return '<span class="s-error"><i class="i-error"></i>'+vm.$t('config.common.tplLow')+'</span>';
    } else if (data == '2') {
      return '<span class="s-info"><i class="i-info"></i>'+vm.$t('config.common.tplMedium')+'</span>';
    } else if (data == '3') {
      return '<span class="s-success"><i class="i-success"></i>'+vm.$t('config.common.tplHigh')+'</span>';
    } else if (data == '4') {
      return '<span class="s-success"><i class="i-success"></i>'+vm.$t('config.common.tplFullSpeed')+'</span>';
    } else {
      return '-';
    }
  },

  /**
   * 显示覆盖策略
   * @author Stefan.Loo
   * @param coverType
   * @returns {string}
   */
  showCoverType (coverType) {
    if (coverType == 0) {
      return '不覆盖';
    } else if (coverType == 1) {
      return '容量覆盖';
    } else if (coverType == 2) {
      return '周期覆盖';
    } else {
      return '-';
    }
  },

  /**
   * 显示域类型
   * @author Stefan.Loo
   * @param data
   * @returns {*}
   */
  showECType (data) {
    if (data == '0') {
      return '分布式EC';
    } else if (data == '1') {
      return '单机EC';
    }
    return '--'
  },

  /**
   * 显示存储周期
   * @author Stefan.Loo
   * @param bucketCycle
   * @returns {string}
   */
  showBucketCycle(bucketCycle) {
    if (bucketCycle == '-1') {
      return '--';
    } else {
      return this.tplDoNull(bucketCycle, '0');
    }
  },

  /**
   * 显示冗余级别
   * @author Stefan.Loo
   * @param row
   */
  showEC(row) {
    let ecN = row['ecN'];
    let ecM = row['ecM'];
    let ecK = row['ecK'];
    return ecN + "+" + ecM + ":" + ecK;
  },
  showECJson(row) {
    let ecN = row['ec_n'];
    let ecM = row['ec_m'];
    let ecK = row['ec_k'];
    return ecN + "+" + ecM + ":" + ecK;
  },

  /**
   * 显示容量
   * @author Stefan.Loo
   * @param bucketSize
   * @param freeSize
   * @returns {string}
   */
  showCapacity (bucketSize, freeSize) {
    return this.tplDoNull(bucketSize, '0') + '/' + this.tplDoNull(freeSize);
  },

  /**
   *  @author Stefan.Loo
   *  @desc 显示覆盖时间
   */
  showOverrideStartTime (overrideStartTime, coverType) {
    if (coverType === '0' || overrideStartTime === '0' || overrideStartTime === '1970-01-01 08:00:00') return '--';
    return this.format(overrideStartTime*1000);
  },

  setTdStatusF (status, text) {
    if (status == 'success'){
      return '<span ><i class="i-success"></i>' + text + '</span>';
    } else if (status == 'error'){
      return '<span><i class="i-error"></i>' + text + '</span>';
    } else if (status == 'warning') {
      return '<span ><i class="i-warning"></i>' + text + '</span>';
    }else if (status == 'warnningLow') {
      return '<span ><i class="i-warnning-low"></i>' + text + '</span>';
    }
  },

  /**
   * @author wangjing9
   * @Date: 2018-02-06
   * @param key-国际化key值  obj-状态定义  status-当前状态值  other-其他选项显示
   */
  setTdStatus (key, obj, status, other){
    let statusIndex;
    let iconName = {
      'success': 'i-success',
      'error': 'i-error',
      'warning': 'i-warning'
    };

    for (let p in obj){
      let statusArr =  obj[p];
      statusIndex = statusArr.findIndex((value, index, arr) => {
        return value == status;
      });

      if (statusIndex != -1){
        let st = statusArr[statusIndex];
        if (st == -1)
          st = '_1';
        return '<span class="s-'+ p +'"><i class="'+ iconName[p] +'"></i>' + vm.$t(key + st) + '</span>';
      }
    }

    if ( statusIndex == -1 ){
      if (other) {
        if( other == 'ct_unknown'){
          return '<span class="s-warning"><i class="i-warning"></i>--</span>';
        } else if (other == '--' || other == '-') {
          return '--';
        } else {
          return '<span class="s-warning"><i class="i-warning"></i>' + vm.$t(key + other) + '</span>';
        }
      } else {
        return '--';
      }
    }

  },
  /**
   * 查询状态值
   * @author wangjing
   * @Date: 2018-02-25
   * @param status--状态值  key--国际化key值
   */
  getQueryStatus (status, key) {
    let obj = {};
    status.forEach(function(v){
      if (v=='-1') {
        obj[v] = vm.$t(key+'_1');
      } else {
        obj[v] = vm.$t(key+v);
      }

    });
    return obj;
  },
  /**
   * 网络IO
   * @author luzhou
   * @param data
   * @returns {*}
   */
  getNetworkIo(data) {
    if (this.checkNull(data)) {
      return "0.00/0.00";
    }
    let array = data.split(":");
    if (array.length == 2) {
      var a1 = this.jsToFixed(array[0]);
      var a2 = this.jsToFixed(array[1]);
      return a1 + "/" + a2;
    } else {
      return "0.00/0.00";
    }
  },
  /**创建DOM元素，并添加属性
   * @author wangjing9
   * @Date: 2018-02-28
   * @param id--容器 tagName--元素标签  values--属性值
   */
  createDom(id, tagName, values){
    let para=document.createElement(tagName);
    let element = document.getElementById(id);

    for (let p in values){
      para.setAttribute( p, values[p]);
    }

    element.appendChild(para);
  },
  /**销毁DOM元素
   * @author wangjing9
   * @Date: 2018-02-28
   * @param id
   */
  removeDom(id) {
    let idObject = document.getElementById(id);
    if (idObject != null)
      idObject.parentNode.removeChild(idObject);
  },
  tplDoNull (data, def) {
    if (typeof def === 'undefined') {
      def = '--';
    }

    if (this.checkNull(data)) return def;

    return data;
  },
  //判断为-值，过滤0值
  checkZeroNull (val,def) {
    if (!val && (val !== 0))
      return def || '-';
    else
      return val;
  },
  isIp (v) {
    if (v === '') return false;
    return /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(v);
  },

  //获取字节长度
  getByteSize (str) {
    let bytesCount = 0;
    for (var i = 0; i < str.length; i++)
    {
      var c = str.charAt(i);
      if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
      {
        bytesCount += 1;
      }
      else
      {
        bytesCount += 2;
      }
    }

    return bytesCount;
  },

// 状态列
  statusTag  (status) {
    return this.setTdStatus('collection.server.status', {
      'success': [0],
      'error': [1,2,3]
    }, status, '-');
  },

  // 状态栏("0 正常/1 异常/2 未知")
  setStatus (full, updateTime, status) {
    if (updateTime) {
      return this.statusTag(status);
    } else { // 未知
      return this.statusTag(1);
    }
  },

// 获取 监控页面服务器页面 -------状态；
  getServerSta (full) {
    if (full.childlist != null) {
      let datas = full.childlist;
      for (let i = 0; i < datas.length; i++) {
        // 判断在线不在线
        // HA模式且为睡眠
        if ((datas[i].name === 'AMS' || datas[i].name === 'CPM') && full.build_type === 2 && datas[0].dev_ser_role_status === '2') {

        } else {
          if (datas[i].online === '0') {
            return "<div class='note'>" + this.setStatus(full, full.min_collect_time, 1) + '</div>';
          }
        }

        // 设备状态
        if (datas[i].dev_status === '2' || datas[i].dev_status === '3') {
          return "<div class='note'>" + this.setStatus(full, full.min_collect_time, 1) + '</div>';
        }

        // 集群
        if (datas[i].name === 'AMS' || datas[i].name === 'OSD' || datas[i].name === 'CVA') {
          if ((datas[i].dev_cluster_status !== '1')) {
            return "<div class='note'>" + this.setStatus(full, full.min_collect_time, 1) + '</div>';
          }
        }
      }
    }

    if (full.sysinfo != null) {
      if (full.sysinfo.mem_usage === null || full.sysinfo.mem_usage === '') {
        return "<div class='note'>" + this.setStatus(full, full.min_collect_time, 1) + '</div>';
      }
    }
  },

  //获取后台时间戳

  format (time,format) {
    if (!time) return '-';
    let formats = format || 'yyyy-MM-dd HH:mm:ss';
    let t = new Date(time);
    let tf = function(i){return (i < 10 ? '0' : '') + i};
    return formats.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
      switch(a){
        case 'yyyy':
          return tf(t.getFullYear());
          break;
        case 'MM':
          return tf(t.getMonth() + 1);
          break;
        case 'mm':
          return tf(t.getMinutes());
          break;
        case 'dd':
          return tf(t.getDate());
          break;
        case 'HH':
          return tf(t.getHours());
          break;
        case 'ss':
          return tf(t.getSeconds());
          break;
      }
    })
  },
  //get请求参数转码
  encodeURI (param) {
    //转码
    let data = encodeURI(param);
    param = encodeURI(data);
    return param;
  },
  // 临时转换IP格式
  convertIP(nodeIp) {
    return nodeIp.replace(/\./ig, '_');
  },
  // 提示框
  alert (text, type, duration) {
    
    // 解决超时显示错误信息的bug
    if (text === 'noLogin') {
      text = '登录超时'
    }  

    return vm.$message({
      showClose: false,
      message: text,
      type: type || 'error',
      duration: duration || 3000
    })
  },

  alert2 ({type = 'info', message, showClose = true, ...options}) {
    vm.$message({
      type,
      message,
      showClose,
      ...options
    })
  },

  /**
   * 确认框
   * @author Stefan.Loo
   * @param callback
   * @param message
   * @param type
   * @param errorCallback
   */
  confirm (callback, message, type, errorCallback) {
    let tip = message || vm.$t('iconCollection.confirm');
    vm.$confirm(tip, vm.$t('iconCollection.tip'), {
      confirmButtonText: vm.$t('iconCollection.sure'),
      cancelButtonText: vm.$t('iconCollection.cancel'),
      type: type || 'warning'
    }).then(() => {
      callback();
    }).catch(() => {
      if (errorCallback) {
        errorCallback();
      }
      console.log("cancel");
    });
  },
  //获取当前年份
  getYear () {
    return new Date().getFullYear();
  },
  /**
   * @Author: wangjing9
   * @Date: 2018-04-11
   * @Desc: 前端设备类型
   */
  tplFrontDeviceType (data) {
    if (data == "0") {
      return 'HIKVISION';
    } else if (data == "1") {
      return 'PANASONIC';
    } else if (data == "2") {
      return 'SONY';
    } else if (data == "3") {
      return 'DAHUA';
    } else if (data == "4") {
      return 'ONVIF';
    } else if (data == "5") {
      return 'PSIA';
    } else if (data == "6") {
      return 'AXIS';
    } else if (data == "7") {
      return 'SAMSUNG';
    } else if (data == "8") {
      return 'PELCO';
    } else if (data == "9") {
      return 'ARECONT';
    } else if (data == "10") {
      return 'VIVOTEK';
    } else if (data == "11") {
      return 'BOSCH';
    } else if (data == "12") {
      return 'CANON';
    } else if (data == "13") {
      return 'ACTi';
    } else if (data == "14") {
      return 'INFINOVA';
    } else if (data == "15") {
      return 'SANYO';
    } else if (data == "16") {
      return 'PROVIDEO';
    } else if (data == "17") {
      return 'DYNACOLOR';
    } else if (data == "18") {
      return 'GRANDEYE';
    } else if (data == "19") {
      return 'NATURE';
    } else if (data == "20") {
      return 'GE105E';
    } else if (data == "21") {
      return 'XUNMEI';
    } else if (data == "100") {
      return 'GB28181';
    } else if (data == "200") {
      return 'ONVIF';
    } else if (data == "300") {
      return 'PSIA';
    } else if (data == "400") {
      return 'EHOME';
    } else if (data == "500") {
      return 'RTSPSTD';
    } else if (data == "10001") {
      return 'HIKCSTOR';
    } else if (data == "10002") {
      return 'CVR';
    } else {
      return data || '--';
    }
  },
  // 取流方式
  TplStreamMode (data) {
    if (data == "0") {
      return '设备';
    } else if (data == "1") {
      return 'URL';
    } else {
      return '--';
    }
  },
  // 页面跳转
  jump (path, dataObj, params) {
    window.path_now = path

    window.vm.$router.push({
      path: path,
      query: dataObj,
      params: params
    })
  },

  // 刷新路由加随机数公共方法
  refCurPage (route) {
    let queryData = {};
    for ( let p in route.query) {
      queryData[p] = route.query[p];
    }
    queryData.v = +new Date();

    //菜单点击
    this.jump(route.path,queryData);//保证每次点击路由的query项都是不一样的，确保会重新刷新view
  },

  //截取数据为数组形式分行展示
  setDes (str,split) {
    if (this.checkNull(str)) {
      return '--';
    }
    let arr = str.split(split || ',');
    let html = '';
    arr.forEach(function (v) {
      html += '<div style="line-height:18px;">【' + v + '】</div>';
    });
    return html;
  },

  //存储数据至临时数据库
  set (key, value){
    window.localStorage.setItem(key, value);
  },

  //从临时数据库中读取
  get (key) {
    return window.localStorage[key];
  },
  /**
   * @Author: wangjing9
   * @Date: 2018-01-29
   * @Desc: 获取滚动条距离顶端的距离
   */
  getScrollTop () {
    let scrollPos;
    if (window.pageYOffset) {
      scrollPos = window.pageYOffset; }
    else if (document.compatMode && document.compatMode != 'BackCompat')
    { scrollPos = document.documentElement.scrollTop; }
    else if (document.body) { scrollPos = document.body.scrollTop; }
    return scrollPos;
  },
  /**
   * @Author: wangjing9
   * @Date: 2018-02-05
   * @Desc: 深度复制
   */
  extendDeep (parent, child) {
    child = child || {};
    for(var i in parent) {
      if(parent.hasOwnProperty(i)) {
    //检测当前属性是否为对象
        if(typeof parent[i] === "object") {
    //如果当前属性为对象，还要检测它是否为数组
    //这是因为数组的字面量表示和对象的字面量表示不同
    //前者是[],而后者是{}
          child[i] = (Object.prototype.toString.call(parent[i]) === "[object Array]") ? [] : {};
    //递归调用extend
          this.extendDeep(parent[i], child[i]);
        } else {
          child[i] = parent[i];
        }
      }
    }
    return child;
  },
  /**
   * @Author: wangjing9
   * @Date: 2018-02-09
   * @Desc: 显示全局遮罩
   */
  showMask (txt) {
     vm.$store.dispatch('setMask', txt || true);
  },
  /**
   * @Author: wangjing9
   * @Date: 2018-02-09
   * @Desc: 隐藏全局遮罩
   */
  hideMask () {
     vm.$store.dispatch('setMask', false);
  },
  /**
   * @Author: wangjing9
   * @Date: 2018-05-08
   * @Desc: 数字长度判断
   */
  compareNum (a, b, value,unit) {
    let result = '';
    if (/\D/.test(value)) {
      result = '请输入'+a+'-'+b+ (unit || '' )+'之间的整数。';
    } else {
      if (value < a || value > b) {
        result = '请输入'+a+'-'+b+ (unit || '') +'之间的整数。';
      }
    }

    return result;
  },

  /**
   * @Author: wangjing9
   * @Date: 2018-02-11
   * @Desc: 查询标记tag标签生成
   * @Param: txt--查询字段名称  form--查询字段值  tags--查询标签
   */
  setQueryTags (txt, form, tags){
    let tagsEnd = tags;
    for (let p in txt){
      if (form[p]){
        tagsEnd.push({
          name: p,
          value: txt[p] + ' : ' + (this[p] ? this[p][this.queryForm[p]] : this.queryForm[p])
        })
      }
    }
  },
  // 设置button按钮颜色
  setTdStatusBtn (status, text) {
    if (status == 'success'){
      return '<span class="doSuccess">' + text + '</span>';;
    } else if (status == 'error'){
      return '<span class="error">' + text + '</span>';
    } else if (status == 'warning') {
      return '<span class="warning">' + text + '</span>';
    }else if (status == 'warnningLow') {
      return '<span class="warnningLow">' + text + '</span>';
    }
  },
  /**
   * @Author: wangjing9
   * @Date: 2018-03-01
   * @Desc: 设备类型
   */
  getDevType (type) {
    let result = vm.$t('alarm.devType.' + type);
    if (result.indexOf('.') != '-1')
      type = 'other';

    return vm.$t('alarm.serverType.' + type);
  },
  /**
   * @Author: wangjing9
   * @Date: 2018-03-07
   * @Desc: 日期判断今天昨天
   */
  compareDate (date, isDate) {
    let today = new Date().getTime();

    today = this.format(today);
    today = today.split(' ')[0];

    let t_d = parseInt(today.replaceAll('-',''));
    let d_d = parseInt(date.replaceAll('-',''));

    if (t_d == d_d) {
      return isDate ? '<s style="text-decoration:none;color:#4cb40c">'+vm.$t('alarm.common.today') + '</s>' : date.split(' ')[1];
    } else if ( t_d - d_d == 1 ){
      return '<s style="text-decoration:none;color:#4cb40c">'+vm.$t('alarm.common.yesterday') + '</s>' + (isDate ? '' : '<br/>' + date.split(' ')[1]);
    } else {
      return date;
    }
  },
  /**
   * @Author: wangjing9
   * @Date: 2018-03-14
   * @Desc: 实时刷新
   */
  reltimeRef (url, table, callback) {
    vm.$confirm('刷新数据会耗时较长，需耐心等待，确定刷新当前数据？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'question'
    }).then(() => {
      this.showMask();
      http.getRequest(url, 'post', {'cloudId': table.queryForm.cloudId || ''}, 120000)
        .then(res => {
          this.hideMask();
          callback && callback();
          if (res.status == true) {
            this.alert('刷新成功', 'success');
            table.getData();
          } else {
            this.alert('刷新失败');
          }
        });
    });
  },

  //冒泡排序算法
  bubbleSort:function( valueStr , labelStr , key ){
    //冒泡排序算法

    var i = valueStr.length;

    while( i > 0 ){
      for( let j=0; j<i-1; j++ ){
        var oldVal,newVal,temVal;

        oldVal = valueStr[j] || 0;
        newVal = valueStr[j+1] || 0;

        /*升序*/
        if(  oldVal > newVal){
          temVal = valueStr[j];
          valueStr[j] = valueStr[j+1];
          valueStr[j+1] = temVal;

          temVal = labelStr[j];
          labelStr[j] = labelStr[j+1];
          labelStr[j+1] = temVal;

          temVal = key[j];
          key[j] = key[j+1];
          key[j+1] = temVal;
        }

      }
      i--;
    }

    return {
      valueStr: valueStr,
      labelStr: labelStr,
      key: key
    }
  },
  /**
   * @Author: wangjing9
   * @Date: 2018-03-15
   * @Desc: post方式打开新窗口
   */
  openPostWindow (url,name,obj) {
      let tempForm = document.createElement("form");

      tempForm.id="tempForm1";
      tempForm.method="post";
      tempForm.action=url;
      tempForm.target="_self";

      for ( let p in obj ){
        var hideInput = document.createElement("input");
        hideInput.type="hidden";
        hideInput.name= p;
        hideInput.value= obj[p];
        tempForm.appendChild(hideInput);
      }

      if(window.addEventListener) {
        tempForm.addEventListener("onsubmit",function(){ openWindow(name); });
      } else if(window.attachEvent){
        tempForm.attachEvent("onsubmit",function(){ openWindow(name); });
      }
      document.body.appendChild(tempForm);

      tempForm.submit();
      document.body.removeChild(tempForm);

  },
  node (x, y, img,scene,text) {
    let node = new JTopo.Node(text);
    node.setImage(require(`index@/assets/images/${img}.png`), true);
    node.setLocation(x, y);
    node.font = "24px Consolas";
    node.fontColor = '51,153,255';
    node.textPosition = 'Bottom_Left';
    scene.add(node);
    return node;
  },
  linkNode (scene,nodeA, nodeZ, f,stroke) {
    let link;
    if (f) {
      link = new JTopo.FoldLink(nodeA, nodeZ);
    } else {
      link = new JTopo.Link(nodeA, nodeZ);
    }

    if (stroke) {
      link.strokeColor = stroke.color;
      link.dashedPattern = 5;
    }
    // link.strokeColor = '0,0,0';
    // link.lineWidth = 1;
    link.direction = 'vertical';
    scene.add(link);
    return link;
  },
  // 判断空
  checkNull (v) {
    if (v === null || v === undefined || v === '' || v === '0' || v === 0 || v === false) return true;
    return false;
  },
  // 四舍五入
  jsToFixed (data) {
    if (this.checkNull(data)) {
      return "0.00";
    }
    let num = new Number(data);
    return num.toFixed(2);
  },

  isRepeated (arr) {
    let hash = {};
    for (let i in arr) {
      if (hash[arr[i]]) {
        return true;
      }
      hash[arr[i]] = true;
    }
    return false;
  },

  /**
   * @author Stefan.Loo
   */
  mbToTb (data) {
    let digit = 2;
    if (this.checkNull(data)) return '0';
    if (!(/^-?\d+$/i.test(data))) return '0';
    let v = parseInt(data);
    if (v < 1024) return '0';
    let v1 = data / (1024 * 1024);
    return v1.toFixed(digit)
  },

  /**
   * @author Stefan.Loo
   * @param data
   * @returns {string}
   */
  isNumNull (data) {
    if (this.checkNull(data)) return '0'
    return data
  },

  isInteger (value) {
    if (/\D/.test(value)) {
      return false;
    } else {
      return true;
    }
  },
  //生成图表公共方法
  commonPie(data,no) {
    let label = [], value=[];

    if (!Object.keys(data).length) {
      label =[0];
      value = [0];
    }

    for (let p in data) {
      value.push(data[p]);
      if (no) {
        label.push(p);
      } else {
        label.push(p + ":" + data[p] + '个');
      }

    }

    return {
      label: label,
      value: value
    }
  },

//判断国际化key--wangjing9
  setI18nVal ( data , val) {
    if (data.indexOf('.') != data.lastIndexOf('.')){
      return val || '--';
    } else {
      return data;
    }
  },
  /**
   * @author Stefan.Loo
   * @param data
   * @returns {string}
   */
  isStrNull (data) {
    if (this.checkNull(data)) return '--'
    return data
  },

  /**
   * 验证EC类型
   * @author Stefan.Loo
   * @param ecN
   * @param ecM
   * @param ecK
   * @returns {boolean}
   */
  validateEC (ecN, ecM, ecK) {
    let result = false;
    let regExp = /\D/;
    if (ecN === '' || ecM === '' || ecK === '') {
      result = '请输入必填项';
    } else if (regExp.test(ecN) || regExp.test(ecM) || regExp.test(ecK)) {
      result = '请输入正整数';
    } else {
      ecN = Number(ecN);
      ecM = Number(ecM);
      ecK = Number(ecK);
      if ((ecN+ecM) > 30) {
        result = 'N+M不能大于30';
      } else if (ecN != 1) {
        if (ecN < ecM) {
          result = 'N不等于1, N必须大于等于M';
        } else {
          if (ecM < ecK) {
            result = 'N不等于1, 并且N大于等于M, 则M必须大于等于K';
          }
        }
      }
    }
    return result;
  },

  flatten (items = [], key) {
    return [].concat(
      ...items.map(item => [
        item,
        ...flatten(item[key], key),
      ]),
    );
  },

  isIE () {
    return (
      /MSIE (\d+\.\d+);/.test(navigator.userAgent) ||
      ~navigator.userAgent.indexOf('Trident/')
    );
  },

  getIPPrefix (ip) {
    let lastIndex = ip.lastIndexOf(".");
    return ip.substr(0, lastIndex);
  },

  showMdsOnline (online, deployMode, haState) {
    if (deployMode == '2' && haState == '2') { // HA模式，睡眠状态显示-
      return '-';
    }
    return this.getOnlineState(online);
  },

  /**
   * 显示节点类型
   * @author Stefan.Loo
   * @param nodeType
   * @returns {*}
   */
  showNodeType (nodeType) {
    if (nodeType === '1') {
      return '标准云管理节点';
    } else if (nodeType === '2') {
      return '微视云管理节点';
    }else if (nodeType === '3') {
      return '存储节点';
    } else {
      return '--';
    }
  },

  /**
   * 显示部署模式
   * @author Stefan.Loo
   * @param data
   * @returns {*}
   */
  showDeployType (data) {
    if (data == 2) {
      return "HA";
    } else if (data == 3) {
      return "集群";
    } else if (data == 1) {
      return "单机";
    } else {
      return '--';
    }
  },

  showOsdStatus (status) {
    return this.setTdStatus('config.osd.nodeStatus', {
      'success': [1],
      'error': [2,3]
    }, status, '-');
  },

  showDevIP (rowData) {
    if (rowData['stream_mode'] == '1') {
      return this.tplDoNull(rowData['dev_ip']);
    } else {
      return rowData['dev_ip'] + ':' + rowData['dev_port'];
    }
  },
  //录像计划接入状态
  showAccessStatus (status) {
    return this.setTdStatus('config.cameraReal.accessStatus', {
      'error': [0],
      'success': [1],
      'warning': [2]
    }, status, '-');
  },
  //录像计划录像状态
  showRecordStatus (status) {
    return this.setTdStatus('config.cameraReal.recordStatusTable', {
      'error': [0,2,3,4],
      'success': [1]
    }, status, '-');
  },
  //录像计划布防状态
  showAlarmStatus (status) {
    return this.setTdStatus('config.cameraReal.alarmStatus', {
      'error': [0],
      'success': [1,-1]
    }, status, '-');
  },
  /**
   * 码流类型
   * @param type
   * @returns {*}
   */
  showStreamType (type) {
    return this.setI18nVal(vm.$t('config.cameraReal.streamType' + type));
  },

  /**
   * 网络连接状态
   * @param status
   * @returns {*}
   */
  showConnectStatus (status) {
    return this.setTdStatus('config.network.connectStatus', {
      'error': [0],
      'success': [1]
    }, status, '-');
  },

  /**
   * 绑定模式
   * @param mode
   * @returns {*}
   */
  showBindingMode (mode) {
    return this.setI18nVal(vm.$t('config.network.bindingMode' + mode));
  },

  /**
   * 网口类型
   * @param type
   * @returns {*}
   */
  showNIType (type) {
    return this.setI18nVal(vm.$t('config.network.networkInterfaceType' + type));
  },

  /**
   * 显示组ID
   * @param groupID
   * @returns {*}
   */
  showGroupID (groupID) {
    if (groupID == '') {
      return '--';
    }
    return groupID;
  },

  /**
   * 刷新云列表控件
   */
  refreshCloud (delId) {
    http.getRequest('/config/cloud/list', 'post', {pageNo: 1, pageSize: 100}).then(res => {
      if (res.status) {
        let list = res.data.list;
        let result = [];
        let hisCloud = [];

        list.forEach(function(v,i) {
          result[i] = {};
          result[i].id = v.id;
          result[i].name = v.cloudName;
          result[i].mode = v.deployMode;
        });
        //历史记录
        if (window.sessionStorage.clouds) {
          hisCloud = JSON.parse(window.sessionStorage.clouds);
        } else {
          hisCloud = result.slice(0,10);
        }

        vm.$store.dispatch('setCloud', result);
        result.forEach(function(c1){
          let indexC = hisCloud.findIndex((value, index, arr) => {
            return value.id == c1.id;
          });

          if (indexC == -1) {
            hisCloud.push(c1);
            window.sessionStorage.setItem('clouds',JSON.stringify(hisCloud));
          }
        });

        //删除云的情况
        if (delId) {
          let indexDel = hisCloud.findIndex((value, index, arr) => {
            return value.id == delId;
          });
          hisCloud.splice(indexDel,1);
          window.sessionStorage.setItem('clouds',JSON.stringify(hisCloud));
        }
      }
    });
  },

  //保存状态值至缓存
  saveStorage (obj) {
     for (var key in obj) {
       window.localStorage.setItem(key, typeof(obj[key]) == 'object' ? JSON.stringify(obj[key]) :obj[key]);
       vm.$store.state[key] = obj[key];
     }
  },

  //获取风险验证的方法
  getRiskPassVali( value , UserName/*用户名的值*/ ,valiTypeReset/*登录用户判断处理*/){
    /*风险密码的判断*/
    let flag = false;

    //只包含4类字符中的任意一类
    var num = 0;

    for ( var p in valiTypeReset ){
      if ( valiTypeReset[p].test(value) )
        num++;
    }

    if ( num <= 1 )
      flag = false;
    else
      flag = true;

    //密码和用户名一样
    if ( value == UserName)
      flag = false;

    //密码是用户名的倒写
    if ( value ==  (UserName && UserName.split("").reverse().join("")))
      flag = false;

    return flag;
  },

  //密码强度
  getNum (value,valiTypeReset) {
    let num = 0;

    for ( let p in valiTypeReset ){
      if ( valiTypeReset[p].test(value) )
        num++;
    }
    return num;
  },

  //取流方式为rstp方式通道号为--
  getChannel (row, column, cellValue) {
    if (row.ip.indexOf('/') != -1) {
      return '--'
    } else {
      return cellValue;
    }
  },


  //存储卷相关
  //格式化状态
  getInitStatus (status) {
    return this.setTdStatus('collection.volume.initSta',{
      'success': [6],
      'warning':[2,3,5],
      'error': [1,4]
    }, status,'-');
  },

  //重构状态
  getRebuildStatus (status) {
    return this.setTdStatus('collection.volume.rebuildStatus',{
      'success': [0],
      'warning': [1,2,3]
    }, status,'-');
  },

  //设备状态
  getVolStatus (status) {
    return this.setTdStatus('collection.volume.devStatus',{
      'success': [1],
      'warning':[2],
      'error': [8]
    }, status,'-');
  },

  //维护状态
  getMaintStatus (status) {
    return this.setTdStatus('collection.detail.volMaintSta',{
      'success': [0],
      'error': [1]
    }, status,'-');
  },

  //退出登录页
  jumpToLogout () {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('gCloudId');
    window.localStorage.removeItem('gDeployMode');
    window.localStorage.removeItem('gCloudType');
    window.sessionStorage.removeItem('clouds');
    this.alert('登录超时');
    vm.$store.dispatch('setToken', null);
    vm.$router.push({ path: '/login' });
  },

  /**
   * 判断DOM是否包含
   * @param refEle 参考dom元素
   * @param ele 目标元素
   */
  isDomContain (refEle, ele) {
    if (typeof refEle.contains === 'function') {
      return refEle.contains(ele)
    }
    if (typeof refEle.compareDocumentPosition === 'function') {
      return !!(refEle.compareDocumentPosition(ele) & 16)
    }
    let node = ele.parentNode
    do {
      if (node === refEle) {
        return true
      } else {
        node = node.parentNode
      }
    } while (node !== null)
    return false
  },


  //数字校验
  valiInteger (value,range) {
    let result = '';
    if (/\D/.test(value)) {
      result = '请输入'+ range[0] +'-' + range[1] +'之间的整数';
    } else {
      if (value < range[0] || value > range[1]) {
        result = '请输入'+range[0] +'-' + range[1] + '之间的整数';
      }
    }

    return result;
  },

  //上传文件名称的截取
  formatFileName(str) {
    let index = str.lastIndexOf('.'),
      name = str.slice(0,index),
      unit = str.slice(index,str.length),
      lenByte = this.getByteSize(name),
      lenStr = name.length,
      split = 1;

    if (lenByte == lenStr) {
      //英文
      split = 1;
    } else {
      //中文
      split = lenByte / lenStr;
    }

    if (lenByte <= 24) {
      return str;
    } else {
      return name.slice(0,parseInt(24/split) - 3) + '....' + name.slice(name.length-3,name.length) +  unit;
    }
  },

  /**
   * 16位颜色转rgb
   * @param  hexColor 16位制颜色
   * @param  opacity 透明度
   */
  hexToRgb (hexColor, opacity) {
    const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
    hexColor = hexColor.toLowerCase()
    if (hexColor && reg.test(hexColor)) {
      if (hexColor.length === 4) {
        let hexColorNew = '#'
        for (let i = 1; i < 4; i++) {
          const hex = hexColor.slice(i, i + 1)
          hexColorNew += hex + hex
        }
        hexColor = hexColorNew
      }
      const array = []
      for (let i = 1; i < 7; i += 2) {
        array.push(parseInt('0x' + hexColor.slice(i, i + 2)))
      }
      if (opacity) {
        return 'rgba(' + array.join(',') + ',' + opacity + ')'
      } else {
        return 'rgb(' + array.join(',') + ')'
      }
    } else {
      return hexColor
    }
  },

  //判断是否json字符串
  isJSON(str) {
    if (typeof str == 'string') {
      try {
        var obj=JSON.parse(str);
        if(typeof obj == 'object' && obj ){
          return true;
        }else{
          return false;
        }

      } catch(e) {
        console.log('error：'+str+'!!!'+e);
        return false;
      }
    }
  },

  Mb2Gb(data, digit) {
    if (typeof digit == "undefined") {
      digit = 2;
    }

    if (!this.isNumber(data)) return '0';
    if (this.checkNull(data)) return '0';

    var val = parseInt(data) / 1024;

    return val.toFixed(digit);
  },

  // 数字判断
  isNumber(v) {
    if (v == '') return false;

    return /^-?\d+$/i.test(v);
  },

  /**
   * 存储到localStorage
   * @param key 键值
   * @param value 内容
   */
  setStore (key, value) {
    if (!key) return;
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    window.localStorage.setItem(key, value);
  },

  /**
   * 获取localStorage 存储的值
   * @param key 键值
   */
  getStore (key) {
    if (!key) return;
    return window.localStorage.getItem(key);
  },

  /**
   * 删除localstorage
   * @param key
   */
  removeStore (key) {
    if (!key) return;
    window.localStorage.removeItem(key);
  }

};

function openWindow (name) {
  window.open('about:blank',name,'height=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes');
}

export default utils;


