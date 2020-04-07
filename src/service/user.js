const { querySQL, escape } = require('../database/index')


const getUserByUserNameAndPassword = (username, password) => {
  username = escape(username) // 防sql注入
  password = escape(password)
  const sql =  `select username, nickname from users where username=${username} and password=${password}`
  return querySQL(sql)
}

module.exports = {
  getUserByUserNameAndPassword,
}
