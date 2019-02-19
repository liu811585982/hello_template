<style>
  .error {
    color: red;
  }

  .warn {
    color: orange;
  }

  .success {
    color: green;
  }
</style>
<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-arrow_right" @click="jumtoChild">子页面</el-button>
    </div>
    <el-transfer
      filterable
      filter-placeholder="请输入关键词过滤"
      search-placeholder="查询查询"
      :search-method="searchMethod"
      :render-content="renderContent"
      v-model="value"
      :data="data">
    </el-transfer>
  </page-container>
</template>
<script>
  import util from '@/utils/util'
  import http from 'index@/api/index';
  import treeItem from './treeItem'
  export default {
    components: { treeItem },
    props: ['breadcrumbObj'],
    data() {
      const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${ i }`,
            disabled: i % 4 === 0,
            value: parseInt(Math.random() * 100)
          });
        }
        return data;
      };
      return {
        data: generateData(),
        value: [1, 4]
      };
    },
    methods: {
      searchMethod(val) {
        // 在这里可以发起异步请求等，从而加载更多数据
        console.log(`transfer查询，输入值：${val}`)
      },
      renderContent (h, data) {
        return h(treeItem, {
          props: {
            data
          },
          on: {
            // change: (val) => {
            // }
            // or,
            change: this.handleChange
          }
        })
      },
      handleChange (val) {
        alert(val)
      },
      jumtoChild () {
      }
    }
  }
</script>
