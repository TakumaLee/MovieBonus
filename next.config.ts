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
  // 實驗性功能：完全禁用圖片優化
  experimental: {
    optimizePackageImports: [],
    turbo: {
      rules: {
        '*.jpg': {
          loaders: ['file-loader'],
          as: '*.jpg',
        },
        '*.png': {
          loaders: ['file-loader'],
          as: '*.png',
        },
      },
    },
  },
  // Webpack 配置：禁用圖片處理
  webpack: (config: any) => {
    // 移除 Next.js 默認的圖片處理規則
    config.module.rules = config.module.rules.filter((rule: any) => {
      if (rule.test && rule.test.toString().includes('jpg|jpeg|png|gif|webp|avif')) {
        return false;
      }
      return true;
    });
    
    return config;
  },
};

export default nextConfig;
