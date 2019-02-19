<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item  @click.native="refRoute(path[index])" :to="path[index]" v-for="(text,index) in bread" :key="index">{{text}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button v-show="cShowBack" class="backBtn" type="iconButton" icon="h-icon-arrow_left_circle" @click="backToPrev($event)"></el-button>
  </div>
</template>
<script>
  export default {
    props: ['bread','path','back','cloudId'],
    data () {
      return {

      }
    },
    watch: {
      '$route': 'getBack'
    },
    computed:{
      cShowBack () {
        if (this.back) return true;

        let lenB = this.path.length;
        let lenE = this.bread.length;

        if (lenE > lenB){
          return true;
        }else{
          return false;
        }
      }
    },
    mounted () {
      this.$store.commit('SET_BREAD', false);  //去掉面包屑导航
    },
    beforeDestroy () {
      this.$store.commit('SET_BREAD', true);  //恢复面包屑导航
    },
    methods: {
      refRoute (path) {
        //云列表添加cloudId
        let queryData = {};
        for ( let p in this.$router.query) {
          queryData[p] = this.$router.query[p];
        }
        queryData.v = +new Date();

        this.$router.push({
          path,
          query: queryData
        });
      },
      backToPrev (event) {
        if (event){
          event.stopPropagation();
        }

        this.$store.state.backObj = this.$store.state.queryObj;

        //返回至云列表不带参数
        if (this.$route.path.indexOf('/collection/cloud/view') != -1)
          this.$store.state.backObj = {};

        this.$emit("changeDlg");
      },
      getBack () {
        if (this.cShowBack && this.$route.path.indexOf('/collection/cloud/view') == -1) {
          this.backToPrev();
        }
      }
    }
  }
</script>

