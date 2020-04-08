const resultVoUtil = require('../utils/resultVoUtil')
const ProductVo = require('../vo/product')
const {
  getProductListService,
  createProductService,
} = require('../service/product')

const getProductList = async (productName, keyword) => {
  const products = await getProductListService(productName, keyword)
  const voList = products.map(pro => new ProductVo(pro))
  return resultVoUtil.success(voList)
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
