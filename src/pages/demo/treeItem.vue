<template>
  <div class="tree-item">
    <!-- <span class="label">{{data.label}}</span>
    <el-input v-model="data.value" size="small" class="value" @change="handleChange"></el-input> -->
    <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" @node-dbclick="handleNodeDbClick"></el-tree>
  </div>
</template>
<script>
  export default {
    name: 'treeItem',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        treeData: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    created () {
      console.log(this.data);
    },
    methods: {
      handleChange (val) {
        this.$emit('change', val)
      },
      handleNodeClick(data) {
        console.log(data);
      },
      handleNodeDbClick(data) {
        console.log(data);
      }
    }
  }
</script>

<style lang="less" scoped>
  .tree-item {
    .label {
      width: 47px;
    }
    /deep/ .value {
      width: calc(100% - 47px);
    }
  }
</style>
