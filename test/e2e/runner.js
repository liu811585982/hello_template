process.env.NODE_ENV = 'testing'

const createTestCafe = require('testcafe')
const fs = require('fs')
const path = require('path')
// 获取参数
const browserParams = process.argv[2]

const filePath = path.resolve(__dirname, './specs')
const reportPath = path.resolve(__dirname, './reports')
const reportFilePath = path.resolve(__dirname, './reports/reports.json')
const browser = browserParams === 'all' ? ['chrome', 'ie'] : browserParams

// 如果不存在文件夹
if (!fs.existsSync(reportPath)) {
  fs.mkdirSync(reportPath)
}

// 递归获取文件夹下的所有xx.spec.js的文件
const walkJs = function (dir) {
  let results = []
  let list = fs.readdirSync(dir)
  list.forEach((file) => {
    file = `${dir}/${file}`
    let stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      results = results.concat(walkJs(file))
    } else {
      if (/spec.js$/.test(file)) { results.push(file) }
    }
  })
  return results
}

const reportStream = fs.createWriteStream(reportFilePath)

let testcafe = null

createTestCafe('localhost', 1337, 1338)
  .then(tc => {
    testcafe = tc
    const runner = testcafe.createRunner()

    return runner
      .src(walkJs(filePath))
      .browsers(browser)
      .reporter('json', reportStream)
      .run({
        selectorTimeout: 20000,
        assertionTimeout: 20000,
        pageLoadTimeout: 20000
      })
  })
  .then(failed => {
    console.log(`测试失败: ${failed}`)
    testcafe.close()
  })
  .catch(err => {
    console.log(err)
    testcafe.close()
  })
