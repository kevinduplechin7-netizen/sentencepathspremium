const http = require('http');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const serveDist = args.includes('--dist');

const root = path.join(__dirname, '..', serveDist ? 'dist' : 'site');
const port = Number(process.env.PORT) || (serveDist ? 4173 : 5173);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

function safeJoin(base, target) {
  const targetPath = path.normalize(target).replace(/^([\\/])+/, '');
  const joined = path.join(base, targetPath);
  if (!joined.startsWith(base)) return null;
  return joined;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-cache', ...headers });
  res.end(body);
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 500, 'Server error');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const ct = mime[ext] || 'application/octet-stream';
    send(res, 200, data, { 'Content-Type': ct });
  });
}

if (!fs.existsSync(root)) {
  console.error(`Missing directory: ${root}`);
  console.error('Run: npm run build (to create dist) or ensure site/ exists.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(url.pathname || '/');

    if (pathname === '/') pathname = '/index.html';

    const filePath = safeJoin(root, pathname);
    if (!filePath) {
      send(res, 403, 'Forbidden');
      return;
    }

    fs.stat(filePath, (err, st) => {
      if (!err && st.isFile()) {
        sendFile(res, filePath);
        return;
      }

      // SPA fallback: serve index.html
      const indexPath = path.join(root, 'index.html');
      if (fs.existsSync(indexPath)) {
        sendFile(res, indexPath);
      } else {
        send(res, 404, 'Not found');
      }
    });
  } catch (_) {
    send(res, 400, 'Bad request');
  }
});

server.listen(port, () => {
  const mode = serveDist ? 'preview' : 'dev';
  console.log(`SentencePathsLite ${mode} server running:`);
  console.log(`  http://localhost:${port}`);
  console.log(`Serving: ${root}`);
});
