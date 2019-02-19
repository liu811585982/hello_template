<template>
  <div class="editInput">
    <span v-show="!editTag">{{inputTxt || rowValue}}</span>
    <el-input
      :class="{errorInput: errorInput}"
      v-show="editTag"
      @blur="submitVal(rowValue,true)"
      style="width:100px"
      type="text"
      v-model="inputTxt">
    </el-input>
    <i v-show="!editTag" class="h-icon-edit" @click="edit(rowValue)"></i>
    <i v-show="editTag" class="h-icon-right" @click="submitVal(rowValue)"></i>
    <i v-show="editTag" class="h-icon-close" @click="reset(rowValue,'clear')"></i>
  </div>
</template>
<script>
  import util from 'index@/utils/util';
  export default {
    props: ['rowValue','datas','result','resetTag'],
    data () {
      return {
        inputTxt: '',
        editTag: false,
        errorInput: false
      }
    },
    watch: {
      '$route': 'reset',
      'resetTag': 'reset'
    },
    methods: {
      // 修改
      edit (rowValue) {
        this.inputTxt = rowValue;
        this.editTag = true;
      },
      // 提交
      async submitVal (rowValue,noSub) {
        if (this.inputTxt == rowValue){
          //无更改
          this.editTag = false;
        }else{
          await this.$emit("submitVal", this.inputTxt, this.datas,noSub);
          this.showResult(this.result,noSub);
        }
      },
      showResult (v,noSub) {
        if (v.error){
          util.alert(v.error,'error');
          this.errorInput = true;
        } else{
          this.$message.closeAll();
          this.errorInput = false;

          if (noSub) return;
          util.alert('修改成功', 'success');
          
          if (v.input)
            this.inputTxt = v.input;
            
          this.editTag = false;
        }
      },
      //取消修改
      reset (rowValue, clear) {
        this.inputTxt = '';
        this.editTag = false;

        if (clear == 'clear')
          this.$message.closeAll();
      },
    }
  }
</script>
<style scoped>
  .h-icon-edit{
    position:relative;
    top:3px;
    color:#3399ff;
  }
  .h-icon-right{
    color:#5BB75B;
  }
</style>
