<!-- 告警提示框 -->
<template>
  <div v-show="showBox">
    <div :class="drop && 'dropbox'" v-show="!drop || show">
      <div class="alarmMess">
        {{$t('alarm.detail.alarmInfo')}}
        <span class="num" v-if="drop">({{activeName+1}}/{{data.length}})</span>
        <span class="btn" v-if="drop">
          <i class="h-icon-angle_left" @click="prev" :title="$t('alarm.drop.prev')" :class="( activeName==0 ) && 'disable'"></i>
          <i class="h-icon-angle_right" @click="next" :title="$t('alarm.drop.next')" :class="( activeName==data.length-1 ) && 'disable'"></i>
          <i class="pause" :class="{play:play}" :title="alarmDes"  @click="changeStatus(play)"></i>
          <i class="min" @click="close"></i>
        </span>
      </div>
      <div class="grid-content bg-purple">
        <div class="el-collapse" v-for="(alarm,index) in data" v-if="!drop || activeName == index">
          <div class="el-collapse-item">
            <div class="el-collapse-item__header">
              <i class="el-collapse-item__header__arrow el-icon-arrow-right"></i>
              {{alarm.sourceIp}}
            </div>
            <div class="el-collapse-item__wrap">
              <div class="el-collapse-item__content">
                <div class="content">
                  <div>{{alarm.typeName}}</div>
                  <div>
                    <div style="line-height:18px;" v-html="util.setDes(alarm.desc)"></div>
                  </div>
                </div>
                <span class="time">{{alarm.alarmTime}}</span>
              </div>
            </div>
          </div><!---->
        </div>
      </div>
    </div>
    <div class="dropbox zoomIn" v-show="drop && !show">
      <el-badge :value="data.length" :max="10" class="item">
        <div class="alarmMess smallTips clearfix" style="height:30px;line-height:30px;">
            <i class="pause" :class="{play:play}" :title="alarmDes"  @click="changeStatus(play)"></i>
            <i class="max" @click="open" :title="$t('alarm.drop.restore')"></i>
        </div>
      </el-badge>

    </div>
  </div>
</template>
<script>
  import util from 'index@/utils/util';
  import http from 'index@/api/index'
  export default {
    props: ['drop'],
    data () {
      return {
        activeName:0,
        data:[],             //告警列表数据
        showBox: false,
        play: false,
        show: this.getStatus(),
        alarmDes: this.$t('alarm.drop.pause'),
        util:util,
        clearAlarmDrop: null
      }
    },
    watch: {

    },
    created () {
      this.getAlarmDrop(0);
    },
    mounted () {
      //绑定上一条下一条键盘事件
      this.bodyListener = (e) => {
        if (!this.show) return;
        if (e.keyCode == 39 ){
          this.next();
        } else if ( e.keyCode == 37 ){
          this.prev();
        }
      };
      document.body.addEventListener('keyup', this.bodyListener, false)
    },
    beforeDestroy() {
      document.body.removeEventListener('keyup', this.bodyListener)
      clearTimeout(this.clearAlarmDrop);
    },
    methods: {
      getStatus () {
        /*let tag = util.get('alarmTag');

        if (!tag){
          return true;
        } else if (tag == 'true') {
          return true;
        } else {
          return false;
        }*/
        return true;
      },
      prev () {
        //第一条时上一条禁用
        if (this.activeName != 0) {
          this.activeName = this.activeName - 1;
        }
      },
      next () {
        //最后一条时下一条禁用
        if (this.activeName != this.data.length - 1) {
          this.activeName = this.activeName + 1;
        }
      },
      close () {
        //最小化告警框
        //util.set('alarmTag', false);
        this.show = false;
      },
      open () {
        //放大告警框
        //util.set('alarmTag', true);
        this.show = true;
      },
      changeStatus (tag) {
        let _this = this;
        //切换告警上报状态
        this.play = !tag;

        if (!tag){
          clearTimeout(this.clearAlarmDrop);
          this.alarmDes = this.$t('alarm.drop.play');
         // this.show = false;
        }else{
          this.clearAlarmDrop = setTimeout(function() {
            let newID = _this.data[0].eventId;
            _this.getAlarmDrop(newID);
          }, 10000);
          this.alarmDes = this.$t('alarm.drop.pause');
        }
      },
      //获取告警弹框数据
      getAlarmDrop (id) {
        let _this = this;
        let ids = id || 0;
        http.getRequest('/alarm/alert?id='+ids,'get')
          .then(res => {
            this.data = res.data.list || [];

            if (res.data.isAlert) {
              this.show = true;
            }
            //增加逻辑判断 没有数据的时候隐藏弹出框
            let newID = 0;
            if (this.data.length) {
                this.showBox = true;
                newID = this.data[0].eventId;
            } else {
                this.show = false;
                this.showBox = false;
            }

            this.clearAlarmDrop = setTimeout(function() {
              _this.getAlarmDrop(newID);
            }, 10000);

            let className = document.getElementsByTagName('body')[0].className;
            if (className.indexOf('visual') != '-1') {
              clearTimeout(this.clearAlarmDrop);
            }
        });
      },

      //清空告警弹框数据发送
      clearAlarmTips () {
        clearTimeout(this.clearAlarmDrop);
      }
    }
  }
</script>
<style lang="less" scoped>
  .dropbox{
    box-shadow: 0 0 15px #888888;
    &.zoomIn{
      right:20px;
      width:60px;
      height:20px;
      overflow:visible;
      > div{
        width:100%;
      }
    }
  }
  .alarmMess{
    padding-left:10px;
    line-height:40px;
    background:#e74955;
    color:#fff;
    span.btn{
      width:130px;
      float:right;
    }
  i{
    display:block;
    float:left;
    padding:10px 8px;
    cursor:pointer;
    box-sizing: content-box;
  &.disable{
     cursor:default;
     color:#be2a36;
   }

  &.pause{
     display:inline-block;
     width:16px;
     height:16px;
     background:url(../assets/images/pause.png) no-repeat center center;
   }
  &.play{
     background:url(../assets/images/play.png) no-repeat center center;
   }
  &.min{
     display:inline-block;
     width:16px;
     height:16px;
     background:url(../assets/images/min.png) no-repeat center center;
   }
  &.max{
     display:inline-block;
     width:16px;
     height:16px;
     background:url(../assets/images/max.png) no-repeat center center;
   }
  }
  span.num{
    font-family:'simSun';
    font-weight:100;
  }
  }
  .time{
    position:relative;
    top:-8px;
    float:right;
    color:#999;
  }
  .content{
    min-height:100px;
  }
  .smallTips i{
    padding:3px 3px;
  }
</style>
