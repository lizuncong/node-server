const crypto = require('crypto')

const SECRET_KEY = 'li_zun_cong'

const cryp = (content) => {
  const str = `content=${content}&key=${SECRET_KEY}`
  const md5 = crypto.createHash('md5')
  return md5.update(str).digest('hex')
}


module.exports = {
  cryp
}
