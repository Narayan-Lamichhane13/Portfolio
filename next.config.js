/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const repo = 'Portfolio' // GitHub repo name used for Pages base path

const nextConfig = {
  // Static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  images: {
    // Required for static export when using next/image
    unoptimized: true,
  },
  // Prefix paths when building for production (GitHub Pages project site)
  basePath: isProd ? `/${repo}` : undefined,
  assetPrefix: isProd ? `/${repo}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repo}` : '',
  },
}

module.exports = nextConfig
