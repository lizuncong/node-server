const mysql = require('mysql')


const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123456',
  database: 'mt_admin'
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
