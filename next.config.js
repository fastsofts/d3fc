/** @type {import('next').NextConfig} */
const path = require('path');
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
      domains: ['ik.imagekit.io']
  },
  distDir:'dist',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  output: isProd?'export':undefined,
  assetPrefix: isProd ? 'https://eagleseyeerp.com/d3force' : undefined,
  trailingSlash: true,
  images:{
    unoptimized : isProd
  }
}

module.exports = nextConfig
