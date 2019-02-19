<template>
  <div>
    <el-input type="password" v-model="currentValue" @input="handleInput"></el-input>
    <div class="strength_meter" v-show="valiPass.show">
      <ul>
        <li class="veryweak translate" v-show="valiPass.strong || valiPass.good || valiPass.weak || valiPass.risk">{{$t('pass.vali1')}}</li>
        <li class="weak translate" v-show="valiPass.strong || valiPass.good || valiPass.weak">{{$t('pass.vali2')}}</li>
        <li class="medium translate" v-show="valiPass.strong || valiPass.good">{{$t('pass.vali3')}}</li>
        <li class="strong translate" v-show="valiPass.strong">{{$t('pass.vali4')}}</li>
      </ul>
    </div>
  </div>

</template>
<script>
  import util from 'index@/utils/util';
  import http from 'index@/api/index';
  import { JSEncrypt } from 'jsencrypt';

  export default {
    props: {
      value: {
        type:String
      }
    },
    data () {
      return {
        currentValue: this.value, //将prop属性绑定到data属性上，以便修改prop属性（Vue不允许直接修改prop属性的值）
        valiPass: {
          show:false, //密码强度校验
          risk: false,
          weak: false,
          good: false,
          strong: false
        },
      }
    },
    created () {
      //设置公钥
      this.encrypt = new JSEncrypt();
      let publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKZKgabcPik14D8DSWVMMNjo+08NQNxRTjH6bBlD8CaAviLdN+EVcBR4wCpSQrzd1gngafZGVzBFWKitxh5fZcAHq3BJjhtVvpsuRgxLNmgWk8Mt1nzxSkGqe5hiWZ5i2p9dN/iq6kZi0cPlkIv55D4AjD6g82durpL4qKKCVm6wIDAQAB";
      this.encrypt.setPublicKey(publicKey);
    },
    methods: {
      handleInput(value) {
        this.$emit('input', value); //触发 input 事件，并传入新值*/
        this.riskpass(value);
      },

      /**
       *  校验密码强度
       * @author wangjing
       * @date 2018-07-10
       */
      riskpass (value) {
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
          this.$emit('valiRisk',true);
        } else {
          this.$emit('valiRisk',false);
          if (num == 2) {
            this.valiPass.weak = true;
          }  else if (num == 3) {
            this.valiPass.good = true;
          } else {
            this.valiPass.strong = true;
          }
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

      resetField () {
          this.valiPass.show = false;
          this.currentValue = '';
      }
    }
  }
</script>
<style scoped>
  .strength_meter{
    margin-left:34px;
    margin-top:10px;
    width:100%;
  }
</style>
