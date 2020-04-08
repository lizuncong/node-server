const fs = require('fs')
const path = require('path')
const { dateFormat } = require('./tools')

const log = (content) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const dir = path.join(__dirname, '../', '../', 'log', `/${year}-${month}`)
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true })
  }

  const fileName = dir + `/${dateFormat(currentDate)}.log`
  const writeStream = fs.createWriteStream(fileName, {
    flags: 'a'
  })
  writeStream.write(content + '\n', 'UTF8')
  writeStream.end()
}

module.exports = {
  log
}
