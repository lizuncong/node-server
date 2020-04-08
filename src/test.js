const http = require('http')
const querystring = require('querystring')

const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()
}

// 直接这么设置session数据，session会存在nodejs进程中，会存在以下问题：
// 1.进程内存有限，如果访问量过大，session过大，导致内存暴增。
// 2.线上环境，是多进程的，进程之间无法共享内存
const SESSION_DATA = {}

const server = http.createServer(async (req, res) => {

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

  //解析session，使用nodejs本地变量SESSION_DATA
  let token = req.cookie.mt_token

  if(token){
    if(!SESSION_DATA[token]){
      SESSION_DATA[token] = {}
    }
  } else {
    // httpOnly：只允许后端修改，不允许前端修改
    res.setHeader('Set-Cookie', `mt_token=${token};path=/;httpOnly;expires=${getCookieExpires()}`)
    token = `${Date.now()}_${Math.random()}`
    SESSION_DATA[token] = {}
  }

  req.session = SESSION_DATA[token]


  if(req.method === 'GET' && path === '/login'){
    const { username, password } = req.query
    return login(username, password, req)
  }


  res.writeHead(404, { "Content-type": "text/plain" })
  res.write("404 Not Found\n")
  res.end()

})


server.listen(8000)
