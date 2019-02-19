import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { Utils } from 'dolphin_common'
import axios from 'axios'

Vue.use(VueI18n)
const default_lang = Utils.getStorage('i18n').lang || 'zh_CN';
document.getElementsByTagName('body')[0].className= 'dolphin ' + default_lang;
const path = process.env.NODE_ENV === 'production' ? '/static' : '/static'

// 获取多语言文件
let mes = [];

async function getMessage() {
  const res = await axios.get(`${path}/i18n/${default_lang}/index.json`)
  mes[default_lang] = res.data
  return mes;
}

export const getI18n = async () => {
  const i18nMes = await getMessage();
  const i18n = new VueI18n({
    locale: default_lang, // set locale
    messages: i18nMes
  });
  
  return i18n;
}

