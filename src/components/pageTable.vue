<template>
  <div ref="pgTable">
    <!--Stefan.Loo add 单行选择-->
    <el-table
      :class="{'loading': loadingUsergroupList, 'single-mode': isSingleMode}"
      ref="tableInner"
      :data="tableData"
      :width="width"
      :max-height="mHeight"
      :height="nopage ? (Dheight || '') : (resizeH || Dheight || height)"
      highlight-current-row
      @current-change="handleCurrent"
      @select="handleSelect"
      @selection-change="handleSelectChange"
      @select-all="handleSelectAll"
      @row-click="selectToCheck"
      @filter-change="filterChange"
      fit
      v-loading.fullscreen.lock="loadingUsergroupList"
      element-loading-text="数据加载中，请稍等...">
      <el-table-column v-if="select" type="selection" width="40" align="center"></el-table-column>
      <el-table-column v-if="!noIndex" type="index" width="50" :label="$t('common.index')" class-name="optBtn" align="center"></el-table-column>
      <el-table-column prop="cloud_name" v-if="cloud && !$route.query.cloudId" :label = "$t('common.cloudName')"  width="120" :show-overflow-tooltip="true" :formatter="tplDoNull"></el-table-column>
      <slot></slot>
    </el-table>
    <el-pagination v-if="!litPage && !nopage && table != 'alarmList'" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :page-sizes="[30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-pagination v-if="table" small @current-change="handleCurrentChange" :current-page="pageNo" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
    </el-pagination>
    <el-pagination
      v-if="litPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, huiPager, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import http from 'index@/api/index';
  // import http from '@/libs/mockHttp'
  import util from 'index@/utils/util';
  let bTime = 0;

  export default {
    // props: ['url', 'queryForm', 'nopage','table', 'width','Dheight','select','default','cloud','noIndex','mHeight','litPage'/*小型分页*/],
    props: {
      showData: {
        type:Boolean,
        default:true
      },
      url: {
        type: String,
        required: true
      },
      queryForm: {
        type: Object
      },
      nopage: {
        type: Boolean
      },
      table: {},
      width: {
        type: Number|String
      },
      Dheight: {
        type: Number
      },
      select: {
        type: Boolean
      },
      default: {},
      cloud: {},
      noIndex: {
        type: Boolean
      },
      mHeight: {
        type: Number
      },
      litPage: {
        type: Boolean
      },
      isSingleMode: {
        type: Boolean,
        default: false  // true 单选 false 多选
      }
    },
    data () {
      return {
        pageSize: 30,
        pageNo: 1,
        tableData: [],
        total: 0,
        action: http.getList,
        height: 0,
        resizeH: 0,
        multipleSelection: [],
        loadingUsergroupList: false,
        tempRow: null
      }
    },
    watch: {
      'pageSize': 'getData',
      'pageNo': 'getData',
      '$route': 'getDataRoute',
      '$store.state.resize': 'setHeight',
      url (val) {
        if (val) {
          this.getData()
        } else {
          this.tableData = []
        }
      }
    },
    methods: {
      setUnchecked (index) {
        this.tableData[index].disabled = true;
      },
      // 事件透传
      handleSelect (selection, row) {
        if (this.isSingleMode) {
          this.toggleSelection(selection, row)
          this.multipleSelection = [row]
        } else {
          this.multipleSelection = selection
        }
        this.$emit('select', selection, row)
      },

      // 事件透传
      handleSelectAll (selection) {
        if (this.isSingleMode) {
          this.toggleSelection(selection)
          this.multipleSelection = []
        } else {
          this.multipleSelection = selection
        }
        this.$emit('select-all', this.multipleSelection)
      },

      // 事件透传
      handleSelectChange (val) {
        this.multipleSelection = val;
        this.$emit('select-change', val);
      },

      /**
       * @author Stefan.Loo
       * @desc   事件透传
       */
      handleCurrent (val) {
        this.$emit('current-change', val);
      },

      // 每页显示条数修改
      handleSizeChange (val) {
        this.pageSize = val;
      },

      // 页码变更
      handleCurrentChange (val) {
        this.pageNo = val;
      },

      // 请求列表数据
      getData (pageNo, pageSize) {

        //域管理页面对查询条件特殊处理
        if ( this.$route.path.indexOf('/collection') != -1 ||  JSON.stringify(this.$route.query) == "{}" || JSON.stringify(this.$route.query).split('{v:').length == 2) {
          this.$store.state.queryObj = this.queryForm;
        }

        //配置页面选中云，默认不触发getData
        if (this.queryForm && this.queryForm.querySet && (this.$route.path != '/config/log')) {
          return;
        }

        let queryParam = this.queryForm || {};
        queryParam.pageSize = this.pageSize;
        queryParam.pageNo = this.pageNo;

        if (!this.url) {
          return;
        }

        //告警列表更新列表，触发树更新
        if (this.$route.path.indexOf('/alarm/list') != -1 ) {
          this.$parent.getTreeData();
        }

        //过滤掉空值的数据项
        let resultPara = {};
        for (let p in queryParam) {
          if (queryParam[p] !== '') {
            resultPara[p] = queryParam[p];
          }
        }

        //bySearch:true  --查询      配置中加字段判断走list接口还是查询接口
        if (this.$route.path.indexOf('/config') != -1 && Object.keys(resultPara).length > 3) {
          resultPara.bySearch = true;
        }
        this.loadingUsergroupList = true;
        this.action(this.url, resultPara).then((res) => {
          this.loadingUsergroupList = false;
          if (res.status == true) {

            if (res.data instanceof Array) {
              this.tableData = res.data;
              this.total = res.data.length;
            } else {
              this.tableData = res.data.list || [];
              this.total = res.data.total || Number(res.data.totalNum) || 0;
            }
            this.$emit('handleData',this.tableData);
          }
        }).catch((err) => {
          // this.$message.error(err);
          this.loadingUsergroupList = false;
        });
      },
      //路由变更触发数据刷新
      getDataRoute () {
        if (this.$route.query.v == undefined) return;
        if (!this.dialog){
          this.getData();
        }
      },
      // 刷新列表数据
      refresh () {
        this.pageNo === 1 ? this.getData() : (this.pageNo = 1);
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-01-30
       * @Desc: 设置表格高度
       */
      setHeight () {
        let that = this;
        this.$nextTick(function(){
          let table = that.$refs.pgTable;
          let top = table && table.offsetTop;
          let tableTab = this.$parent.$parent.$parent.$refs.tableTab;

          if (this.$parent.$parent.$parent.$el.className == 'el-tabs')
            tableTab = this.$parent.$parent.$parent;

          //含有tab页的表格自适应
          tableTab && (top = tableTab.$el.offsetTop + 111);

          that.height = document.body.clientHeight - 100 - top - 50;

          (that.Dheight > 400 ) && (that.resizeH = that.height);
        });
      },
      selectToCheck (row, event, column) {
        if (row.disabled) {
          return
        }
        let index =  this.multipleSelection.findIndex((value, index, arr) => {
          return value === row;
        });
        if (index === -1) {
          if (this.isSingleMode) {
            this.toggleSelection(this.multipleSelection, row)
          }
        }
        this.$refs.tableInner.toggleRowSelection(row);
        this.$emit('row-click',row);
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-02-10
       * @Desc: 触发过滤与后台交互
       */
      filterChange (filters) {
        //判断时间差点击间隔不能小于10s，过滤重复点击
        let eTime = +new Date();

        if (bTime != 0 && (eTime - bTime < 500 )) return;
        bTime = +new Date();

        let childTd =  this.$refs.tableInner.$children;
        for (let p in filters){
          let index =  childTd.findIndex((value, index, arr) => {
            return value.columnId == p;
          });
          let key = childTd[index].prop;
          let queryKey = key;

          if (key=='cloudName')
            key = 'cloud_id';


          //处理监控页面查询头与表格字段不匹配的命名规则
          if (this.$route.path.indexOf('/collection') != -1) {
            let split = key.split('_');
            if (split.length > 1)
              queryKey = split[0] + split[1].substring(0,1).toUpperCase()+ split[1].substring(1);
          }

          this.queryForm[queryKey] = filters[p][0];

          if (p == 'cloud_id')
            this.getData();
        };

        if (!this.$store.state.query) {
          this.$parent.$parent.$refs.querycol && this.$parent.$parent.$refs.querycol.queryList();
          this.$parent.$parent.$parent.$refs.querycol && this.$parent.$parent.$parent.$refs.querycol.queryList();
        } else {
          this.getData();
        }  
      },

      tplDoNull (row, column, cellValue) {
        if (cellValue)
          return util.tplDoNull(cellValue);
        else
          return '--';
      },
      toggleSelection (selection, row) {
        // const tempSelection = JSON.parse(JSON.stringify(selection))
        // 由于拷贝了对象，此处需要有匹配主键，由于ID为空，域管理例子用的domainId
        // for (let item of tempSelection) {
        //   if (row && row.domainId === item.domainId) {
        //     continue
        //   }
        //   const find = this.tableData.find(child => child.domainId === item.domainId)
        //   !!find && this.$refs.tableInner.toggleRowSelection(find)
        // }
        // 由于屏蔽了全选按钮不用拷贝对象
        selection.forEach(item => {
          if (item !== row) {
            this.$refs.tableInner.toggleRowSelection(item)
          }
        })
      }
    },
    mounted () {
      let that = this;
      // this.refresh();
      //判断是否有路由参数
      let hasRoute = false;
      for (let p in this.$route.query) {
        if ( p == 'jump')
          hasRoute = true;
      }

      if (this.$store.state.backObj) {

        for (let p in this.$store.state.backObj) {
          if (p == 'cloud_id') delete this.$store.state.backObj[p];
          this.queryForm[p] = this.$store.state.backObj[p];
        }

        if (this.$parent.$refs.querycol) {
          this.$parent.$refs.querycol.queryList(null, null, this.queryForm);
        } else
          this.getData();

        this.$store.state.backObj = {};
      } else if ( !hasRoute && this.showData){
        this.refresh();
      }

      this.setHeight();
    }
  };

</script>
<style lang="less" scoped>
  /deep/ .single-mode {
    table thead tr th .el-checkbox {
      display: none;
    }
  }
</style>
