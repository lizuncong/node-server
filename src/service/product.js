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

const getProductDetailById = (id) => {
  const sql = `select * from products where id='${id}'`
  return querySQL(sql)
}

const createProductService = ({ productName, description }) => {
  const createTime = Date.now()
  const sql = `insert into products(name, description, createtime) 
  values('${productName}', '${description}', '${createTime}')`

  return querySQL(sql)
}


const updateProductService = ({ id, productName, description, status }) => {
  if(!id) return 'id不能为空'
  const fields = [productName && `name='${productName}'`, description && `description='${description}'`,
    status !== undefined && `status=${status}`
  ].filter(Boolean).join(',')
  const sql = `update products set ${fields} where id=${id}`
  return querySQL(sql)
}


const deleteProductService = (id) => {
  const sql = `delete from products where id=${id}`
  return querySQL(sql)
}


module.exports = {
  getProductListService,
  getProductDetailById,
  createProductService,
  updateProductService,
  deleteProductService,
}
