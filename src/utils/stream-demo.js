
// demo1:标准输入输出
// process.stdin.pipe(process.stdout)



// demo2: req，res也继承了stream的实现
// const http = require('http')
//
// const server = http.createServer((req, res) => {
//   if(req.method === 'POST'){
//     req.pipe(res)
//   }
// })
//
// server.listen(8002)

// demo3: stream拷贝文件
// const fs = require('fs')
// const path = require('path')
//
// const from = path.resolve(__dirname, './test.txt')
// const to = path.resolve(__dirname, './test-copy.txt')
//
// const readStream = fs.createReadStream(from)
// const writeStream = fs.createWriteStream(to)
//
// readStream.pipe(writeStream)
//
// readStream.on('data', chunk => {
//   console.log('accept data:')
//   console.log(chunk.toString())
// })
//
// readStream.on('end', () => {
//   console.log('copy done')
// })

// demo4:stream读取文件并返回给客户端
// const fs = require('fs')
// const path = require('path')
// const http = require('http')
//
// const from = path.resolve(__dirname, './test.txt')
//
// const server = http.createServer((req, res) => {
//   if(req.method === 'GET'){
//     const readStream = fs.createReadStream(from)
//     readStream.pipe(res)
//   }
// })
//
// server.listen(8002)
