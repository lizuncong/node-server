const fs = require('fs')
const path = require('path')

const writeLog = (writeStream, log) => {
  writeStream.write(log + '\n')
}

const createWriteStream = (fileName) => {
  const to = path.join(__dirname, '../', '../', 'log', fileName)
  return writeStream = fs.createWriteStream(to, {
    flags: 'a'
  })
}


// 访问日志
const accessWriteStream = createWriteStream('access.log')


const accessLog = (log) => {
  writeLog(accessWriteStream, log)
}

module.exports = {
  accessLog
}
