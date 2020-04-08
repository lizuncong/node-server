const crypto = require('crypto')
const config = require('../config')
const SECRET_KEY = config.CRYPTO_SECRET_KEY

const cryp = (content) => {
  const str = `content=${content}&key=${SECRET_KEY}`
  const md5 = crypto.createHash('md5')
  return md5.update(str).digest('hex')
}

const dateFormat = (date, format) => {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCMilliseconds()).padStart(2, '0')
  const str = [year, month, day].join('-')
  if(!format) return str

  if(format === 'YYYY-MM-DD HH:mm:ss'){
    return str + ' ' + [hours, minutes, seconds].join(':')
  }
  if(format === 'YYYY-MM-DD HH:mm'){
    return str + ' ' + [hours, minutes].join(':')
  }
}

module.exports = {
  cryp,
  dateFormat
}
