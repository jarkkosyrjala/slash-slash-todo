const http = require('http')
const fs = require('fs')
const path = require('path')
const open = require('open')

const distFolder = path.resolve(__dirname, 'dist')

http
  .createServer(function (request, response) {
    const filePath =
      request.url === '/'
        ? path.resolve(distFolder, 'index.html')
        : path.resolve(distFolder, request.url.substr(1))
    const extname = String(path.extname(filePath)).toLowerCase()
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.ico': 'image/x-icon',
    }
    const contentType = mimeTypes[extname] || 'application/octet-stream'
    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == 'ENOENT') {
          response.writeHead(500)
          response.end('Oops, we are lost')
        } else {
          response.writeHead(500)
          response.end('Oops, something weird going on: ' + error.code)
        }
      } else {
        response.writeHead(200, { 'Content-Type': contentType })
        response.end(content, 'utf-8')
      }
    })
  })
  .listen(8888)

open('http://127.0.0.1:8888')
console.log('Server running at http://127.0.0.1:8888/')
