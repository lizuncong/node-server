const resultVoUtil = require('../utils/resultVoUtil')
const {
  getProductListService,
  getProductDetailById,
  createProductService,
  updateProductService,
  deleteProductService
} = require('../service/product')

const getProductList = async (productName, keyword) => {
  const result = await getProductListService(productName, keyword)
  return resultVoUtil.success(result)
}

const getProductDetail = async id => {
  const result = await getProductDetailById(id)
  const detail = result[0] || {}
  return resultVoUtil.success(detail)
}

const createProduct = async (productData) => {
  const result = await createProductService(productData)
  const id = result.insertId
  return resultVoUtil.success({ id })
}

const updateProduct = async (id, productData) => {
  const result = await updateProductService({ id, ...productData })
  return resultVoUtil.success(result)
}

const deleteProduct = async (id) => {
  const result = await deleteProductService(id)
  return resultVoUtil.success(result)
}

module.exports = {
  getProductList,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct
}
