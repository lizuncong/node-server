
// http请求返回的最外层对象
module.exports = class ResultVo {
  constructor (opts) {
    this.code = opts.code
    this.msg = opts.msg
    this.data = opts.data
  }
}
