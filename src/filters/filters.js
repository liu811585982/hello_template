/**
 * 过滤器
 */
/* eslint-disable */
import util from '@/utils/util'

// 是否内部云
export const isInnnerCloud = (value) => {
  switch (parseInt(value)) {
    case 0: return '否'
    case 1: return '是'
    default: return '--'
  }
}

// 云类型
export const cloudType = (value) =>{
  switch (parseInt(value)) {
    case 1: return '标准云'
    case 2: return '微视云'
    default: return '--'
  }
}

// 集群类型
export const clusterType = (value) => {
  switch (parseInt(value)) {
    case 1: return '单机'
    case 2: return 'HA'
    case 3: return '集群'
    default: return '--'
  }
}

// 存储卷设备类型
export const deviceType = (value) => {
  switch (parseInt(value)) {
    case 6: return 'SSD设备'
    default: return '--'
  }
}

export const formatFilename = (value) => {
  if (!value) {
    return ''
  }
  return util.formatFileName(value)
}

// 小数处理 length 小数位数
export const jsToFixed = (value, length = 2) => {
  if (util.checkNull(value)) {
    return '0.00'
  }
  return Number(value).toFixed(length)
}

// 网路i/o处理
export const tplNet = (value) => {
  if (util.checkNull(value)) {
    return '0.00/0.00'
  } else {
    return value.split(':').map(item => jsToFixed(item)).join('/')
  }
}

// 空值处理
export const emptyFix = (value, symbol = '-') => {
  if (value === '0' || !value) {
    return symbol
  }
  return value
}