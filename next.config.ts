import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 完全禁用 Next.js 圖片優化和處理
  images: {
    unoptimized: true,
    domains: [],
    deviceSizes: [],
    imageSizes: [],
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
  // 強制客戶端渲染，避免 SSG 影響圖片處理
  output: process.env.NODE_ENV === 'production' ? undefined : undefined,
  
  // Webpack 配置：完全禁用圖片處理
  webpack: (config: any, { isServer }: any) => {
    // 移除 Next.js 默認的圖片處理規則
    config.module.rules = config.module.rules.filter((rule: any) => {
      if (rule.test && rule.test.toString().includes('jpg|jpeg|png|gif|webp|avif')) {
        return false;
      }
      return true;
    });
    
    // 禁用服務器端的圖片優化
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'sharp': 'commonjs sharp',
        'image-size': 'commonjs image-size'
      });
    }
    
    return config;
  },
};

export default nextConfig;
