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

// 直接这么设置session数据，session会存在nodejs进程中，会存在以下问题：
// 1.进程内存有限，如果访问量过大，session过大，导致内存暴增。
// 2.线上环境，是多进程的，进程之间无法共享内存
// const SESSION_DATA = {}

const server = http.createServer(async (req, res) => {

  accessLog(`${req.method}--${req.url}--${req.headers['user-agent']}--${Date.now()}`)

  // 设置返回格式为JSON
  // 在原生的node开发中，res.end返回的永远都是字符串，但是可以通过res.setHeader('Content-type', 'application/json')
  // 设置返回的数据格式，客户端拿到返回结果会根据返回的数据格式解析数据
  res.setHeader('Content-type', 'application/json')

  const url = req.url
  req.path = url.split('?')[0]
  req.query = querystring.parse(url.split('?')[1])

  req.cookie = {}
  const cookie = req.headers.cookie || ''
  cookie && cookie.split(';').forEach(item => {
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  })

  // 解析session，使用nodejs本地变量SESSION_DATA
  // let needSetCookie = false
  // let token = req.cookie.mt_token
  //
  // if(token){
  //   if(!SESSION_DATA[token]){
  //     SESSION_DATA[token] = {}
  //   }
  // } else {
  //   needSetCookie = true
  //   token = `${Date.now()}_${Math.random()}`
  //   SESSION_DATA[token] = {}
  // }
  //
  // req.session = SESSION_DATA[token]

  // 解析session，使用redis
  let needSetCookie = false
  let token = req.cookie.mt_token
  if(!token){
    needSetCookie = true
    token = `${Date.now()}_${Math.random()}`
    set(token, {})
  }

  req.sessionId = token

  const sessionData = await get(req.sessionId)
  if(sessionData === null){
    set(req.sessionId, {})
    req.session = {}
  } else {
    req.session = sessionData
  }

  // 登录验证
  const loginStatus = loginCheck(req)
  if(loginStatus.code === -1){
    res.end(JSON.stringify(loginStatus))
    return
  }

  req.body = await bodyParser(req)

  if(needSetCookie){
    // httpOnly：只允许后端修改，不允许前端修改
    res.setHeader('Set-Cookie', `mt_token=${token};path=/;httpOnly;expires=${getCookieExpires()}`)
  }

  const productData = await handleProductRouter(req, res)
  if(productData){
    res.end(JSON.stringify(productData))
    return
  }

  const userData = await handleUserRouter(req, res)
  if(userData){
    res.end(JSON.stringify(userData))
    return
  }

  res.writeHead(404, { "Content-type": "text/plain" })
  res.write("404 Not Found\n")
  res.end()

})


server.listen(8000)
