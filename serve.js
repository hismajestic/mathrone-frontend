// Local dev server — mirrors Cloudflare Pages _redirects (/* -> index.html)
// Usage: node serve.js
const http = require('http')
const fs   = require('fs')
const path = require('path')
const PORT = 8080
const ROOT = __dirname

const mime = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.xml':  'application/xml',
  '.txt':  'text/plain',
}

http.createServer((req, res) => {
  // Strip query string
  let urlPath = req.url.split('?')[0]

  // Try to serve the exact file first (assets, robots.txt, sitemap.xml, etc.)
  let filePath = path.join(ROOT, urlPath)
  const ext = path.extname(filePath)

  if (ext && fs.existsSync(filePath)) {
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' })
    fs.createReadStream(filePath).pipe(res)
    return
  }

  // SPA fallback — everything else serves index.html (mirrors _redirects: /* /index.html 200)
  res.writeHead(200, { 'Content-Type': 'text/html' })
  fs.createReadStream(path.join(ROOT, 'index.html')).pipe(res)

}).listen(PORT, () => {
  console.log(`\n  Mathrone Academy — local dev server`)
  console.log(`  http://localhost:${PORT}\n`)
  console.log(`  All routes (e.g. /news, /shop/123) served via SPA fallback`)
  console.log(`  Press Ctrl+C to stop\n`)
})