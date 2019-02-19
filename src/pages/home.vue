<template>
  <div class="main-panel" :style="style">
    <v-header></v-header>
    <page :menu="menu">
      <transition name="page-transition">
        <router-view v-if="isRouterAlive"></router-view>
      </transition>
    </page>
  </div>

</template>
<script>
  // import navList from '@/nav.config.json'
  import configure from '@/config/dolphin.config'
  import { mapState, mapActions } from 'vuex'
  import vHeader from 'index@/components/header.vue'

  export default {
    name: 'home',
    components: {vHeader},
    data () {
      return {
        menu: [],
        encrypt: null,
        isRouterAlive: true
      }
    },
    provide () {
      return {
        reload: this.reload
      }
    },
    computed: {
      ...mapState(['reloadAnyway', 'headerHeight', 'loginUser', 'resize']),
      style () {
        const style = {}
        style.paddingTop = `${this.headerHeight}px`
        return style
      }
    },
    created () {
      console.log('home')
      // const loginUser = JSON.parse(window.localStorage.getItem('loginUser'))
      // const config = loginUser.role === 'admin' ? 'config' : 'config1'
      // const navList = require(`@/nav.${config}.json`)

      const navList = require('@/nav.config.json')
      const { urlPrefix } = configure

      // 开发模式菜单全展示
      navList.forEach(element => {
        element.title = this.$t(element.title)
        element.router = element.router  ?  ((element.router.indexOf(urlPrefix) != -1 ? '' : urlPrefix) + element.router) : element.router;
        if (element.children && element.children.length) {
          element.children.forEach(child => {
            child.title = this.$t(child.title)
            child.router = (child.router.indexOf(urlPrefix) != -1 ? '' : urlPrefix) + child.router
          })
        }
      })
      this.menu = navList
    },
    mounted () {
      this.setHeight(document.body.clientHeight - this.headerHeight)
      window.addEventListener('resize', this.resizeWindow, false)
    },
    methods: {
      ...mapActions(['setHeight', 'setResize']),
      reload () {
        if (!this.reloadAnyway) {
          return
        }
        this.isRouterAlive = false
        this.$nextTick(() => {
          setTimeout(() => {
            this.isRouterAlive = true
          })
        })
      },
      resizeWindow () {
        this.setHeight(document.body.clientHeight - this.headerHeight)
        this.setResize(!this.resize)
      }
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.resizeWindow, false)
    }
  }
</script>
<style lang="less" scoped>
  .main-panel {
    position: relative;
    width: 100%;
    height: 100%;
    /deep/ .page-menu {
      position: absolute;
    }
  }
</style>
