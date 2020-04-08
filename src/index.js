const http = require('http')
const querystring = require('querystring')
const { get, set } = require('./redis')
const { accessLog } = require('./utils/log')
const handleProductRouter = require('./router/product')
const handleUserRouter = require('./router/user')


const bodyParser = (req) => {
  return new Promise((resolve, reject) => {
    if(req.method !== 'POST'){
      return resolve({})
    }
    if(req.headers['content-type'] !== 'application/json'){
      return resolve({})
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })

    req.on('end', () => {
      resolve(JSON.parse(postData))
    })
  })
}

const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()
}

// 统一的登录验证
const loginCheck = (req) => {
  // 白名单，绕过登录验证
  const whiteList = ['/api/user/login']

  if(whiteList.indexOf(req.path) === -1 && !req.session.username){
    return { code: -1, msg: '尚未登录' }
  } else {
    return { code: 0, msg: '已登录或无需登录' }
  }
}


const server = http.createServer(async (req, res) => {

  accessLog(`${req.method}--${req.url}--${req.headers['user-agent']}--${Date.now()}`)

  res.setHeader('Content-type', 'application/json')

  const urlSplitData = req.url.split('?')
  req.path = urlSplitData[0]
  req.query = querystring.parse(urlSplitData[1])

  // 解析cookie
  req.cookie = {}
  const cookie = req.headers.cookie || ''
  cookie && cookie.split(';').forEach(item => {
    const arr = item.split('=')
    const key = arr[0].trim()
    req.cookie[key] = arr[1].trim()
  })


  // 获取session数据
  let sessionId = req.cookie.sessionId
  if(!sessionId){
    sessionId = `${Date.now()}_${Math.random()}`
    res.setHeader('Set-Cookie', `sessionId=${sessionId};path=/;httpOnly;expires=${getCookieExpires()}`)
  }
  req.sessionId = sessionId
  req.session = await get(req.sessionId)
  if(req.session === null){
    set(req.sessionId, {})
    req.session = {}
  }


  // 登录验证
  const loginStatus = loginCheck(req)
  if(loginStatus.code === -1){
    res.end(JSON.stringify(loginStatus))
    return
  }

  req.body = await bodyParser(req)

  const productData = await handleProductRouter(req)
  if(productData){
    res.end(JSON.stringify(productData))
    return
  }

  const userData = await handleUserRouter(req)
  if(userData){
    res.end(JSON.stringify(userData))
    return
  }

  res.writeHead(404, { "Content-type": "text/plain" })
  res.write("404 Not Found\n")
  res.end()

})


server.listen(8000)
