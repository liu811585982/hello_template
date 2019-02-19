<template>
  <div class="page-body" :class="{'menu-collapse': isCollapse}">
    <div v-if="topIndex == 0 || topIndex==2" :style="{height:height + 'px'}">
      <!--<el-scrollbar
        wrap-class="el-demo1-scrollbar__wrap"
        view-class="el-demo1-scrollbar__view"
        :style="{height:height + 'px'}"
      >-->
      <router-view></router-view>
      <!-- </el-scrollbar>-->
    </div>
    <div v-else  :style="{height:height + 'px'}">
      <div class="page-menu" ref="pageMenu" >
        <!-- 展开时加el-scroll 收缩时去掉 -->
        <el-scrollbar
          v-if="!isCollapse"
          ref="menuScrollWrap"
          class="menuScroll"
          wrap-class="el-demo1-scrollbar__wrap"
          view-class="el-demo1-scrollbar__view"
          :style="{height:height + 'px'}"
        >
          <el-menu
            ref="subMenu"
            :default-active="$route.path"
            :router="true"
            :collapse="isCollapse"
            :class="topIndex == 5 ? 'light' : ''"
            :theme="topIndex == 5 ? 'light' : 'dark'"
            collapse-btn
            @select="selectMenu"
            @click-collapse="handleClickCollapseBtn">
            <template v-for="(menu,index) in menus">
              <el-menu-item :index="menu.path" v-if="!menu.children" :icon="menu.cls" :class="menuChoosed(menu)">
                {{$t(menu.name)}}
              </el-menu-item>
              <el-submenu :ref="'list'+index" :index="topIndex.toString()+index.toString()" v-else="menu.children" :icon="menu.cls" :class="{'is-active': parentMenu == index }">
                <span slot="title">{{$t(menu.name)}}</span>
                <el-menu-item v-for="subMenu in menu.children" :class="menuChoosed(subMenu,index)" :index="subMenu.path">{{$t(subMenu.name)}}</el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
          <div class="fixedBg" :class="topIndex == 5 ? 'light' : ''"></div>
        </el-scrollbar>
        <el-menu
          v-else
          ref="subMenu"
          :default-active="$route.path"
          :router="true"
          :collapse="isCollapse"
          :class="topIndex == 5 ? 'light' : ''"
          :theme="topIndex == 5 ? 'light' : 'dark'"
          collapse-btn
          @select="selectMenu"
          @click-collapse="handleClickCollapseBtn">
          <template v-for="(menu,index) in menus">
            <el-menu-item :index="menu.path" v-if="!menu.children" :icon="menu.cls" :class="menuChoosed(menu)">
              {{$t(menu.name)}}
            </el-menu-item>
            <el-submenu :ref="'list'+index" :index="topIndex.toString()+index.toString()" v-else="menu.children" :icon="menu.cls" :class="{'is-active': parentMenu == index }">
              <span slot="title">{{$t(menu.name)}}</span>
              <el-menu-item v-for="subMenu in menu.children" :class="menuChoosed(subMenu,index)" :index="subMenu.path">{{$t(subMenu.name)}}</el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
        <div class="fixedBg" :class="topIndex == 5 ? 'light' : ''"></div>
      </div>
      <div class="page-content-wrap"  :style="{height:height + 'px'}">
        <el-scrollbar
          wrap-class="el-demo1-scrollbar__wrap"
          view-class="el-demo1-scrollbar__view"
          :style="{height:height + 'px'}"
        >
          <div class="page-content" ref="pageCont">
            <el-breadcrumb separator="/" v-if="breadTag">
              <el-breadcrumb-item  ref="bread" @click.native="clickLink(buildPath(index,'click'),index)" v-for="(bread, index) in breads[1]" :to="buildPath(index)">{{getBreadTxt(bread)}}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button class="backBtn" type="iconButton" v-if="showBack" icon="h-icon-arrow_left_circle" @click="backToPrev"></el-button>
            <router-view></router-view>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div v-show="topIndex == 6">
      <el-button v-if="!isCollapse" type="iconButton"  class="database" icon="h-icon-restore" @click="exportDatabase">运维数据库备份</el-button>
      <el-tooltip content="运维数据库备份" placement="right" v-else>
        <el-button type="iconButton" icon="h-icon-restore" class="database icon"  @click="exportDatabase"></el-button>
      </el-tooltip>
    </div>

  </div>
</template>

