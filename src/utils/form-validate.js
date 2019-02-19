let methods = {
  ipv4 (rule, value, callback , tag) {
    if (value == '' || typeof(value)=='undefined') return callback();
    return addMethod(/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value),
      vm.$t('config.validator.validIp'),
      callback,tag)
  },
  subnet (rule, value, callback) {
    return addMethod(/^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0|255))$/i.test(value),
      '请输入合法子网掩码。',
      callback)
  },
  gateway (rule, value, callback) {
    return addMethod(/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value),
      '请输入合法网关。',
      callback)
  },
  port (rule, value, callback, tag) {
    return addMethod(/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(value),
      '请输入有效的端口 [0-65535]。',
      callback, tag)
  },
  hostname (rule, value, callback) {
    return /^[a-z]{1}[a-z0-9\-]{1,13}[a-z0-9]{1}$/.test(value);
  },
  isInteger (rule, value, callback) {
    return addMethod(!/\D/.test(value),
      '请输入整数',
      callback)
  },
  utils_string1 (rule, value, callback) {
    return addMethod(/^[0-9a-zA-Z_-]+$/.test(value), vm.$t('config.validator.utils_string1'), callback);
  },
  string0 (rule, value, callback) {
    if (value == '' || typeof(value)=='undefined') return callback();
    return addMethod(/[^\\\'\"]/im.test(value), vm.$t('config.validator.string0'), callback)
  },
  string1 (rule, value, callback) {
    if (!value) return callback();
    return addMethod(/^[0-9a-zA-Z\u4e00-\u9fa5 \~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\;\|\<\>\,\.\?\/\:]+$/.test(value), '存在不支持的特殊字符（例如反斜杠，单双引号等）。', callback)
  },
  string2 (rule, value, callback) {
    return addMethod(/^[0-9a-zA-Z_ -]+$/.test(value),
      '请输入字母、数字、下划线、中划线',
      callback)
  },
  telephone (rule, value, callback) {
    return addMethod(/^[0-9_ -]+$/.test(value) || (value == '') || (typeof(value)=='undefined'),
      '请输入数字、下划线、中划线',
      callback)
  },
  string3 (rule, value, callback) {
    return addMethod(/^[0-9a-zA-Z_ ]+$/.test(value),
      '请输入字母、数字、下划线',
      callback);
  },
  bucket_name1 (rule, value, callback) {
    return addMethod(/^[0-9a-z]{1}[0-9a-z_-]*$/.test(value),
      '请输入合法的字符(可以使用小写字母、数字及下划线，不能以下划线开头)',
      callback);
  },
  bucket_name2 (rule, value, callback) {
    return addMethod(value.toLowerCase().indexOf("hikcstor") != 0,
      '不能以hikcstor作为Bucket的开头',
      callback);
  },
  email (rule, value, callback) {
    return addMethod(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value)  || (value == '') || (typeof(value)=='undefined'),
      '请输入合法邮箱地址',
      callback)
  },
  user_name (rule, value, callback) {
    return addMethod(/^[0-9a-zA-Z\u4e00-\u9fa5\_-]+$/.test(value),
      '仅支持中英文，数字，下划线',
      callback)
  },

  mobile_phone (rule, value, callback) {
    return addMethod(/^(1\d{10})|(0\d{2,3}-?\d{7,8})$/.test(value) || (value == '') || (typeof(value)=='undefined'),
      '请输入合法的联系电话，例如：027-8888888',
      callback)
  },

  utils_string (rule, value, callback) {
    return addMethod(/^[0-9a-zA-Z\u4e00-\u9fa5\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\;\|\<\>\,\.\?\/\:]+$/.test(value),
      '存在不支持的特殊字符(例如空格，转义符，单双引号等)。',
      callback)
  },

  bucket_name (rule, value, callback) {
    return addMethod( /^[0-9a-z]{1}[0-9a-z_-]*[0-9a-z]{1}$/.test(value),
      '必须以小写字母或数字开头和结尾（使用小写字母、数字、下划线和中划线）。',
      callback)
  },

  path (rule, value, callback) {
    return addMethod(/^(\/([a-z0-9+\$_-]\.?)+)*\/?$/.test(value),
      '请输入合法的路径名称',
      callback)
  },

  //字符串长度及数值大小判断
  range (value, begin, end) {
    if (typeof(value) == 'number') {
      //数值类型
      if (value > end || value < begin) {
        return false
      }
    } else if (typeof(value) == 'string') {
      //字符类型
      if (value.length > end || value.length < begin) {
        return false
      }
    }
    return true
  }
}

export default methods;

function addMethod (result, message, callback, tag) {

  if ((typeof callback === "function") && (tag !== true))
    result ? callback() : callback(new Error(message));
  return result;
}
