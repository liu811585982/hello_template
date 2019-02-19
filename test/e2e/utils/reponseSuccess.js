/**
 * 判断请求是否成功
 * @param {*} record
 * @param {String} url
 * @param {Function} callback
 * @returns Boolen
 */
const reponseSuccess = (record, url, callback) => {
  if (!record.request.url.includes(url)) {
    return false
  }
  if (record.response.body) {
    record.response.body = JSON.parse(record.response.body.toString())
    if (record.response.body.code !== '0') return false
  }
  if (record.request.body) {
    record.request.body = JSON.parse(record.request.body.toString())
  }
  if (callback) {
    return callback(record)
  }
  return true
}

export default reponseSuccess
