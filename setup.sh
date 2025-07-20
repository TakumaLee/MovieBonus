#!/bin/bash

# MovieBonus Frontend 快速設置腳本
echo "🎬 MovieBonus Frontend 快速設置開始..."

# 檢查 Node.js 版本
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安裝。請安裝 Node.js 18.0.0 或更高版本"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本過低。當前版本: $(node -v)，需要: 18.0.0+"
    exit 1
fi

echo "✅ Node.js 版本檢查通過: $(node -v)"

# 檢查 npm 版本
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安裝"
    exit 1
fi

echo "✅ npm 版本: $(npm -v)"

# 安裝依賴
echo "📦 安裝 npm 依賴..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm 安裝失敗"
    exit 1
fi

echo "✅ 依賴安裝完成"

# 設置環境變數
if [ ! -f ".env.local" ]; then
    echo "⚙️ 建立環境變數檔案..."
    cp .env.local.example .env.local
    echo "✅ 已建立 .env.local 檔案"
    echo "📝 請編輯 .env.local 檔案並設定正確的 API URL"
else
    echo "✅ .env.local 檔案已存在"
fi

# 執行類型檢查
echo "🔍 執行 TypeScript 類型檢查..."
if npm run typecheck &> /dev/null; then
    echo "✅ TypeScript 類型檢查通過"
else
    echo "⚠️ TypeScript 類型檢查有警告，但不影響運行"
fi

# 測試構建
echo "🏗️ 測試生產構建..."
if npm run build &> /dev/null; then
    echo "✅ 生產構建測試通過"
else
    echo "❌ 生產構建失敗，請檢查錯誤"
    exit 1
fi

# 清理構建文件
rm -rf .next

echo ""
echo "🎉 MovieBonus Frontend 設置完成！"
echo ""
echo "📋 下一步驟："
echo "1. 編輯 .env.local 檔案，設定正確的後端 API URL"
echo "2. 啟動後端服務 (port 8080)"
echo "3. 運行 'npm run dev' 啟動開發服務器"
echo "4. 訪問 http://localhost:9002"
echo ""
echo "📚 更多資訊："
echo "- 本地測試指南: LOCAL_TESTING_GUIDE.md"
echo "- Vercel 部署指南: VERCEL_DEPLOYMENT_GUIDE.md"
echo "- 專案文檔: README.md"
echo ""

# 檢查後端連接
echo "🔗 檢查後端 API 連接..."
API_URL=$(grep NEXT_PUBLIC_API_URL .env.local | cut -d'=' -f2 | tr -d ' ')

if [ -n "$API_URL" ]; then
    if curl -s --connect-timeout 5 "$API_URL/api/v1/health" &> /dev/null; then
        echo "✅ 後端 API 連接正常 ($API_URL)"
    else
        echo "⚠️ 無法連接到後端 API ($API_URL)"
        echo "   請確認後端服務正在運行"
    fi
else
    echo "⚠️ 未設定 API URL，請編輯 .env.local 檔案"
fi

echo ""
echo "🚀 準備就緒！執行 'npm run dev' 開始開發"