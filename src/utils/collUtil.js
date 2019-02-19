//import { Loading } from 'element-ui';

const nullplaceholder = '--';//为空处理字符串；
let collutils = {
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

  onLineStatus (data) { // 在线状态--服务器
    if ( ( data.name == "AMS" || data.name == "CPM" )   && data.dev_ser_role_status == '2'){
      return nullplaceholder;
    } else {

      if ( data.name == "NAS" ){
        if ( data.online == "1" ){
          return this.setTdStatusF('success',vm.$t('collection.server.online'));
        } else if ( data.online == "2" ){
          return this.setTdStatusF('error',vm.$t('collection.server.offline'));
        }else{
          return nullplaceholder;
        }
      }else{
        if ( data.online == "1" ){
          return this.setTdStatusF('success',vm.$t('collection.server.online'));
        }else if ( data.online == "0" ){
          return this.setTdStatusF('error',vm.$t('collection.server.offline'));
        }else{
          return nullplaceholder;
        }

      }
    }
  },
  // 设备状态
  devStatus (data) {
    if ( data.dev_status == "0" ){
      return this.setTdStatusF('error',vm.$t("collection.detail.serNotInit"));
    } else if ( data.dev_status == "1" ){
      return this.setTdStatusF('success','正常');
    } else if ( data.dev_status == "2" ){
      return this.setTdStatusF('error',vm.$t("collection.detail.serAbnormal"));
    } else if ( data.dev_status == "3" ){
      return this.setTdStatusF('error',vm.$t("collection.detail.serNotAvail"));
    } else {
      return nullplaceholder;
    }
  },

  clusterRole (data) { //集群角色
    if (  data.name == "AMS" || data.name == "CPM" ) {
      if ( data.dev_ser_role == "1" ){
        return  vm.$t("collection.server.host");//'主机'
      }else if ( data.dev_ser_role == "2" ){
        return  vm.$t("collection.server.slave");//"备机";
      }else{
        return nullplaceholder;
      }
    } else {
      return nullplaceholder;
    }
  },
  roleStatus (data) {
    if (  data.name == "AMS" || data.name == "CPM" ) {
      if ( data.dev_ser_role_status == "1" ){
        return vm.$t("collection.server.work");//""工作";
      }else if ( data.dev_ser_role_status == "2" ){
        return vm.$t("collection.server.sleep");//""睡眠";
      }else if ( data.dev_ser_role_status == "3" ){
        return nullplaceholder;
      }else{
        return nullplaceholder;
      }
    } else {
      return nullplaceholder;
    }
  },
  setTdStatusF (status, text) {
    if (status == 'success'){
      return '<span><i class="i-success"></i>' + text + '</span>';
    } else if (status == 'error'){
      return '<span><i class="i-error"></i>' + text + '</span>';
    } else if (status == 'warning') {
      return '<span ><i class="i-warning"></i>' + text + '</span>';
    }
  },

  clusterStatus (data) { //集群状态
    if (data.name == "AMS" || data.name == "OSD" || data.name == "CVA"){
      if ( data.dev_cluster_status == "1" ){
        return this.setTdStatusF('success',vm.$t('collection.server.inColony'));
      }else if ( data.dev_cluster_status === "0" ){
        return this.setTdStatusF('error',vm.$t('collection.server.notInColony'));
      }else{
        return nullplaceholder;
      }
    } else {

      if(data.name == "NAS"){
        return this.setTdStatusF('success',vm.$t('collection.server.inColony'));
      } else {
        return nullplaceholder;
      }
    }
  },

  clusterRole (data,build_type) { //集群角色
    if ( ( data.name == "AMS" || data.name == "CPM" ) && build_type == "2") {
      if ( data.dev_ser_role == "1" ){
        return  vm.$t("collection.server.host");//'主机'
      }else if ( data.dev_ser_role == "2" ){
        return  vm.$t("collection.server.slave");//"备机";
      }else{
        return nullplaceholder;
      }
    } else {
      return nullplaceholder;
    }
  },
  roleStatus (data,build_type) {
    if ( ( data.name == "AMS" || data.name == "CPM" )  && build_type== "2" ) {
      if ( data.dev_ser_role_status == "1" ){
        return vm.$t("collection.server.work");//""工作";
      }else if ( data.dev_ser_role_status == "2" ){
        return vm.$t("collection.server.sleep");//""睡眠";
      }else if ( data.dev_ser_role_status == "3" ){
        return nullplaceholder;
      }else{
        return nullplaceholder;
      }
    } else {
      return nullplaceholder;
    }
  },

  //获取集群模式
  getCloudType ( cloud_type , deploy_mode ){
    let cloudType = '';
    if (cloud_type == '1') {
      cloudType += vm.$t('collection.server.sCloud');
      if (deploy_mode == '3')
        cloudType += '-'+ vm.$t('collection.server.cluster');
      else
        cloudType += '-'+ vm.$t('collection.server.single');

      window.ifWsy = "";
    } else if (cloud_type == '2') {
      cloudType += vm.$t('collection.server.mCloud');
      window.ifWsy = "isWsy";
    }

    return cloudType || '--';
  },

  //判断服务器类型
  resTypeToName ( data ){
    //服务器类型的转换
    var table = {
      devType:{
        "name":vm.$t("collection.common.sertype"),//"服务器类型"
        "all": vm.$t("collection.common.all"),//"所有"
        "mNode":vm.$t("collection.common.cvm"),//"管理节点"
        "sNode":vm.$t("collection.common.cvm"),//"存储节点"
        "va":vm.$t("collection.common.insertNode"),//"接入服务器"
        "front":vm.$t("collection.common.headendEquip"),//"前端设备"
        "others":vm.$t("collection.common.otherServer"),//"其他服务器"
        "cas":vm.$t("collection.common.czq"),//"归档存储节点"
      }
    };
    if(data == null||data == "") {
      return  table.devType.others;
    }
    if(data.indexOf('CVS') != -1 || data.indexOf('OSD') != -1) {
      return table.devType.sNode;
    }else if(data.indexOf('CVM') != -1 || data.indexOf('AMS') != -1 || data.indexOf('CPM') != -1) {
      return table.devType.mNode;
    }else if(data.indexOf('CVA') != -1){
      return table.devType.va;
    }else if(this.data.indexOf('CAS') != -1){
      return table.devType.cas;
    }
    else{
      return table.devType.others;
    }
  },
  getRealTime(full){//
    var timeout = 0;
    if ( full.cluster_timeout ) timeout = 1;
    if ( full.childlist && full.childlist[0] && full.childlist[0].timeout ) timeout = 1;
    if ( full.sysinfo && full.sysinfo.timeout ) timeout = 1;

    return timeout;

  },
  //采集时间超时判断
  setRedtimeout( data , timeout ){
    //采集时间有值
    if ( data ){
      if ( timeout == '2'){
        //超时
        return "<div class='update' style='color:red'>"+  data  +"</div>";
      }else{
        return data;
      }
    }else{
      return "<span class='status_no'>"+ nullplaceholder +"</span>";
    }

  },
  toFixedTwo( data ){ //四舍五入小数点后2位， 0.00 特殊处理；
    var data = Number(data).toFixed(2);
    if ( data == 0.00 ) data = 0.01;
    return data;
  },
  //生成录像图像表格
  generateRec( data , month/*是否为按月巡检*/ ){

    let resultArr = data.split("");
    let str = "";

    /*1、24小时的格式 [0 无录像/1有录像/2巡检异常/ 3 未巡检(wxj)
     *2、按月巡检 [0 当天录像没有异常 / 1 当天录像有异常 / 2  无录像 /3  未巡检]
     * */
    for ( var i = 0; i < resultArr.length ; i++ ){

      if ( month ){//按月巡检
        if ( resultArr[i] == "0" )                 //正常
          str += "<span class='zc' day='"+ i +"'></span>";
        else if ( resultArr[i] == "1" )            //异常
          str += "<span class='yc'  day='"+ i +"'></span>";
        else if ( resultArr[i] == "2" )            //无录像
          str += "<span class='lxqs'  day='"+ i +"'></span>";
        else if ( resultArr[i] == "3" )
          str += "<span class='wxj'  day='"+ i +"'></span>";
      } else {
        if ( resultArr[i] == "0" )   //无录像
          str += "<span class='lxqs' day='"+ i +"'></span>";
        else if ( resultArr[i] == "1" )             //正常
          str += "<span class='zc' day='"+ i +"'></span>";
        else if ( resultArr[i] == "2" )             //异常
          str += "<span class='yc' day='"+ i +"'></span>";
        else if ( resultArr[i] == "3" )             //未巡检
          str += "<span class='wxj' day='"+ i +"'></span>";
      }
    }
    return str;
  },

  /**
   * 翻译磁盘属组名称
   * FREE（空闲）, PV（存储池）,KICKED（阵列踢盘）, UNINIT（未初始化）,UNKNOWN（未知）
   * SPARE:-GLOBAL-（全局热备盘）, RAID：%s(阵列%s中的磁盘),SPARE:%s（阵列%s的局部热备盘）
   * REBUILD:%s（重构盘）,FAULTY:%s(无效盘), RESHAPE:%s(扩展盘)
   */
  hdGroupName( groupName ){
    if(groupName == null) {
      return "--";
    }
    if(groupName =="") {
      return "--";
    }
    if(groupName =="FREE") {//		FREE（空闲）
      return vm.$t("collection.detail.diskGrop1");//"空闲";
    }
    if(groupName =="PV") {//		PV（存储池）
      return vm.$t("collection.detail.diskGrop2");//"存储池";
    }
    if(groupName =="KICKED") {//		KICKED（阵列踢盘）
      return vm.$t("collection.detail.diskGrop3");//"阵列踢盘";
    }
    if(groupName =="UNINIT") {//		UNINIT（未初始化）
      return vm.$t("collection.detail.diskGrop4");//"未初始化";
    }
    if(groupName =="UNKNOWN") {//		UNKNOWN（未知）
      return vm.$t("collection.detail.diskGrop5");//"未知";
    }
    if(groupName =="SPARE:-GLOBAL-") {//		SPARE:-GLOBAL-（全局热备盘）
      return vm.$t("collection.detail.diskGrop6");//"全局热备盘";
    }
    if(groupName =="SYSTEM_DISK") {//		SYSTEM_DISK（系统盘）
      return vm.$t("collection.detail.diskGrop7");//"系统盘";
    }
    if(groupName =="DATA_DISK") {//		DATA_DISK(数据盘)
      return vm.$t("collection.detail.diskGrop8");//"数据盘";
    }
    if(groupName =="PHYSICAL_DISK") {//		DATA_DISK(数据盘)
      return vm.$t("collection.detail.diskGrop9");//"物理磁盘";
    }
    var splitArr = new Array();
    splitArr = groupName.split(":");
    var startString = splitArr[0];
    var n = "";
    if(splitArr.length == 2){
      n = splitArr[1].trim();
    }
    if(startString=="RAID") {//		RAID：%s(阵列（%s）)
      return vm.$t("collection.detail.diskGrop10")+"("+ n +")";//"阵列("+ n +")";
    }
    if(startString=="SPARE") {//		SPARE:%s（局部热备盘（%s））
      if(groupName.indexOf("SPARE:-")>-1){
        if(n.indexOf("0000")>-1){
          return vm.$t("collection.detail.diskGrop11");//"区域热备盘(机头)";
        }else if( n.length == 6){  //n.indexOf("01") !=-1 &&    xiongmang update
          n = n.replaceAll("-", "");
          var n1 = n.substring(0,2);
          var n2 = n.substring(2,4);
          return vm.$t("collection.detail.diskGrop12")+"("+vm.$t("collection.detail.diskGrop13")+ parseInt(n1)+"/"+parseInt(n2) +")";//"区域热备盘(扩展柜"+ n1+"/"+n2 +")";
        }
        return vm.$t("collection.detail.diskGrop12")+"("+ n +")";//"区域热备盘("+ n +")";
      }else {
        return vm.$t("collection.detail.diskGrop14")+"("+ n +")";//"局部热备盘("+ n +")";
      }
    }
    if(startString=="REBUILD") {//		REBUILD:%s（重构盘（%s））
      return vm.$t("collection.detail.diskGrop15")+"("+ n +")";//"重构盘("+ n +")";
    }
    if(startString=="FAULTY") {//		FAULTY:%s(无效盘（%s）)
      return vm.$t("collection.detail.diskGrop16")+"("+ n +")";//"无效盘("+ n +")";
    }
    if(startString=="RESHAPE") {//		RESHAPE:%s(扩展盘（%s）)
      return vm.$t("collection.detail.diskGrop17")+"("+ n +")";//"扩展盘("+ n +")";
    }
    if(startString=="SYSTEM_RAID") {//		SYSTEM_RAID:%s(系统盘阵列(%s))
      return vm.$t("collection.detail.diskGrop18")+"("+ n +")";//"系统盘阵列("+ n +")";
    }
    return groupName;
  },

  domainTypeOptions () {
    return [{
      value: '0',
      label: '分布式EC'
    }, {
      value: '1',
      label: '单机EC'
    }]
  },

  coverTypeOptions () {
    return [{
      value: '0', label: vm.$t('collection.bucket.coverType0')
    }, {
      value: '1', label: vm.$t('collection.bucket.coverType1')
    }, {
      value: '2', label: vm.$t('collection.bucket.coverType2')
    }]
  },

  hashNameOptions () {
    return [{
      value: 'sha256', label: 'sha256'
    }, {
      value: 'sha384', label: 'sha384'
    }, {
      value: 'sha512', label: 'sha512'
    }]
  },

  /**
   * 网口绑定模式
   */
  bangModel () {
    return [
      {
        value: '0',
        label: '平衡轮循环策略'
      }, {
        value: '1',
        label: '主-备份策略'
      }, {
        value: '2',
        label: '平衡策略'
      }, {
        value: '3',
        label: '广播策略'
      },
      {
        value: '4',
        label: 'IEEE802.3ad 动态链接聚合'
      }, {
        value: '5',
        label: '适配器传输负载均衡'
      }, {
        value: '6',
        label: '适配器适应性负载均衡'
      }
    ]
  }


};
export default collutils;
