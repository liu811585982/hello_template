<!-- 输入密码确认框 -->
<template>
  <el-dialog
    :area="550"
    :title="title"
    :visible.sync="passDlg"
    :close-on-click-modal="false"
    @close="closePassDialog">
    <el-form
      ref="pass"
      @submit.native.prevent=""
      :model="passForm"
      label-width="120px"
      content-width="220px"
      :rules="passRules"
      message-position="right">
      <div class="el-alert el-alert--error is-simple" style="margin-bottom:15px;">
        <i class="el-alert__icon el-icon-warning is-big" style="vertical-align: middle"></i>
        <div class="el-alert__content" style="padding-left:10px">
          <div class="el-alert__title">{{$t("config.cloud.deleteCloudMsg",{x:title})}}</div>
        </div>
      </div>
      <el-form-item label="登录密码" prop="passWord">
        <el-input v-model="passForm.passWord" type="password"></el-input>
      </el-form-item>
    </el-form>
    <slot></slot>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="server-btn" @click="submitEnterPass">{{$t("config.common.btnOK")}}</el-button>
      <el-button @click="closePassDialog">{{$t("config.common.btnCancel")}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import util from 'index@/utils/util';
  import http from 'index@/api/index';
  import { JSEncrypt } from 'jsencrypt';

  export default {
   // props: ['passDlg','title','showLoad'],
    props:{
       passDlg: {
         type: Boolean,
         required: true
       },
       title: {
         type: String
       },
       showLoad:{
          type: Boolean
       },
       step: {
          type: Boolean   //一次校验
       }
    },
    data () {
      return {
        loadingNode: false,
        passForm: {
          passWord: ''
        },
        passRules: {
          passWord: [
            { required: true, message: '请输入密码', trigger: 'blur' }
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
      //关闭对话框
      closePassDialog () {
        this.$refs.pass && this.$refs.pass.resetFields();
        this.$emit('closeDlg');
      },

      //输入密码
      submitEnterPass () {
        this.$refs.pass.validate((valid) => {
          if (valid) {
            if (this.step) {
              this.$emit('submit',this.encrypt.encrypt(this.passForm.passWord));
            } else {
              http.getRequest('/config/user/validatePin', 'post', {'password': this.encrypt.encrypt(this.passForm.passWord)})
                .then(res => {
                  if (res.status) {
                    this.closePassDialog();
                    this.$emit('submit');
                  } else {
                    util.alert('用户密码错误，请重新输入。');
                  }
                });
            }

          }
        });
      }

    }
  }
</script>
