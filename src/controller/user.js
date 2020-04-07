const resultVoUtil = require('../utils/resultVoUtil')
const { set } = require('../redis')
const {
  getUserByUserNameAndPassword
} = require('../service/user')


const login = async (username, password, req) => {
  const result = await getUserByUserNameAndPassword(username, password)
  if(result.length){
    const data = result[0]
    req.session.username = data.username
    req.session.nickname = data.nickname
    // 同步到redis
    set(req.sessionId, req.session)
    return resultVoUtil.success(data, '登录成功')
  }
  return resultVoUtil.error( '登录失败')
}

module.exports = {
  login
}
