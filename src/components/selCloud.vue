<template>
  <el-form-item :label="$t('common.cloudName')" prop="cloudId">
    <input v-model="cloudId" type="hidden" />
    <el-input v-model="cloudName" style="width:200px" :readonly="true" disabled></el-input>
    <el-button @click="showCloud=true">{{$t('menu.cloudlist')}}</el-button>
    <cloud-list :showCloud="showCloud" @chooseCloud="chooseCloud" @exitCloudDlg="showCloud = false"></cloud-list>
  </el-form-item>
</template>
<script>
  import cloudList from 'index@/components/cloudList.vue'
  export default {
    components: {
      cloudList
    },
    props: ['cloudNameD'],
    data () {
      return {
        showCloud: false,
        cloudName: ''
      }
    },
    computed: {
      cloudId () {
          let _this = this;
          let cloudId = this.$store.state.gCloudId;
          let cloudList = this.$store.state.cloudList;

          if (cloudId && cloudList.length) {
            cloudList.forEach(function(v){
              if (v.id == cloudId) {
                _this.cloudName = v.name;
                _this.$emit('choose',v.id,v.name);
              }
            });
          }
          return cloudId;
        }
    },
    beforeDestroy () {

    },
    methods: {
      chooseCloud (cloud) {
        this.cloudName = cloud.name;
        this.showCloud = false;
        this.$store.state.gDeployMode =  cloud.mode;
        this.$emit('choose',cloud.id,cloud.name);
      }
    }
  }
</script>
