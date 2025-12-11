/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else if (entry.isSymbolicLink()) {
      const link = fs.readlinkSync(srcPath)
      fs.symlinkSync(link, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function ensureEmptyDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' })
  if (res.status !== 0) process.exit(res.status ?? 1)
}

// 1) Build (Next.js static export is handled via next.config.js output: 'export')
run('npx', ['next', 'build'])

// 2) Copy out/ -> docs/ for GitHub Pages (docs/ folder publishing)
const outDir = path.join(process.cwd(), 'out')
const docsDir = path.join(process.cwd(), 'docs')

if (!fs.existsSync(outDir)) {
  console.error('Expected build output folder "out" not found. Did the build fail?')
  process.exit(1)
}

ensureEmptyDir(docsDir)
copyDir(outDir, docsDir)

// 3) Ensure GitHub Pages serves _next assets
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '')

console.log('Export complete: out/ → docs/')


