const {
  getProductList,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controller/product')

const handleProductRouter = (req, res) => {
  const method = req.method

  const path = req.path
  if(method === 'GET' && path === '/api/product/list'){
    const { productName, keyword } = req.query
    return getProductList(productName, keyword)
  }

  if(method === 'GET' && path === '/api/product/detail'){
    const { id } = req.query
    return getProductDetail(id)
  }

  if(method === 'POST' && path === '/api/product/new'){
    return createProduct(req.body)
  }

  if(method === 'POST' && path === '/api/product/update'){
    const { id } = req.query
    const productData = req.body
    return updateProduct(id, productData)
  }

  if(method === 'POST' && path === '/api/product/delete'){
    const { id } = req.query
    return deleteProduct(id)
  }
}


module.exports = handleProductRouter
