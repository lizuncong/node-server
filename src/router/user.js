const { login } = require('../controller/user')

const handleUserRouter = (req, res) => {
  const method = req.method

  const path = req.path
  if(method === 'GET' && path === '/api/user/login'){
    const { username, password } = req.query
    return login(username, password, req)
  }
}


module.exports = handleUserRouter
