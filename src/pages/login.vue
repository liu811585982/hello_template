<template>
  <div class="login">
    <div class="login_box">
      <header class="login_header">
        <div class="logo header-logo mode-home">{{$t('login.name')}}</div>
      </header>
      <div class="rel">
        <el-button type="text" class="abs register" @click="registerBtn">立即注册</el-button>
        <span class="error_txt" v-show="!!error_txt">{{error_txt}}</span>
        <div class="changeLang abs">
          <!-- <el-dropdown @command="switchLang">
             <span class="el-dropdown-link">
               {{language}}<i class="h-icon-angle_down el-icon&#45;&#45;right"></i>
             </span>
             <el-dropdown-menu slot="dropdown" class="lang">
               <el-dropdown-item command ='zh-CN'>简体中文</el-dropdown-item>
               <el-dropdown-item command ='en-US'>English</el-dropdown-item>
             </el-dropdown-menu>
           </el-dropdown>-->
        </div>
        <!-- <span class="tips">请输入用户名和密码登入系统</span>-->
        <el-form :model="signin" :rules="rules" ref="signin" class="loginForm">
          <el-form-item prop="userName" class="userItem">
            <i class="licon h-icon-user"></i>
            <el-input v-model="signin.userName" :placeholder="$t('login.username')"></el-input>
          </el-form-item>
          <el-form-item prop="passWord" class="passItem">
            <i class="licon h-icon-lock"></i>
            <el-input type="password" v-model="signin.passWord" :placeholder="$t('login.password')" value=""></el-input>
          </el-form-item>
          <el-form-item prop="vCode" class="yzm" v-if="showVCode">
            <el-input type="text" v-model="signin.vCode" :placeholder="$t('login.vCode')" width="100" value=""></el-input>
            <img :src="'data:image/png;base64,'+ vCodeUrl" id="crtCheckCode" align="middle" width="140" height="40" style="position:relative;top:-5px;" @click="changeAuCode()"/>
            <a href="javascript:void(0);"  @click="changeAuCode()">{{$t('login.change')}}</a>
          </el-form-item>
          <span class="loginBtn" @click="signIn('signin')" @keyup:enter="signIn('signin')">{{loginTxt}}</span>
        </el-form>
      </div>
    </div>
    <!-- <div class="foot">
      版权信息
    </div>-->
    <edit-pass ref="editPass" :pwdChangeDlgVis="pwdChangeDlgVis" :title="$t('pass.title1')" :user="signin.userName" url="/platform/login/updateResetPin" @closeEditDlg="pwdChangeDlgVis=false"></edit-pass>
    <el-dialog title="用户注册" :visible.sync="showRegister" :area="610" :close-on-click-modal="false" top="middle">
      <span class="abs jumpTolog">已有账号?<el-button type="text" @click="showRegister=false">快捷登录</el-button></span>
      <el-form ref="regForm" label-width="120px" :rules="regRules" content-width="300px" :model="regForm">
        <el-form-item label="用户名" prop="nick">
          <el-input v-model="regForm.nick"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="pin">
          <vali-pass ref="valiPass" v-model="regForm.pin" @valiRisk="risk=arguments[0]"></vali-pass>
        </el-form-item>
        <el-form-item label="密码确认" prop="rePin">
          <el-input type="password" v-model="regForm.rePin"></el-input>
        </el-form-item>
        <el-form-item label="空间大小" prop="userSize">
          <el-input v-model="regForm.userSize">
            <template slot="append">GB</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setRegister('regForm')">确定</el-button>
          <el-button @click="resetForm('regForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="copyright">© 2017-{{year}} 杭州海康威视数字技术股份有限公司版权所有</div>
  </div>