<script>
  let breadList = {
    '/config/cloud/list': [['list','list'],['set','cloud']], // 云管理
    '/config/cloud/config': [['list', 'list', 'config'],['set', 'cloud', 'paramSet']], // 云配置
    '/config/cloud/deployment': [['list','list','deployment'],['set','cloud','deployment']], // 一键部署
    '/config/cloud/license': [['list','list','license'],['set','cloud','license']],     //license申请书
    '/config/cluster/list': [['list','list','list'],['set','cluster','clusterList']],   //集群列表
    '/config/cluster/createCluster': [['list','list','list','createCluster'],['set','cluster','clusterList','btnCreateCluster']],  //createCluster
    '/config/cluster/addCluster': [['list','list','list','addCluster'],['set','cluster','clusterList','btnExpand']],
    '/config/cluster/editCluster': [['list','list','list','editCluster'],['set','cluster','clusterList','btnModify']],
    '/config/cluster/expandNode': [['list','list','list','expandNode'],['set','cluster','clusterList','expandNode']],
    '/config/cluster/ams':  [['list','ams','ams'],['set','cluster','ams']],
    '/config/cluster/params': [['list','params','params'],['set','cluster','clusterParameter']],
    '/config/cluster/editParam': [['list','list','params','editParam'],['set','cluster','clusterParameter','setParam']],
    '/config/cluster/mapTable':[['list','mapTable','mapTable'],['set','cluster','mapTable']],
    '/config/cluster/mapIpSeg':[['list','mapTable','mapTable','mapIpSeg'],['set','cluster','mapTable','mapIpSeg']],
    '/config/virtual/domain': [['list','domain','domain'],['set','virtual','domainSet']],
    '/config/virtual/domainDetail': [['list','domain','domain','domainDetail'],['set','virtual','domainSet','btnViewCVS']],
    '/config/virtual/group': [['list','group','group'],['set','virtual','groupSet']],
    '/config/virtual/groupExportIp': [['list','domain','group','groupExportIp'],['set','virtual','groupSet','btnExportGroup']],
    '/config/virtual/groupSetIp': [['list','domain','group','groupSetIp'],['set','virtual','groupSet','btnSetGroup']],
    '/config/bucket/list': [['list','list','list'],['set','virtual','bucketSet']],
    '/config/bucket/create': [['list','domain','list','create'],['set','virtual','bucketSet','createBucket']],
    '/config/bucket/edit': [['list','domain','list','edit'],['set','virtual','bucketSet','edit']],
    '/config/bucket/viewACL': [['list','domain','list','viewACL'],['set','virtual','bucketSet','viewACL']],
    '/config/user/list': [['list','list'],['set','user']],
    '/config/user/userAdd': [['list','list','userAdd'],['set','user','add']],
    '/config/user/userUpdate': [['list','list','userUpdate'],['set','user','edit']],
    '/config/user/userKey': [['list','list','userKey'],['set','user','keySet']],
    '/config/user/userCloud': [['list','list','userCloud'],['set','user','cloudSet']],
    '/config/user/userView': [['list','list','userView'],['set','user','view']],
    '/config/cva/cpmNode': [['list','cpmNode','cpmNode'],['set','cva','cpmNode']],
    '/config/cva/cvaNode': [['list','cvaNode','cvaNode'],['set','cva','cvaNode']],
    '/config/cva/accessConfig': [['list','cvaNode','cvaNode','accessConfig'],['set','cva','cvaNode','cva_config']],
    '/config/osd/osdNode': [['list','osdNode','osdNode'],['set','storage','osdNode']],
    '/config/osd/osdConfig': [['list','osdNode','osdNode','osdConfig'],['set','storage','osdNode','osd_config']],
    '/config/osd/addOsdNode': [['list','osdNode','osdNode','addOsdNode'],['set','storage','osdNode','btn_addcvs']],
    '/config/osd/device': [['list','device','device'],['set','storage','osdVolume']],
    '/config/osd/ss': [['list','ss','ss'],['set','storage','osdSs']],
    '/config/cameraReal/list': [['list','list','list'],['set','plan','real']],
    '/config/cameraReal/detail': [['list','list','list','detail'],['set','plan','real','detail']],
    '/config/cameraHis/list': [['list','list','list'],['set','plan','his']],
    '/config/cameraHis/detail': [['list','list','list','detail'],['set','plan','his','detail']],
    '/config/network/list': [['list','list'],['set','network']],
    '/config/network/detail': [['list','list','detail'],['set','network','detail']],
    '/config/log': [['log','log'],['set','log']],
    '/config/upgrade': [['upgrade','upgrade'],['set','upgrade']],

    '/collection/topo/index': [['index','index'],['monitor','cloud']],
    '/collection/topo/cloud':[['index','index','cloud'],['monitor','cloud','clousDetail']],
    '/collection/cloud/list': [['cloudList','cloudList'],['monitor','cloudlist']],
    '/collection/server':[['cloudList','server','server'],['monitor','hardware','server']],
    '/collection/disk':[['cloudList','disk','disk'],['monitor','hardware','disk']],
    '/collection/volume':[['cloudList','volume','volume'],['monitor','hardware','volume']],
    '/collection/app':[['cloudList','app','app'],['monitor','software','app']],
    '/collection/bucket':[['cloudList','bucket','bucket'],['monitor','system','Bucket']],
    '/collection/domain':[['cloudList','domain','domain'],['monitor','system','domain']],
    '/collection/user':[['cloudList','user','user'],['monitor','system','user']],
    '/collection/group':[['cloudList','group','group'],['monitor','system','group']],
    '/collection/cameraStatus':[['cloudList','cameraStatus','cameraStatus'],['monitor','cameraRecord','videoIns']],
    '/collection/camera': [['cloudList','camera','camera'],['monitor','cameraRecord','camera']],

    '/analysis/server': [['server','server','server'],['analyse','device','serverStatus']],
    '/analysis/disk': [['disk','disk','disk'],['analyse','device','diskStatus']],
    '/analysis/app': [['app','app','app'],['analyse','device','appStatus']],
    '/analysis/volume': [['volume','volume','volume'],['analyse','device','volStatus']],
    '/analysis/cameraStatus': [['cameraStatus','cameraStatus','cameraStatus'],['analyse','device','cameraStatus']],
    '/analysis/cluster': [['cluster','cluster','cluster'],['analyse','capacity','clusterCap']],
    '/analysis/domain': [['domain','domain','domain'],['analyse','capacity','domainCap']],
    '/analysis/bucket': [['bucket','bucket','bucket'],['analyse','capacity','bucketCap']],
    '/analysis/alarmType': [['alarmType','alarmType','alarmType'],['analyse','alarmAna','alarmType']],
    '/analysis/deviceAlarm': [['deviceAlarm','deviceAlarm','deviceAlarm'],['analyse','alarmAna','deviceAlarm']],

    '/manage/alarmNotify': [['alarmNotify','alarmNotify'],['manage','alarmNote']],
    '/manage/netCardSet': [['netCardSet','netCardSet','netCardSet'],['manage','serverSet','netCardSet']],
    '/manage/serverSet': [['serverSet','serverSet','serverSet'],['manage','serverSet','serverTimeSync']]
  };
  export default {
    props: ['menus', 'topIndex' , 'rootPath'],
    data () {
      return {
        isCollapse: false,
        index: this.$parent.finalIndex,
        parentMenu: false
      }
    },
    created () {
      window.localStorage.setItem('submenu',this.isCollapse);
      this.$refs['list0'] && this.$refs['list0'].click();
    },
    computed: {
      defaultActiveMenu () {
        return this.$route.path;
      },
      showBack () {
        //面包屑当前path和上一级不一致则显示返回按钮
        let bread = this.breads[0];
        let curPath = bread && bread[bread.length-1];
        let perPath = bread && bread[bread.length-2];

        if (curPath != perPath && this.$store.state.breadTag && this.breads[0].length > 2)
          return true;
        else
          return false;
      },
      breadTag () {
        return this.$store.state.breadTag;
      },
      height () {
        return this.$store.state.height;
      },
      breads () {
        let path = this.$route.path.split('')[1];
        return breadList[path] || breadList['/config/cloud/list'];
      }
    },
    methods: {
      handleClickCollapseBtn () {
        //菜单折叠
        this.isCollapse = !this.isCollapse
        window.localStorage.setItem('submenu',this.isCollapse);
        this.$store.dispatch('setResize', !this.$store.state.resize);
      },

      clickLink(route) {
        let that = this;
        if (window.path_now.indexOf(this.$route.path) == -1){
          window.path_now = window.location.href;
          return;
        }

        this.$nextTick(function () {
          let queryData = {};
          for ( let p in route.query) {
            queryData[p] = route.query[p];
          }
          queryData.v = +new Date();

          //菜单点击
          that.$router.push({
            path:route.path,
            query: queryData //保证每次点击路由的query项都是不一样的，确保会重新刷新view
          });
        });

      },
      buildPath (index) {
        if (index == 0){
          return this.rootPath;
        }
        //生成path
        let root = getPathRoot(this.$route.path);
        let pathArr = this.breads[0];

        return {
          path: root + pathArr[index],
          query: (index == this.breads[1].length-1) ? this.$route.query : {}
        }

      },
      backToPrev () {
        let route = this.buildPath(breadList[this.$route.path.split('')[1]][1].length-2);
        let queryData = {};
        for ( let p in route.query) {
          queryData[p] = route.query[p];
        }
        queryData.v = +new Date();
        this.$store.state.backObj = this.$store.state.queryObj;

        //网络配置tab页的详情做特殊处理绑定
        if (this.$route.path.indexOf('/network/detail') != -1) {
          queryData.type = this.$route.query.type;
        }

        //菜单点击
        this.$router.push({
          path:route.path,
          query: queryData //保证每次点击路由的query项都是不一样的，确保会重新刷新view
        });
      },
      menuChoosed (subMenu, index) {
        let tag = false;
        let _this = this;
        if (subMenu.link){
          let root = getPathRoot(subMenu.path);
          subMenu.link.forEach(function(v){
            if (_this.defaultActiveMenu.indexOf(root+v) != -1 ){
              tag = true;
            }
          })
        }else if (subMenu.path == this.defaultActiveMenu){
          tag = true;
        }

        if (parent && tag ){
          this.parentMenu = index;
        }

        //云列表的详情
        if ( this.$route.path == '/collection/detail' ){
          if (this.$route.query.breadtag && subMenu.path == '/collection/'+this.$route.query.breadtag && !this.$route.query.cloudId){
            tag = true;
          }
          if (subMenu.path == '/collection/cloud/list' && this.$route.query.cloudId)
            tag = true;
        }

        return {
          'is-active': tag
        }
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-03-14
       * @Desc: 获取面包屑的字段值
       */
      getBreadTxt (bread) {
        let txt = this.$t('menu.'+bread);
        let path = this.$route.path.split('')[1];
        let key = path.split('/')[1] + '.'+ path.split('/')[2] + '.';

        if (txt.indexOf('.') != -1) {
          txt = this.$t(key+bread);
          if (txt.indexOf('.') != -1)
            txt = bread;
        }

        return txt;
      },
      //菜单激活回调
      selectMenu (path) {
        if(path == this.$route.path){
          let that = this;
          if (window.path_now.indexOf(this.$route.path) == -1){
            window.path_now = window.location.href;
            return;
          }

          this.$nextTick(function () {
            let queryData = {};
            for ( let p in this.$route.query) {
              queryData[p] = this.$route.query[p];
            }
            queryData.v = +new Date();

            //菜单点击
            that.$router.push({
              path:this.$route.path,
              query: queryData //保证每次点击路由的query项都是不一样的，确保会重新刷新view
            });
          });

        }
      },

      //运维数据库备份
      exportDatabase () {
        let _token = window.localStorage.accessToken;
        window.open('/platform/datebase/backup?token=' + _token);
      }
    }
  }

  function getPathRoot(route){
    route = route.split('/');
    route.splice(-1);
    return route.join('/') + '/';
  }
</script>
<style lang="less" scoped>
  .page-body {
    position: relative;
    min-height:100%;
  }

  .page-menu {
    position:absolute;
    top: 0;
    left: 0;
    z-index:3;
  //  overflow:auto;
  }

  .el-menu {
    position: relative;
    z-index: 2;
    min-height: 100%;
    padding-top:40px;
  }

  .el-menu:not(.el-menu--collapse) {
    width: 200px;
  }

  .page-content-wrap {
    height: 100%;
    padding-left: 200px;
    transition: padding 0.3s ease-in-out;
  }

  .menu-collapse .page-content-wrap {
    padding-left: 48px;
  }

  .page-content {
    height: 100%; // padding: 10px;
  // overflow: auto;
  }
  .el-scrollbar.menuScroll{
    position:absolute;
    top:0;
    width:200px;
    background:#373737;
  }
  .menu-collapse .el-scrollbar.menuScroll{
  //width:48px;
  //background:none;
  }
  .fixedBg{
    position:fixed;
    top:45px;
    left:0;
    bottom:0;
    width:48px;
    background:#373737;
  &.light{
     background:#f5f5f5;
   }
  }
  .database{
    position:fixed;
    left:24px;
    bottom:50px;
    padding:10px;
    z-index:99;
    color:rgba(255,255,255,.8);
    border:1px solid #666;
    border-radius:4px;
  &:hover{
     color: #fff;
   }
  &:active{
     background:none;
   }
  &.icon{
     left:5px;
     padding-right:16px;
     border:none;
   }
  }
</style>
