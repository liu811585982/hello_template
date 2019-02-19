<template>
  <page-sidebar>
    <span class="noDataShow" v-if="rootSelectable && (!curTreeData[0].children.length)">暂无数据</span>
    <template slot="sidebarToolbar" v-if="showTools">
     <!-- <el-tooltip effect="dark" content="编辑" placement="top">
        <el-button type="iconButton" icon="h-icon-edit"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="删除" placement="top">
        <el-button type="iconButton" icon="d-icon-base-trashcan"></el-button>
      </el-tooltip>
      <div class="dividing"></div>
      <el-dropdown trigger="click" class="page-more-tools">
        <el-button type="iconButton" icon="h-icon-more_circle_horizontal"></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>导入</el-dropdown-item>
          <el-dropdown-item>导出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
      <slot name="sidebar_toolbar">
        <el-tooltip effect="dark" content="创建Bucket" placement="top">
          <el-button type="iconButton" icon="h-icon-plus" @click="add">创建Bucket</el-button>
        </el-tooltip>
      </slot>
    </template>
   <!--<template slot="sidebarSearch">
      <el-input
        v-model="treeSearchKey"
        :placeholder="placeholder"
        icon="h-icon-search"
        clearable
        :on-icon-click="handleSearchTree"
        @keyup.enter.native="handleSearchTree"
        :clear-icon-click="handleClearTree"
        ></el-input>
    </template>-->
    <el-tree
      ref="bucketTree"
      class="buckTree"
      :data="curTreeData"
      :props="defaultProps"
      node-key="id"
      default-expand-all
      :default-checked-keys = "[1]"
      @current-change="handleCurrentChange"
      :show-checkbox="showCheckbox"
    ></el-tree>
  </page-sidebar>
</template>

<script>
export default {
  name: 'sidebar',
  props: {
    showTools: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default: []
    },
    placeholder: {
      type: String,
      deplaceholderfault: '请输入Bucket名称'
    },
    currentKey: { // 当前选中
      type: String|Number
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    rootSelectable: { // 根节点是否可选
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
        selectable: this.checkSelectable
      },
      treeSearchKey: ''
    }
  },
  computed: {
    curTreeData () {
      if (!this.treeData.length || (this.treeData.length && !this.treeData[0].children.length && !this.rootSelectable)) {
        return []
      } else {
        return this.treeData
      }
    }
  },
  mounted () {
    if (this.curTreeData.length) {
      const currentKey = this.currentKey || (this.rootSelectable ? 0 : 1)
      this.setTreeChoosed(currentKey)
    }
  },
  methods: {
    handleSearchTree () {

    },
    handleClearTree () {
      this.treeSearchKey = ''
      this.handleSearchTree()
    },

    //设置树的选中及点击--wangjing9
    setTreeChoosed(link) {
      this.$refs.bucketTree.setSelected(link);
    },

    //点击树节点触发方法
    selectTreeNode (data) {
      // this.$emit('selectTreeNode',data);
    },

    // 当前选中发生改变触发方法
    handleCurrentChange (data, node) {
      this.$emit('selectTreeNode', data)
    },

    //添加操作 事件透传
    add () {
        this.$emit('add');
    },

    checkSelectable (data, node) {
      if (data.id === 0 && !this.rootSelectable) {
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less" scoped>
  .page-sidebar-main.show-tools {
   height: calc(~"100% - 80px");
  }
 /* .buckTree /deep/ .el-checkbox{
    display:none;
  }*/

  .buckTree /deep/ .el-tree__empty-text {
    top: 10%;
  }
  .noDataShow{
    position: absolute;
    top: 130px;
    z-index: 999;
    width: 100%;
    text-align: center;
  }
</style>
