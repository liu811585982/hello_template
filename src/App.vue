<template>
  <div class="fill" v-loading.fullscreen.lock="$store.state.mask"  :element-loading-text="typeof($store.state.mask) == 'string' ? $store.state.mask : $t('common.loading')"  element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <transition :name="transition">
      <router-view></router-view>
    </transition>
    <!--<color-tool></color-tool>-->
  </div>
</template>

<script>
import ColorTool from '@/components/ColorTool'

export default {
  name: 'app',
  components: {ColorTool},
  data () {
    return {
      menu: [],
      encrypt: null,
      transition: ''
    }
  },
  created () {

  }
}
</script>
<style lang="less">
  @import './styles/main.less';
</style>
