/**
 * 预览已有的svg图片
 */
<template>
  <div class="svg-viewer">
    <div class="svg" v-for="(item, index) in svgList" :key="index" :title="item">
      <figure>
        <svg-icon :type="item"></svg-icon>
        <figcaption>{{item}}</figcaption>
      </figure>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        svgList: []
      }
    },
    mounted () {
      this.initSvgList()
    },
    methods: {
      initSvgList () {
        this.svgList = require.context('@/icons/svg', false, /\.svg$/).keys().map(item => {
          // item example ./volume.svg
          return item.replace(/^\.\/(\w+?)\.svg$/, '$1')
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .svg-viewer {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    flex-flow: row wrap;
    font-size: 18px;
    .svg {
      flex: 0 0 30px;
      text-align: center;
      // overflow: hidden;
    }
  }
</style>
