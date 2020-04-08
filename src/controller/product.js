const resultVoUtil = require('../utils/resultVoUtil')
const {
  getProductListService,
  createProductService,
} = require('../service/product')

const getProductList = async (productName, keyword) => {
  const result = await getProductListService(productName, keyword)
  return resultVoUtil.success(result)
}

const createProduct = async (productData) => {
  const result = await createProductService(productData)
  const id = result.insertId
  return resultVoUtil.success({ id })
}

module.exports = {
  getProductList,
  createProduct,
}
