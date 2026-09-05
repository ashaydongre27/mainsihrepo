const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

const htmlFiles = ['index.html', 'auth.html', 'student.html', 'academy.html', 'industry.html'];
for (const file of htmlFiles) {
  const src = path.resolve(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.resolve(distDir, file));
  }
}

const dirs = ['css', 'js', 'src'];
for (const dir of dirs) {
  const src = path.resolve(__dirname, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.resolve(distDir, dir), { recursive: true });
  }
}

console.log('✓ Build successful: All static HTML portals & assets bundled into dist/');
