const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'docs');
const nojekyll = path.join(outDir, '.nojekyll');

if (!fs.existsSync(outDir)) {
  console.error('docs/ folder not found. Did export run?');
  process.exit(1);
}

// Prevent GitHub Pages from using Jekyll so files/folders starting with _ are served
fs.writeFileSync(nojekyll, '');

console.log('Post-export: Created .nojekyll');
