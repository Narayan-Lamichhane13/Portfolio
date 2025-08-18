const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Build the app (output: 'export' will place static export in 'out')
console.log('Building Next.js app...');
execSync('npm run build', { stdio: 'inherit' });

const outDir = path.join(__dirname, '..', 'out');
const docsDir = path.join(__dirname, '..', 'docs');

if (!fs.existsSync(outDir)) {
  console.error('Expected \'out/\' after build with output: export.');
  process.exit(1);
}

// Clean docs directory
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.mkdirSync(docsDir, { recursive: true });

// Copy out -> docs
function copyDir(src, dest) {
  fs.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

copyDir(outDir, docsDir);

// Create .nojekyll
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');

console.log('Export complete: copied out/ to docs/ and created .nojekyll');
