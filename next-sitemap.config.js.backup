/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://paruparu.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/admin/*',
    '/api/*',
    '/_next/*',
    '/404',
    '/500',
    '/admin',
    '/admin/login',
    '/admin/forgot-password',
    '/admin/reset-password',
    '/server-sitemap.xml',
  ],
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/about'),
    await config.transform(config, '/contact'),
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://paruparu.vercel.app/sitemap.xml',
      'https://paruparu.vercel.app/server-sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
        ],
      },
    ],
  },
  // 轉換路徑，用於生成正確的 URL
  transform: async (config, path) => {
    // 對電影詳情頁面進行特殊處理
    if (path.startsWith('/movie/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }
    
    // 首頁優先級最高
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }
    
    // 使用默認配置
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}