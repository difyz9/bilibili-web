/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出配置
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8096',
  },

  // 图片优化配置（静态导出时需要禁用）
  images: {
    unoptimized: true,
  },
  
  // 注意：静态导出时不支持 rewrites、redirects、headers 等服务端功能
  // API 请求应该使用绝对路径或在运行时配置
}

module.exports = nextConfig