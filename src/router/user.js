const { login } = require('../controller/user')

const handleUserRouter = (req) => {
  const path = req.path
  if(req.method === 'GET' && path === '/api/user/login'){
    const { username, password } = req.query
    return login(username, password, req)
  }
}


module.exports = handleUserRouter
