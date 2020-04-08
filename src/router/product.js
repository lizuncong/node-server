const {
  getProductList,
  createProduct,
} = require('../controller/product')

const handleProductRouter = (req) => {
  if(req.method === 'GET' && req.path === '/api/product/list'){
    const { productName, keyword } = req.query
    return getProductList(productName, keyword)
  }

  if(req.method === 'POST' && req.path === '/api/product/new'){
    return createProduct(req.body)
  }
}


module.exports = handleProductRouter
