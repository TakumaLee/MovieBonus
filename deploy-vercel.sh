#!/bin/bash
# MovieBonus Vercel 部署腳本

set -e

echo "🚀 開始 Vercel 部署"

# 更新 API URL 為生產環境
echo "📝 更新環境變數..."
cat > .env.local << EOF
# MovieBonus Frontend Environment Variables
# Vercel 部署配置

# API Configuration - 連接到 Cloud Run 服務
NEXT_PUBLIC_API_URL=https://moviebonus-python-scrapers-777964931661.asia-east1.run.app
NEXT_PUBLIC_API_TIMEOUT=30000

# Application Settings
NEXT_PUBLIC_APP_NAME=特典速報
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENV=production

# Feature Flags
NEXT_PUBLIC_ENABLE_SEARCH=true
NEXT_PUBLIC_ENABLE_CACHE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
EOF

# 安裝依賴
echo "📦 安裝依賴..."
npm install

# 建置專案
echo "🔨 建置 Next.js 應用程式..."
npm run build

echo "✅ 建置完成"

# 檢查是否已安裝 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安裝 Vercel CLI..."
    npm install -g vercel
fi

# 部署到 Vercel
echo "🚀 部署到 Vercel..."
vercel --prod

echo "🎉 部署完成！"
echo "📱 檢查您的 Vercel 控制台以獲取網站 URL" 