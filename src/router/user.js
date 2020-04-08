const { login } = require('../controller/user')

const handleUserRouter = (req) => {
  if(req.method === 'GET' && req.path === '/api/user/login'){
    const { username, password } = req.query
    return login(username, password, req)
  }
}


module.exports = handleUserRouter
