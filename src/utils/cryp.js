const crypto = require('crypto')
const config = require('../config')
const SECRET_KEY = config.CRYPTO_SECRET_KEY

const cryp = (content) => {
  const str = `content=${content}&key=${SECRET_KEY}`
  const md5 = crypto.createHash('md5')
  return md5.update(str).digest('hex')
}


module.exports = {
  cryp
}
