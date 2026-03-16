// const http = require("http")
// http.createServer((req,res)=>{
//   res.writeHead(200,{'Contex-Type':'text/html'})
//   res.end('Hello World')
// }).listen(8080)
const http = require('http')
http.createServer((req,res)=>{
  res.writeHead(200,{'Context-type':'text/html'})
  res.end('Hello World')
}).listen(8080  )

