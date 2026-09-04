import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' }
const port = process.env.PORT || 5173

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`)
  const safePath = normalize(url.pathname === '/' ? '/index.html' : url.pathname).replace(/^\.\.(\/|\\|$)/, '')
  const filePath = join(process.cwd(), safePath)

  try {
    const file = await readFile(filePath)
    response.writeHead(200, { 'content-type': types[extname(filePath)] || 'text/plain' })
    response.end(file)
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain' })
    response.end('Not found')
  }
}).listen(port, '0.0.0.0', () => console.log(`AI Tools Directory running at http://localhost:${port}`))