</template>
<script>
  import http from 'index@/api/index'
  import { use } from 'hui/lib/locale';
  import enLocale from 'hui/lib/locale/lang/en';
  import zhLocale from 'hui/lib/locale/lang/zh-CN';
  import lang from 'index@/libs/lang.js';
  import { JSEncrypt } from 'jsencrypt';
  import editPass from 'index@/components/editPass.vue';
  import valiPass from '@/components/valiPass'  //密码校验组件
  import util from 'index@/utils/util';
  import validates from '@/utils/form-validate'


  export default {
    components: {
      editPass,valiPass
    },
    data () {
      return {
        showRegister:false,
        language: window.localStorage.language == 'zh-CN' ? '简体中文' : 'English',
        vCodeUrl:'',
        error_txt:'',//错误提示
        vcode: '', //验证码
        signin: {
          userName: '',
          passWord: '',
          vCode: ''
        },
        loginTxt:this.$t('login.btn'),
        encrypt: null,
        showVCode: false,
        rules: {
          userName: [
            {required: true,message: this.$t('login.v1'),trigger: 'blur'},
            /*  { validator: this.valiUserName,trigger: 'blur' }*/
          ],
          passWord: [
            {required: true,message: this.$t('login.v2'),trigger: 'blur'}
          ],
          vCode: [
            {required: true,message: this.$t('login.v3'),trigger: 'blur'}
          ]
        },
        pwdChangeDlgVis:false,//强制修改密码弹出框
        regForm: {
          nick:'',
          pin:'',
          rePin:'',
          userSize:''
        },
        regRules:{
          nick:[
            {required: true,message: this.$t('config.validator.required'),trigger: 'blur'},
            {min: 5, max: 64, message: this.$t('common.rangeStr',{x:5,y:64}), trigger: 'blur'},
            {validator: validates.string2,trigger: 'blur' }
          ],
          pin:[
            {required: true,message: this.$t('config.validator.required'),trigger: 'blur'},
            {min: 8, max: 16, message: this.$t('common.rangeStr',{x:8,y:16}), trigger: 'blur'},
            {validator:this.valiRisk,trigger: 'blur'}
          ],
          rePin:[
            {required: true,message: this.$t('config.validator.required'),trigger: 'blur'},
            { min:8,max:16,message: this.$t('pass.length',{x:8,y:16}),trigger: 'blur'   },
            {validator:this.validatePass,trigger:'blur'}
          ],
          userSize: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: this.sizeVali, message: '请输入1-8589934591之间的整数',trigger: 'blur' }
          ]
        },
        risk:false,
        year: util.getYear(),
        jump:false //是否跳转到初始化密码页面
      }
    },
    created () {
      this.isInitPass();

      //设置公钥
      this.encrypt = new JSEncrypt();
      let publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKZKgabcPik14D8DSWVMMNjo+08NQNxRTjH6bBlD8CaAviLdN+EVcBR4wCpSQrzd1gngafZGVzBFWKitxh5fZcAHq3BJjhtVvpsuRgxLNmgWk8Mt1nzxSkGqe5hiWZ5i2p9dN/iq6kZi0cPlkIv55D4AjD6g82durpL4qKKCVm6wIDAQAB";
      this.encrypt.setPublicKey(publicKey);
      let that = this;
      document.onkeydown = function (e) {
        if (e.keyCode === 13 && !that.pwdChangeDlgVis && !this.jump) {
          // 回车事件
          that.signIn('signin');
        }
      }

      if (!window.localStorage.language) {
        http.getRequest('/platform/login/language', 'get')
          .then(res => {
            if (res.status) {
              let langD = (res.data == 'zh_cn' ? 'zh-CN' : 'en-US');
              lang.set(langD);
            }
          });
      }
    },
    methods: {
      //判断是否初始化，跳转初始化密码页面
      async isInitPass () {
        //第一次判断有没有授权
        const res = await http.getRequest('/platform/login/isInitPass', 'post')
        if (res.status && !res.data) {
          this.$router.push('/hos/initPass');
          this.jump = true;
        }
      },
      /**
       * 验证码点击 换一张
       * @author wangjing
       * @date 2018-7-10
       */
      changeAuCode(){
        http.getRequest('/platform/login/vCode', 'get')
          .then(res => {
            if (res.status) {
              this.vcode = res.vcode;
              this.vCodeUrl = res.data;
            }
          });
      },

      // 登录
      signIn (formName , pass) {
        //this.$router.push({ path: this.$route.query.redirect || '/home' });
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loginTxt = this.$t('login.btnLoad');
            let params = {
              userName: this.signin.userName,
              passWord: this.encrypt.encrypt(pass || this.signin.passWord),
              //passWord: this.signin.passWord,
              vCode: this.signin.vCode
            };
            window.localStorage.removeItem('accessToken');
            window.localStorage.removeItem('gCloudId');
            window.localStorage.removeItem('gDeployMode');
            window.localStorage.removeItem('gCloudType');
            window.sessionStorage.removeItem('clouds');
            token.clear();
            this.$store.dispatch('setToken', null);

            http.getRequest('/platform/login', 'post', params,null,{vcode:this.vcode})
              .then(res => {
                /*登录校验
                 1密码未初始化、3停用账户、4对外接口用户不允许登陆、5验证码密文为空(前端没有传加密vCode)、
                 6验证码无效(前端传来的vCode解密失败)、7验证码超时(验证码30分钟内有效)、 8验证码校验失败、
                 9密码错误次数超限，1小时内不能登录、10密码验证失败*/

                if (res.status) {
                  // 登录成功后重置token
                  token.set(res.data.token);
                  window.localStorage.setItem('user', this.signin.userName);

                  if (res.data.role == 'admin') {
                    this.$router.push('/hos/main')
                  } else {
                    this.$router.push('/hos/user')
                  }


                  this.$store.commit('SET_LOGIN_USER', res.data);
                  window.localStorage.setItem('loginUser', JSON.stringify(res.data));
                } else {
                  this.error_txt = res.data.msg;
                  this.signin.vCode = '';
                  this.loginTxt = this.$t('login.btn');
                  this.signin.passWord = '';

                  //密码初始化
                  if (res.data.status == 1) {
                      this.pwdChangeDlgVis = true;
                  }

                  if (res.data.failedTimes >= 3 && res.data.status != 1) {
                    //显示验证码
                    //错误三次出现验证码
                    this.showVCode = true;
                    this.changeAuCode();
                  } else {
                    this.showVCode = false;
                  }
                }
              })
              .catch(err => {
                this.loginTxt = this.$t('login.btn');
              })
          } else {
            return false
          }
        })
      },
      //关闭修改对话框
      closeEditDlg () {
        this.pwdChangeDlgVis = false;
      },
      switchLang (locale) {
        this.$i18n.locale = locale;
        this.language = (locale == 'zh-CN' ? '简体中文' : 'English');
        lang.set(locale);
        use(locale === 'zh-CN' ? zhLocale : enLocale);
        window.location.reload();
      },
      //修改密码成功后清空用户名密码
      resetForm (form) {
        this.$refs[form].resetFields();
        this.$refs.valiPass.resetField();
      },
      //校验风险密码
      valiRisk (rule, value, callback) {

        if (this.risk) {
          callback(new Error(this.$t('pass.v5')));
        } else {
          callback();
        }
      },

      /**
       *  校验再次输入密码，必须与新密码一致 input校验
       * @author wangjing
       * @date 2018-07-10
       */
      validatePass (rule, value, callback){
        if (value === '') {
          callback(new Error(this.$t('pass.v3')));
        } else if (value !== this.regForm.pin) {
          callback(new Error(this.$t('pass.v6')));
        } else {
          callback();
        }
      },

      //用户空间校验
      sizeVali (rule, value, callback) {
        let result = '';
        if (/\D/.test(value)) {
          result = '请输入1-8589934591之间的整数';
        } else {
          if (value < 1 || value > 8589934591) {
            result = '请输入1-8589934591之间的整数';
          }
        }

        if (result)
          callback(new Error(result));
        else
          callback();
      },

      //打开注册对话框
      registerBtn () {
        this.$refs.regForm && this.$refs.regForm.resetFields();
        this.showRegister = true;
        this.$refs.valiPass && (this.$refs.valiPass.currentValue = '');
        this.$refs.valiPass && (this.$refs.valiPass.valiPass.show = false);
      },

      //用户注册
      setRegister (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.regForm.pin = this.encrypt.encrypt(this.regForm.pin);
            this.regForm.rePin = this.encrypt.encrypt(this.regForm.rePin);
            http.getRequest('/platform/login/register', 'post', this.regForm)
              .then(res => {
                if (res.status) {
                  util.alert(res.data,'success');
                  this.showRegister = false;
                } 

                this.regForm.pin ='';
                this.regForm.rePin = '';
                this.regForm.userSize = '';
                this.$refs.valiPass.currentValue = '';
                this.$refs.valiPass.valiPass.show = false;
                
              });
          }
        });
      }
    }
  }
</script>
<style lang="less" scoped>
  .register{
    width:80px!important;
    right:10px;
    top:18px;
  }
  .jumpTolog{
    top:0;
    right:10px;
    height:22px;
    background:#fff;
  }
  .copyright{
    position: absolute;
    bottom: 3%;
    width: 100%;
    text-align: center;
    color: #e1e1e1;;
  }
</style>
