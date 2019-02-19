<template>
  <page-container :breadcrumb="i18nBreadcrumb" :showReturnIcon="true" :returnEvent="goBack">
    <div class="basicMes">
      我是子页面
    </div>
  </page-container>
</template>
<script>
  import util from '@/utils/util'
  import http from 'index@/api/index'
  export default {
    props: ['breadcrumbObj'],
    data () {
      return {

      }
    },
    created () {
    },
    methods: {
      goBack () {
        util.jump('/hik/demo')
      }
    }  
  }
</script>
