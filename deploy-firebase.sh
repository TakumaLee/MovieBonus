#!/bin/bash
# MovieBonus Firebase 部署腳本

set -e

echo "🚀 開始 Firebase Hosting 部署"

# 更新 API URL 為生產環境
echo "📝 更新環境變數..."
cat > .env.local << EOF
# MovieBonus Frontend Environment Variables
# Firebase Hosting 部署配置

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
echo "🔨 建置靜態網站..."
npm run build

# 檢查建置結果
if [ ! -d "out" ]; then
    echo "❌ 建置失敗，找不到 out 目錄"
    exit 1
fi

echo "✅ 建置完成，檔案位於 out/ 目錄"

# 初始化 Firebase (如果需要)
if [ ! -f ".firebaserc" ]; then
    echo "🔥 首次部署，請先執行：firebase init hosting"
    echo "   選擇現有專案或建立新專案"
    echo "   Public directory: out"
    echo "   Single-page app: Yes"
    echo "   然後再次執行此腳本"
    exit 1
fi

# 部署到 Firebase
echo "🚀 部署到 Firebase Hosting..."
firebase deploy --only hosting

echo "🎉 部署完成！"
echo "📱 檢查您的 Firebase 專案控制台以獲取網站 URL"