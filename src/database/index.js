const mysql = require('mysql')
const config = require('../config/index.js')

const con = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
})


con.connect()

function querySQL(sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if(err){
        return reject(err)
      }
      resolve(result)
    })
  })
}

module.exports = {
  querySQL,
  escape: mysql.escape
}
