/*
 * @Author: xiangxiao3
 * @Desc: 颜色工具
 * @Date: 2018-01-12 16:42:41
 * @Last Modified by: xiangxiao3
 * @Last Modified time: 2018-02-03 14:24:20
 */
<template>
  <!-- 颜色工具栏 -->
  <div class="system-tools" :class="{'is-open': isToolsOpen}">
    <div class="system-tools-inner">
      <div class="system-tools-toggle" @click="isToolsOpen = !isToolsOpen">
        <i class="h-icon-gear"></i>
      </div>
      <div class="system-tools-content">
        <el-tabs v-model="activeName">
          <el-tab-pane label="换肤" name="skin">
            <div class="system-tools-radios">
              <el-radio-group v-model="skinRadio" @change="handleChangeSkin">
                <el-radio class="radio" label="redblack">红色</el-radio>
                <el-radio class="radio" label="blue">蓝色</el-radio>
              </el-radio-group>
            </div>
            <el-button type="primary" class="skin-dowmload-btn" :disabled="downloadDisabled" @click="downloadTheme">下载所有主题</el-button>
          </el-tab-pane>
          <el-tab-pane label="多语言" name="i18n">
            <div class="system-tools-radios">
              <el-radio-group v-model="i18nRadio" @change="handleChangeI18n">
                <el-radio class="radio" label="zh_CN">中文</el-radio>
                <el-radio class="radio" label="en_US">English</el-radio>
              </el-radio-group>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <a id="themeDownload" href=""></a>
    </div>
  </div>
</template>

<script>
import http from '@/api/index'
import huiLocale from 'hui/lib/locale'
import util from '@/utils/util'
import { mapMutations } from 'vuex'

export default {
  name: 'ColorTool',
  data () {
    return {
      downloadDisabled: false,    // 下载颜色
      activeName: 'skin',
      isToolsOpen: false,         // 颜色工具状态配置
      skinRadio: this.$utils.getStorage('skin').color || 'blue',
      i18nRadio: this.$utils.getStorage('i18n').lang || 'zh_CN'
    }
  },
  created () {
    window.addEventListener('click', this.handleWindowClick, false)
  },
  methods: {
    ...mapMutations(['SET_SKIN_COLOR']),
    // 点击窗口隐藏工具栏
    handleWindowClick (event) {
      if (this.$el && !util.isDomContain(this.$el, event.target)) {
        this.isToolsOpen = false
      }
    },
    /* 切换皮肤 */
    handleChangeSkin (skinName) {
      // 切换皮肤时显示遮罩
      let loadingInstance = this.$loading({
        fullscreen: true,
        text: 'loading...'
      })
      setTimeout(() => {
        loadingInstance.close()
      }, 600)

      http.getRequest(`/static/skin/${skinName}/skin.json`, 'get')
        .then(res => {
          this.SET_SKIN_COLOR(res.skins.find(item => item.name === skinName).color)
          this.$utils.renderSkin(skinName, res.packages)
          this.$utils.setStorage('skin', {color: skinName})
        });
    },
    /* 切换多语言 */
    handleChangeI18n (locale) {
      let lang = require(`@/i18n/${locale}`)
      this.$i18n.setLocaleMessage(locale, JSON.parse(JSON.stringify(lang)))
      huiLocale.i18n((key, value) => this.$i18n.t(key, value))          // hui的多语言
      this.$i18n.locale = locale
      this.$utils.setStorage('i18n', {lang: locale})
      window.location.reload();
    },
    /* 下载主题 */
    downloadTheme () {
      this.downloadDisabled = true
      const timestamp = new Date().getTime() // 时间戳
      let downloadTag = document.getElementById('themeDownload')
      http.get('theme/download', {
        params: {
          timestamp: timestamp
        }
      }).then(res => {
        downloadTag.setAttribute('href', `/static/skin_download/target/theme.${timestamp}.zip`)
        downloadTag.click()
        setTimeout(() => {
          this.downloadDisabled = false
        }, 2000)
      })
    }
  },
  beforeDestroy () {
    window.removeEventListener('click', this.handleWindowClick, false)
  }
}
</script>
<style lang="less" scoped>
.system-tools {
  position: fixed;
  top: 20px;
  right: -240px;
  z-index: 1300;
  width: 240px;
  color: #696969;
  transition: all .3s;
  &.is-open {
    right: 0;
    .system-tools-toggle {
      opacity: 1;
    }
  }
  .system-tools-inner {
    height: 100%;
    box-shadow: 1px 0 8px 0 #bbb;
  }
  .system-tools-toggle {
    position: absolute;
    top: 0;
    left: -28px;
    padding: 10px 6px;
    font-size: 18px;
    cursor: pointer;
    background-color: #fff;
    border-color: #bbb;
    border-style: solid;
    border-width: 1px 0 1px 1px;
    border-radius: 3px 0 0 3px;
    box-shadow: -2px 0 4px 0px #ccc;
    transition: all .3s;
    opacity: .5;
    &:hover {
      opacity: 1;
    }
    i {
      font-size: 16px;
    }
  }
  .system-tools-content {
    height: 100%;
    min-height: 100px;
    padding: 12px 20px 20px;
    background-color: #fff;
    border: 1px solid #bbb;
    border-radius: 0 3px 3px;
  }
  // 单选框
  .system-tools-radios {
    margin-top: 8px;
    padding-left: 8px;
    .el-radio {
      display: block;
      margin-left: 0;
      margin-bottom: 8px;
    }
  }
  // 下载按钮
  .skin-dowmload-btn {
    width: 100%;
    margin-top: 16px;
  }
}
</style>

