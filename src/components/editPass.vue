<template>
    <!--强制修改密码弹出框-->
    <el-dialog :title=" title || $t('pass.title2')" :visible.sync="pwdChangeDlgVis" :area="600" :close-on-click-modal="false" top="middle" :before-close="closeDlg">
      <el-form :model="pwdChangeForm" :rules="updataPwdRules" :label-width="en ? '140px' : '100px'" class="editForm" ref="editForm">
        <el-alert
          class="editAlert"
          :title="$t('pass.tips')"
          type="success"
          :closable="false"
          simple>
        </el-alert>
        <el-form-item :label="$t('pass.pass1')"  prop="passOld" style="margin-bottom:0;height:55px;">
          <el-input type="password" v-model="pwdChangeForm.passOld" size='small'></el-input>
        </el-form-item>
        <el-form-item :label="$t('pass.pass2')"  prop="passNewReset" style="margin-bottom:0;height:55px;">
          <el-input type="password" v-model="pwdChangeForm.passNewReset" size='small' @keyup.native="riskpass"></el-input>
        </el-form-item>
        <el-form-item :label="$t('pass.pass3')"  prop="passNewRReset" style="margin-bottom:0;height:55px;">
          <el-input type="password" v-model="pwdChangeForm.passNewRReset" size='small'></el-input>
        </el-form-item>
        <div class="strength_meter" v-show="valiPass.show">
          <ul>
            <li class="veryweak translate" v-show="valiPass.strong || valiPass.good || valiPass.weak || valiPass.risk">{{$t('pass.vali1')}}</li>
            <li class="weak translate" v-show="valiPass.strong || valiPass.good || valiPass.weak">{{$t('pass.vali2')}}</li>
            <li class="medium translate" v-show="valiPass.strong || valiPass.good">{{$t('pass.vali3')}}</li>
            <li class="strong translate" v-show="valiPass.strong">{{$t('pass.vali4')}}</li>
          </ul>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editPass">{{$t('iconCollection.edit')}}</el-button>
        <el-button @click="closeDlg">{{$t('iconCollection.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!--强制修改密码弹出框 end-->
</template>
<script>
  import util from 'index@/utils/util';
  import http from 'index@/api/index';
  import { JSEncrypt } from 'jsencrypt';
  import validate from '@/utils/form-validate'

  export default {
    props: ['pwdChangeDlgVis','title','url','user'],
    data () {
      return {
        valiPass: {
          show:false, //密码强度校验
          risk: false,
          weak: false,
          good: false,
          strong: false
        },
        en: this.$i18n.locale == 'en_US' ,//控制判断中英文
        pwdChangeForm:{
          passOld:'',
          passNewReset:'',
          passNewRReset:'',
        },
        updataPwdRules:{
          passOld: [
            { required: true,message: this.$t('pass.v1'),trigger: 'blur' },
          ],
          passNewReset: [
            { required: true,message: this.$t('pass.v2'),trigger: 'blur' },
            { min:8,max:16,message: this.$t('pass.length',{x:8,y:16}),trigger: 'blur' },
            { validator: validate.utils_string, trigger:'blur'},
            {validator:this.passNoInit,trigger:'blur'}
          ],
          passNewRReset: [
            { required: true,message: this.$t('pass.v3'),trigger: 'blur'   },
            { min:8,max:16,message: this.$t('pass.length',{x:8,y:16}),trigger: 'blur'   },
            {validator:this.validatePass,trigger:'blur'}
          ]
        }
      }
    },
    created () {
      //设置公钥
      this.encrypt = new JSEncrypt();
      let publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKZKgabcPik14D8DSWVMMNjo+08NQNxRTjH6bBlD8CaAviLdN+EVcBR4wCpSQrzd1gngafZGVzBFWKitxh5fZcAHq3BJjhtVvpsuRgxLNmgWk8Mt1nzxSkGqe5hiWZ5i2p9dN/iq6kZi0cPlkIv55D4AjD6g82durpL4qKKCVm6wIDAQAB";
      this.encrypt.setPublicKey(publicKey);
    },
    methods: {
      //重置表单
      resetForm () {
        this.$refs.editForm && this.$refs.editForm.resetFields();
        this.valiPass.show = false;
      },
      //关闭对话框
      closeDlg () {
        this.$emit('closeEditDlg');
      },
      /**
       *  校验密码强度
       * @author wangjing
       * @date 2018-07-10
       */
      riskpass () {
        let value = this.pwdChangeForm.passNewReset;
        if (value.length < 1) return;
        let valiTypeReset = {
          num: /\d/,                    //数字
          valsCh: /[a-z]+/,						  //小写字母
          valbCh: /[A-Z]+/,             //大写字母
          valSpe: /[^a-zA-Z0-9]/        //特殊字符
        };
        this.valiPass.show = true;
        let num = this.getNum( value,valiTypeReset );  // 获取当前密码强度值 密码强度 =1风险密码 =2弱密码 =3中密码 =4强密码

        if ( value.length < 8 ) {
          num = 1;    //长度小于8  风险密码
        }

        var riskPass = this.getRiskPassVali( value , (window.localStorage.user || this.user),valiTypeReset);
        if ( !riskPass ){
          num = 1;   // 只有一类字符，或者密码与用户名一样，或者密码是用户名的倒写  风险密码
        }

        // 判断两两组合
        if (num == 2) {
          // 包含两类字符，且组合为（数字+小写字母）或（数字+大写字母），为弱密码
          if (valiTypeReset["num"].test(value) && !valiTypeReset["valSpe"].test(value)) {
            num = 2;
          } else {
            num = 3;
          }
        } else if (num == 3) {
          num = 4;
        }

        this.valiPass.risk = false;
        this.valiPass.weak = false;
        this.valiPass.good = false;
        this.valiPass.strong = false;

        // 强度样式
        if (num <= 1) {
          this.valiPass.risk = true;
        } else if (num == 2) {
          this.valiPass.weak = true;
        } else if (num == 3) {
          this.valiPass.good = true;
        } else {
          this.valiPass.strong = true;
        }
      },
      //获取风险验证的方法
      getRiskPassVali( value , UserName/*用户名的值*/ ,valiTypeReset/*登录用户判断处理*/){
        /*风险密码的判断*/
        let flag = false;

        //只包含4类字符中的任意一类
        var num = 0;

        for ( var p in valiTypeReset ){
          if ( valiTypeReset[p].test(value) )
            num++;
        }

        if ( num <= 1 )
          flag = false;
        else
          flag = true;

        //密码和用户名一样
        if ( value == UserName)
          flag = false;

        //密码是用户名的倒写
        if ( value ==  (UserName && UserName.split("").reverse().join("")))
          flag = false;

        return flag;
      },

      //密码强度
      getNum (value,valiTypeReset) {
        let num = 0;

        for ( let p in valiTypeReset ){
          if ( valiTypeReset[p].test(value) )
            num++;
        }
        return num;
      },
      /**
       *  校验不能修改为初始化密码
       * @author wangjing
       * @date 2018-07-10
       */
      passNoInit (rule, value, callback) {
        let result = '';
        let valiTypeReset = {
          num: /\d/,                                //数字
          valsCh: /[a-z]+/,						  //小写字母
          valbCh: /[A-Z]+/,                         //大写字母
          valSpe: /[^a-zA-Z0-9]/                    //特殊字符
        };
        //风险密码校验不应该通过
        if (value == this.pwdChangeForm.passOld) {
          result = this.$t('pass.v4');
        }

        let riskPass = this.getRiskPassVali( value , (this.user || window.localStorage.user),valiTypeReset);

        if (!riskPass) {
          result = this.$t('pass.v5');
        }

        result ? callback(new Error(result)) : callback();
      },
      /**
       *  校验再次输入密码，必须与新密码一致 input校验
       * @author wangjing
       * @date 2018-07-10
       */
      validatePass (rule, value, callback){
        if (value === '') {
          callback(new Error(this.$t('pass.v3')));
        } else if (value !== this.pwdChangeForm.passNewReset) {
          callback(new Error(this.$t('pass.v6')));
        } else {
          callback();
        }
      },
      //保存密码
      editPass () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            http.getRequest(this.url, 'post',{
              username: this.user || window.localStorage.user,
              password: this.encrypt.encrypt(this.pwdChangeForm.passOld),
              newPassword: this.encrypt.encrypt(this.pwdChangeForm.passNewRReset)
            }).then(res => {
              if (this.title)
                this.$emit('signIn','signin',this.pwdChangeForm.passNewRReset);
              if (res.status) {
                this.$message({
                  showClose: true,
                  message: this.$t('pass.success'),
                  type: 'success'
                });

                this.closeDlg();

                if (this.title)
                  this.$emit('resetForm');

              } else {
                let error = '';
                switch(res.data.toString()) {
                  case '1':
                    error = this.$t('pass.v7');
                    break;
                  case '2':
                    error = this.$t('pass.v4');
                    break;
                  case '3':
                    error = this.$t('pass.v8');
                    break;
                  case '4':
                    error = this.$t('pass.v9');
                    break;
                  case '5':
                    error = this.$t('pass.v10');;
                    break;
                  default:
                    error = res.data;
                    break;
                }
                this.$message({
                  showClose: true,
                  message: error,
                  type: 'error'
                });
              }
            });
          }
        });

      }
    }
  }
</script>
<style scoped>

</style>
