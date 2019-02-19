<template>
  <div>
    <div style="background:#fff;overflow:hidden">
      <div v-show="queryTag && tags.length" class="queryMeta" v-if="!onlyCloud">
        <el-tag
          v-for="tag in tags"
          :key="tag.name"
          :closable="true"
          @close="delMeta(tag)">
          {{tag.value}}
        </el-tag>
        <el-button v-show="!more && !hideExpand" class="right" type="iconButton" icon="h-icon-angle_down" @click="moreSearch(true)" style="padding: 5px 10px;">{{$t('common.open')}}</el-button>
        <el-button v-show="!more" class="right" type="iconButton" icon="icons icon-reset" @click="resetList" style="padding: 5px 10px;">{{$t('common.reset')}}</el-button>
      </div>
      <div class="openSear" :class="{collQuery:collTags,isExport:isExport}"  v-show="showQueryInput" v-if="!onlyCloud">
        <el-input
          id="queryListInput"
          :placeholder="input"
          icon="h-icon-search"
          style="width:235px"
          :on-icon-click="queryList"
          v-model="queryForm.query"
        >
        </el-input>
        <el-tooltip effect="dark" :content="$t('common.more')" placement="top" style="position:relative;top:-2px;">
          <el-button v-if="!noMore" type="iconButton" icon="h-icon-filter" @click="moreSearch(true)"></el-button>
        </el-tooltip>
      </div>
      <el-tooltip v-if="isExport && !onlyCloud" class="item collRefExp" effect="dark" :content="$t('config.log.export')" placement="top" style="position:absolute;right:-7px;top:-45px;">
        <el-button type="iconButton" icon="h-icon-export" @click="exportLog" style="position:relative;top:-2px;"></el-button>
      </el-tooltip>
      <div class='collRefExp' v-if="!onlyCloud">
        <!--导出，刷新框-->
        <el-button-group v-show="collTags" :content="$t('common.realRef')">
          <!-- <el-button type="iconButton" icon="h-icon-export"></el-button>-->
          <el-button type="iconButton" icon="h-icon-flash" @click="refreshList" :disabled="refDisabled"></el-button>
        </el-button-group>
      </div>

    </div>
    <slot></slot>
    <el-form-item class="inlineLabel aRight" style="float:right" v-show="more">
      <el-button type="iconButton" icon="h-icon-search" @click="queryList(null,null,null,null,'click')" id="queryHeaderBtn">{{$t('common.query')}}</el-button>
      <el-button type="iconButton" icon="icons icon-reset" @click="resetList">{{$t('common.reset')}}</el-button>
      <el-button type="iconButton" icon="h-icon-angle_up" @click="moreSearch(false,'result')">{{$t('common.close')}}</el-button>
    </el-form-item>
    <!-- <cloud-list :showCloud="showCloud" @exitCloudDlg="showCloud = false" @chooseCloud="chooseCloud"></cloud-list>-->
  </div>
