const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const siteDir = path.join(root, 'site');
const distDir = path.join(root, 'dist');

function rmrf(p) {
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch (_) {
    // ignore
  }
}

function copyDir(src, dst) {
  // Node >=18 supports fs.cpSync
  fs.cpSync(src, dst, { recursive: true });
}

if (!fs.existsSync(siteDir)) {
  console.error('Missing ./site directory.');
  process.exit(1);
}

rmrf(distDir);
fs.mkdirSync(distDir, { recursive: true });
copyDir(siteDir, distDir);

console.log('Built static site: dist/');
