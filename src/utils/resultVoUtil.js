const ResultVo = require('../vo/result');

exports.success = (data, msg) => {
  return new ResultVo({
    code: 0,
    msg: msg || 'success',
    data,
  })
}


exports.error = (msg, data, code) => {
  return new ResultVo({
    code: code || -1,
    msg,
    data
  })
}
