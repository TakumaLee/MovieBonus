import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.js',
    dangerouslyAllowSVG: true,
    formats: [],
  },
  webpack: (config: any) => {
    // 完全禁用 Next.js 的圖片處理
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/,
      type: 'asset/resource',
    });
    return config;
  },
  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
