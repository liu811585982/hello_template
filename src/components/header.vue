<template>
  <div>
    <header class="header" ref="header">
      <div class="header-brand">{{$t('login.name')}}</div>

      <div class="nav-item">
        <div class="changeLang abs">
          <!--<el-dropdown @command="switchLang">
            <span class="el-dropdown-link">
              {{language}}<i class="h-icon-angle_down el-icon&#45;&#45;right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command ='zh-CN'>简体中文</el-dropdown-item>
              <el-dropdown-item command ='en-US'>English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
        </div>

        <div class="logout">
          <el-dropdown>
            <span class="el-dropdown-link" style="color:#fff;font-size:14px;">
              {{user}}
              <i class="h-icon-user" style="font-size:16px;color:#fff;"></i><i class="h-icon-angle_down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="lang">
              <el-dropdown-item @click.native="editPass">{{$t('pass.title2')}}</el-dropdown-item>
              <el-dropdown-item @click.native="logout">{{$t('login.logout')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </header>
    <edit-pass ref="editPass" :pwdChangeDlgVis="pwdChangeDlgVis" url="/platform/user/updatePassword" @closeEditDlg="closeEditDlg"></edit-pass>
  </div>
</template>
<script>
   import { use } from 'hui/lib/locale';
   import enLocale from 'hui/lib/locale/lang/en';
   import zhLocale from 'hui/lib/locale/lang/zh-CN';
   import lang from 'index@/libs/lang.js';
   import editPass from 'index@/components/editPass.vue';
   import http from 'index@/api/index'
   import util from 'index@/utils/util'
   import token from 'index@/libs/token'

  export default {
    components: {
      editPass
    },
    data () {
      return {
        user: window.localStorage.user,
        locales: ['en-US', 'zh-CN'],
        language: window.localStorage.language == 'zh-CN' ? '简体中文' : 'English',
        changeMenu: '',
        configLink: '',
        pwdChangeDlgVis:false//强制修改密码弹出框
      }
    },
    created () {
    },
    methods: {
        switchLang (locale) {
           this.$i18n.locale = locale;
           this.language = (locale == 'zh-CN' ? '简体中文' : 'English');
           lang.set(locale);
           use(locale === 'zh-CN' ? zhLocale : enLocale);
           window.location.reload();
        },
        setMenu (index, path) {
          this.changeMenu = index;

          this.$router.push({
            path,
            query: {
              v: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
            }
          });
        },

        //修改密码
        editPass () {
          this.pwdChangeDlgVis = true;
          this.$refs.editPass.resetForm();
        },
        //关闭修改对话框
        closeEditDlg () {
          this.pwdChangeDlgVis = false;
        },
        //登出
        logout () {
          window.localStorage.removeItem('accessToken');
          window.localStorage.removeItem('gCloudId');
          window.localStorage.removeItem('gDeployMode');
          window.localStorage.removeItem('gCloudType');
          window.sessionStorage.removeItem('clouds');
          window.localStorage.removeItem('loginUser');
          this.$store.commit('SET_LOGIN_USER', {});
          token.clear();
          this.$store.dispatch('setToken', null);
          this.$router.push({ path: '/login' });
        },
        //跳转到配置页
        jumpToConfig () {
          util.showMask('跳转中...');
          http.getRequest('/analysis/overview/getClusterList', 'get')
            .then(res => {
              if (res.status) {
                  util.hideMask();
                let cloudlist = res.data;
                this.configLink = 'http://10.192.66.23:5120/login?cloudId='+ cloudlist[0].id ;
                this.$nextTick(function(){
                  document.getElementById("jumpToConfigLink").click();
                });
              }
            });
        }
    }
  };
</script>
<style scoped>
  .logout {
    /* 修复用户名过长时右边下拉按钮被挤到下边 */
    width: auto;
  }
</style>

