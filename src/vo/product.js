const { dateFormat } = require('../utils/tools')
// 商品VO
module.exports = class ProductVo {
  constructor (opts) {
    this.productId = opts.id
    this.productName = opts.name
    this.createTime = dateFormat(new Date(opts.createtime), 'YYYY-MM-DD HH:mm')
    this.desc = opts.description
  }
}
