const { querySQL } = require('../database/index')

const getProductListService = (productName, keyword) => {
  let sql = `select * from products where 1=1 `
  if(productName){
    sql += `and name='${productName}' `
  }
  if(keyword){
    sql += `and description like '%${keyword}%' `
  }
  sql += `order by createtime desc;`

  return querySQL(sql)
}

const createProductService = ({ productName, description }) => {
  const createTime = Date.now()
  const sql = `insert into products(name, description, createtime) 
  values('${productName}', '${description}', '${createTime}')`

  return querySQL(sql)
}


module.exports = {
  getProductListService,
  createProductService,
}
