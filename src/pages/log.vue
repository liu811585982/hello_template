<template>
  <page-container class="logWrap" :breadcrumb="i18nBreadcrumb">
      <!--工具栏-->
     <!-- <div class="toolbar" ref="toolbar">
        <el-button type="iconButton" icon="h-icon-export">{{$t("config.log.export")}}</el-button>
      </div>-->
      <!--查询条件-->
      <el-form ref="logForm" :model="queryForm" class="collForm clearfix" label-width="80px">
        <query-list
          ref="querycol"
          :queryForm="queryForm"
          table="logTable"
          form="logForm"
          :tags="tags"
          :isExport="true"
          input="请输入查询字段"
          @queryList="queryLogList">
          <div v-show="$store.state.query">
            <el-form-item class="inlineLabel" :label="$t('config.log.username')" prop="username">
              <el-input v-model="queryForm.username" class="log"></el-input>
            </el-form-item>
            <el-form-item class="inlineLabel" :label="$t('config.log.client_ip')" prop="client_ip">
              <el-input v-model="queryForm.client_ip" class="log"></el-input>
            </el-form-item>
            <el-form-item class="inlineLabel" v-bind:label="$t('config.log.server_ip')" prop="server_ip">
              <el-input v-model="queryForm.server_ip" class="log"></el-input>
            </el-form-item>
            <el-form-item class="inlineLabel" style="clear:both" v-bind:label="$t('config.log.create_time')" prop="create_time">
              <el-date-picker
                v-model="timeVal"
                type="daterange"
                placeholder="选择日期范围"
                @change="getDate"
                :editable="false"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="inlineLabel" v-bind:label="$t('config.log.describe')" prop="describe">
              <el-input v-model="queryForm.describe" class="describe"></el-input>
            </el-form-item>
          </div>
        </query-list>
      </el-form>
      <!--日志列表-->
      <page-table ref="logTable" :url="logUrl" :queryForm="queryForm">
        <el-table-column prop="uid" label="用户" width="130"></el-table-column>
        <el-table-column prop="ip" label="用户IP" width="130"></el-table-column>
        <el-table-column prop="datetime" label="操作时间" width="150"></el-table-column>
        <el-table-column prop="desc" label="内容"  :show-overflow-title="true"></el-table-column>
      </page-table>
  </page-container>
</template>

<script>
  import pageTable from 'index@/components/pageTable.vue'
  import cBread from 'index@/components/bread.vue'
  import http from 'index@/api/index'
  import util from 'index@/utils/util'
  import queryList from 'index@/components/queryList.vue'

  export default {
    components: {
      pageTable,
      queryList
    },
    props: ['breadcrumbObj'],
    data () {
      return {
        util: util,
        logUrl: '/platform/log/list',
        queryForm: {
          cloudId:'',
          username:'',
          client_ip: '',
          server_ip: '',
          create_time: '',
          describe: ''
        },
        tags:[],
        timeVal:'',
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },

    methods: {
      // 表格组件更新数据
      refreshTable () {
        this.$refs.logTable.refresh();
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-03-15
       * @Desc: 获取日历控件的时间
       */
      getDate (val) {
          this.queryForm.create_time = val;
          console.log(val);
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-03-15
       * @Desc: 查询并生成tag
       */
      queryLogList (tags) {
        let keys = ['username','client_ip','server_ip','create_time','describe'];
        let queryTxt = {};
        let that = this;

        keys.forEach(function(v){
          queryTxt[v] = that.$t('config.log.'+v);
        });

        this.tags = tags;
        this.$refs.logTable.getData();
        for (let p in queryTxt){
          if (this.queryForm[p]){
            this.tags.push({
              name: p,
              value: queryTxt[p] + ' : ' + (this[p] ? this[p][this.queryForm[p]] : this.queryForm[p])
            })
          }
        }
      }
    }
  }
</script>
<style lang="less">
  .logWrap{
    .el-date-editor--daterange.el-input{
      width:180px;
      input{
        width:180px;
      }
    }
    .inlineLabel{
      .describe input{
        width:470px;
      }
    }
  }

</style>