</template>
<script>
  import util from 'index@/utils/util';
  import http1 from '../api/index'

  export default {
    props: ['queryForm', 'table','form', 'tags','input','noMore','isExport','onlyCloud'/*仅显示云列表*/,'param'/*集群参数列表*/],
    data () {
      return {
        configRefBtn: false, //配置模块刷新按钮不可用
        refDisabled: false,  //监控模块刷新按钮不可用
        queryTag: false, //点击查询按钮后显示过滤条件
        cloudNo: 0,      //云列表数量
        showCloud: false,
        util: util,
        cloudId: this.$route.query.cloudId ,
        hideExpand: false,
        clouds: []  //云列表所有云的显示
      }
    },
    watch: {
      '$store.state.resize':'setCloudNo'
    },
    computed: {
      cloudDefault () {
        if (this.$store.state.cloudList.length) {
          if (window.sessionStorage.clouds && (window.sessionStorage.clouds != '[]')) {
            this.clouds = JSON.parse(window.sessionStorage.clouds);
            this.setPageCloud(this.clouds);
            return;
          } else {
            this.clouds = this.$store.state.cloudList.slice(0);
            this.setPageCloud(this.clouds);
            return;
          }

        } else {
          /*this.$store.state.gCloudId = '';
           window.localStorage.setItem('gCloudId','');*/
        }
        return this.$store.state.cloudList;
      },
      more () {
        return this.$store.state.query;
      },
      isSet () {
        if ((this.$route.path.indexOf('/config') != -1) && (this.$route.path != '/config/log'))
          return true;
        else
          return false;
      },
      showCloudList () {
        if ( this.tags && this.tags.length ){
          let index =  this.tags.findIndex((value, index, arr) => {
            return value.name == 'cloudId';
          });

          if (index != -1 && !this.more){
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
      /**
       * @Author: jiangjuan
       * @Date: 2018-02-27
       * @Desc: 判断是否监控页面进入；
       */
      collTags(){
        return this.$parent.$parent.collTags;
      },
      showQueryInput () {
        if ((!this.tags.length || !this.queryTag)&& !this.more)  {
          return true;
        } else {
          this.$set(this.queryForm, 'query', '');
          return false;
        }
      }
    },
    created () {
      //配置页面云必须有选中项，结果有延迟，增加一个queryForm字段来进行过滤。
      if (this.$route.path.indexOf('/config') != -1) {
        this.queryForm.querySet = true;
      }
    },
    mounted () {
      if (this.$route.query.cloudId){
        this.changeList(this.$route.query.cloudId);
      }
      //绑定回车触发事件
      this.bodyListener = (e) => {
        if (e.keyCode === 13 && queryListInput){
          const i = document.getElementById('queryListInput').getElementsByTagName('i')[0]
          !!i && i.click()
        }
      };
      document.body.addEventListener('keyup', this.bodyListener, false);
      this.setCloudNo();
    },
    beforeDestroy() {
      document.body.removeEventListener('keyup', this.bodyListener);
      this.$store.dispatch('setQuery', false);
    },
    methods: {
      //配置页面默认选中第一朵云
      setSelCloud (cloudId, index) {
        let that = this;
        if (this.isSet) {
          //判断clouds列表中有无匹配
          let fiex = this.cloudId && this.clouds.findIndex((value, index, arr) => {
              return value.id == that.cloudId;
            });

          if (this.cloudId && fiex >= 0) {
            if ( this.cloudId == cloudId ) {
              return 'primary';
            }
          } else if ( (!window.localStorage.gCloudId || (fiex == -1) ) && index == 0 ) {
            window.localStorage.setItem('gCloudId',cloudId);
            this.$store.state.gCloudId = cloudId;
            return 'primary';
          }

        } else {
          if (cloudId == this.cloudId) {
            this.queryForm.cloudId = this.cloudId;
            return 'primary';
          }
        }

        return '';
      },

      //生成云历史轨迹
      setPageCloud (cloudsList) {

        //新增云
        this.$nextTick(function() {

          if (!this.$store.state.cloudList.length) {
            this.$store.state.gCloudId = '';
            window.localStorage.setItem('gCloudId', '');
          }

          let _this = this;
          //增加判断，解决云被删除的bug
          let realCloudList = this.$store.state.cloudList;
          this.clouds.forEach(function(c1){
            let indexR = realCloudList.findIndex((value, index, arr) => {
              return value.id == c1.id;
            });

            if (indexR == -1) {
              let indexD = _this.clouds.findIndex((value, index, arr) => {
                return value.id == c1.id;
              });
              _this.clouds.splice(indexD, 1);
            }
          });

          this.cloudNo = Math.floor((_this.$refs.cloudItem && _this.$refs.cloudItem.$el.offsetWidth - 140 - 60)/126) - 1;
          if (this.clouds.length && (this.clouds.length < (this.cloudNo+1)) && (realCloudList.length > this.clouds.length)){
            realCloudList.forEach(function(c1){
              let indexC = _this.clouds.findIndex((value, index, arr) => {
                return value.id == c1.id;
              });

              if (indexC == -1 && cloudsList.length < _this.cloudNo+1) {
                _this.clouds.push(c1);
              }
            });
            window.sessionStorage.setItem('clouds',JSON.stringify(_this.clouds));
          }

          if (this.isSet) {
            let fiex = this.cloudId && this.clouds.findIndex((value, index, arr) => {
                return value.id == _this.cloudId;
              });

            if (window.localStorage.gCloudId) {
              let fiex = this.cloudId && this.clouds.findIndex((value, index, arr) => {
                  return value.id == _this.cloudId;
                });

              if (!this.cloudId || fiex > 0)
                this.cloudId = window.localStorage.gCloudId;
            } else {
              if (cloudsList.length) {
                this.cloudId = cloudsList[0].id;
                util.saveStorage({'gCloudId': cloudsList[0].id, 'gDeployMode': cloudsList[0].mode});
              }
            }

            this.queryForm.cloudId = this.cloudId;

            //选中第一朵云设置成功，再触发表格更新
            this.queryForm.querySet = false;

            //集群参数页面特殊处理，更新表单
            if (!this.param) {
              this.$parent.$parent.$refs[this.table].getData();
            } else {
              this.$parent.$parent.initData();
            }

            //有云的时候才需要获取云类型和部署模式
            if (this.cloudId) {
              http1.getRequest('/config/cloud/info', 'post', {"cloudId": this.cloudId}).then(res => {
                if (res.status) {
                  this.$store.state.gCloudType = res.data.cloudType;
                  window.localStorage.setItem('gCloudType',res.data.cloudType);
                  this.$store.state.gDeployMode = res.data.deployMode;
                  window.localStorage.setItem('gDeployMode',res.data.deployMode);
                }
              });
            }

          }
        });


      },
      /**
       * @Author: wangjing9
       * @Date: 2018-02-06
       * @Desc: 切换云列表
       */
      changeList (val,mode) {
        this.queryForm.cloudId = val;
        this.cloudId = val;

        //配置页面才需要设置gCloudId
        if (this.$route.path.indexOf('/config') != -1)
          util.saveStorage({'gCloudId':this.cloudId,'gDeployMode':mode});

        if (this.hideExpand) {
          //清空告警树左侧选中
          this.resetList();
        }

        if (!this.$route.query.cloudId) {
          //集群参数页面特殊处理，更新表单
          if (!this.param)
            this.$parent.$parent.$refs[this.table].getData();
          else
            this.$parent.$parent.initData();
        }
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-02-06
       * @Desc: 展开查询条件
       * @Param: 展开标记
       */
      moreSearch (tag, result) {
        this.$store.dispatch('setQuery', tag);
        this.queryTag = !tag;
        this.$parent.$parent.$children[2].setHeight();

        if (result){
          this.queryList(true);
        }
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-02-06
       * @Desc: 查询
       */
      queryList (btn, noData, queryForm,hideExpand,click/*手动点击查询按钮触发*/) {

        if (btn !== true && !click)
          this.moreSearch(false);

        let tags = [];

        if (queryForm) {
          for (let p in queryForm) {
            this.queryForm[p] = queryForm[p];
          }
          this.cloudId = this.queryForm.cloudId;
        }

        if (hideExpand) {
          this.hideExpand = true;
        } else {
          this.hideExpand = false;
        }

        this.$emit('queryList',tags,noData);
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-02-06
       * @Desc: 重置
       */
      resetList (noTable , day) {
        this.$parent.resetFields();
        //告警特殊字段
        this.queryForm.sourceIp && (this.queryForm.sourceIp = '');
        this.queryForm.alarmTime && (this.queryForm.alarmTime = '');
        this.queryForm.type && (this.queryForm.type = '');
        this.queryForm.cloudId = this.cloudId;
        this.queryForm.proStatus = '';

        //计划管理特殊字段
        this.queryForm.filter_by && (this.queryForm.filter_by = '');

        if (noTable == 'noTable') {
          this.queryForm.day = day;  //重置时间控件
          this.$emit('queryList',[],'noTable');
        } else {
          this.$emit('queryList',[]);
        }

        this.$parent.$parent.$parent.$refs[this.table].setHeight();

      },
      /**
       * @Author: wangjing9
       * @Date: 2018-01-30
       * @Desc: 删除标签，同时清除该查询条件
       */
      delMeta (tag) {
        let index = this.tags.findIndex((e, index, arr) => {
          return e.name == tag.name;
        });

        this.tags.splice(index, 1);
        this.queryForm[tag.name] = '';
        this.queryList();
      },
      /**
       * 设置云列表显示
       * @Author: wangjing9
       * @Date: 2018-02-25
       * @Desc: 删除标签，同时清除该查询条件
       */
      setCloudNo () {
        let that = this;
        this.$nextTick(function(){
          that.cloudNo = Math.floor((that.$refs.cloudItem && that.$refs.cloudItem.$el.offsetWidth - 140 - 60)/126) - 1;
        });
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-02-25
       * @Desc: 选中弹出框中的云
       */
      chooseCloud (cloud) {
        this.clouds = this.clouds.splice && this.clouds.splice(0,this.cloudNo+1);
        this.cloudId = cloud.id;
        this.queryForm.cloudId = cloud.id;

        util.saveStorage({'gCloudId':cloud.id,'gDeployMode':cloud.mode});

        //判断当前数组中是否包含选中云,实现类似足迹的功能
        let index = this.clouds.findIndex((value, index, arr) => {
          return value.id == cloud.id;
        });

        if (index == -1) {
          this.clouds.pop();
          this.clouds.unshift(cloud);
          window.sessionStorage.setItem('clouds',JSON.stringify(this.clouds));
        }

        this.queryList();

      },
      /**
       * @Author: wangjing9
       * @Date: 2018-03-14
       * @Desc: 刷新列表
       */
      reltimeRef () {
        let table =  this.$parent.$parent.$refs[this.table],
          _this = this,
          url = table.url + '/ref';

        if (table.url == '/alarm/list') {
          table.getData();
        } else {
          this.configRefBtn = true;
          util.reltimeRef(url, table, function(){
            _this.configRefBtn = false;
          });
        }


      },
      /**
       * @Author: wangjing9
       * @Date: 2018-03-15
       * @Desc: 导出日志
       */
      exportLog () {
        util.openPostWindow('',this.$t('config.log.expLog'),this.queryForm);
      },
      /**
       * @Author: jiangjuan
       * @Date: 2018-01-31
       * @Desc: 刷新列表
       */
      refreshList(){ //实时 刷新列表数据
        let tag = this.table;
        let id = this.cloudId;

        this.$parent.$parent.$refs[this.form].resetFields();
        if ( tag == "iRaid" ) tag = "iraidDomain";
        this.referList(tag,id);
      },
      referList(tag,id){
        let that = this;
        if ( tag == "cameraStatus" ){
          let url = "/collection/videoInspection/checkRef";

          this.$confirm(this.$t('collection.common.refreshTips'), this.$t('iconCollection.ok'), {
            confirmButtonText: this.$t('iconCollection.sure'),
            cancelButtonText: this.$t('iconCollection.cancel'),
            type: 'question'
          }).then(() => {
            util.showMask();
            http1.getRequest(url, 'post', {"cloudId" : id },120000).then(res => {
            },null,null,null,0);

            util.hideMask();
            this.resetList();// 重置列表功能

            //3s之后弹出超时
            setTimeout(() => {
              util.alert(that.$t('collection.common.cameraStatusTips'),'success');
            }, 3000);
          }).catch(() => {

          });

        }else{
          let url = "/collection/"+tag+"Ref";

          this.$confirm(this.$t('collection.common.refreshTips'), this.$t('iconCollection.ok'), {
            confirmButtonText: this.$t('iconCollection.sure'),
            cancelButtonText: this.$t('iconCollection.cancel'),
            type: 'question'
          }).then(() => {
            //确定
            util.showMask();
            this.refDisabled = true;
            http1.getRequest(url, 'post', {"cloudId" : id },120000).then(res => {
            });

            //3s之后弹出超时
            setTimeout(() => {
              util.hideMask();
              this.resetList();// 重置列表功能
              this.refDisabled = false;
              util.alert('采集信息命令已下发，请稍候查看数据！','success');
            }, 3000);

          }).catch(() => {
            //取消
          });


        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .moreBtn{
    margin-right: 0;
    min-width:40px;
  }
  .cloudlist{
    clear:both;
    margin-bottom:0;
    padding-bottom: 5px;
    padding-top:3px;
  }
  .isExport{
    right:25px!important;
  }
  .collRefExp{
    top:0;
  }
  .inline-group{
    display:inline-block;
  }
  .cloudlist{
    margin-left:20px;
  }
</style>
