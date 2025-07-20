# MovieBonus Frontend Vercel 部署完整指南

## 🚀 部署概覽

本指南將引導您完成 MovieBonus 前端應用程式到 Vercel 的部署流程。

## 📋 前置需求

### 1. 必要條件
- [x] GitHub 帳號
- [x] Vercel 帳號 (可使用 GitHub 登入)
- [x] 後端 API 已部署並可從外部存取
- [x] 前端代碼已推送到 GitHub repository

### 2. 確認文件結構
```
frontend/MovieBonus/
├── src/
├── public/
├── package.json
├── next.config.ts
├── vercel.json           ✅ 已配置
├── .env.production       ✅ 已配置
├── .env.development      ✅ 已配置
├── .env.local.example    ✅ 已配置
└── README.md
```

---

## 🌐 Step 1: 準備 GitHub Repository

### 1.1 推送代碼到 GitHub
```bash
# 確保在正確的目錄
cd frontend/MovieBonus

# 檢查 git 狀態
git status

# 添加所有文件
git add .

# 提交變更
git commit -m "feat: Complete frontend integration with backend API

- Add comprehensive API client infrastructure
- Implement TypeScript type definitions  
- Create React hooks for data management
- Integrate movie listings and details pages
- Add search functionality with suggestions
- Configure Vercel deployment setup
- Optimize responsive design and UI components
- Include error handling and loading states"

# 推送到遠端倉庫
git push origin main
```

### 1.2 驗證 Repository 結構
確保 GitHub 上的 repository 包含：
- `frontend/MovieBonus/` 目錄結構完整
- 所有必要的配置文件存在
- `.env.local` 文件**不要**推送到 GitHub (已在 .gitignore 中)

---

## 🔧 Step 2: Vercel 專案設置

### 2.1 登入 Vercel
1. 前往 [vercel.com](https://vercel.com)
2. 點擊 "Sign Up" 或 "Login"
3. 選擇 "Continue with GitHub"
4. 授權 Vercel 存取您的 GitHub 帳號

### 2.2 匯入專案
1. 在 Vercel 儀表板點擊 "New Project"
2. 找到您的 MovieBonus repository
3. 點擊 "Import"

### 2.3 配置專案設定
```
Project Name: moviebonus-frontend
Framework Preset: Next.js
Root Directory: frontend/MovieBonus  ⭐ 重要：設定正確的根目錄
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

---

## 🔐 Step 3: 環境變數配置

### 3.1 在 Vercel 設定環境變數

進入專案設置頁面，點擊 "Environment Variables" 標籤：

#### Production 環境變數
```env
NEXT_PUBLIC_API_URL = https://your-backend-api.vercel.app
NEXT_PUBLIC_ENVIRONMENT = production  
NEXT_PUBLIC_DEBUG = false
NODE_ENV = production
```

#### Preview 環境變數 (可選)
```env
NEXT_PUBLIC_API_URL = https://staging-api.moviebonus.app
NEXT_PUBLIC_ENVIRONMENT = preview
NEXT_PUBLIC_DEBUG = true
NODE_ENV = production
```

#### Development 環境變數
```env
NEXT_PUBLIC_API_URL = http://localhost:8080
NEXT_PUBLIC_ENVIRONMENT = development
NEXT_PUBLIC_DEBUG = true
NODE_ENV = development
```

### 3.2 後端 API URL 配置

**重要**: 確保您的後端 API 已部署並可從外部存取。

常見的後端部署選項：
- **Vercel**: `https://moviebonus-backend.vercel.app`
- **Google Cloud Run**: `https://moviebonus-api-xxx.run.app`
- **Railway**: `https://moviebonus-backend.railway.app`
- **自訂域名**: `https://api.moviebonus.com`

---

## 🛠️ Step 4: 部署配置檔案說明

### 4.1 vercel.json 配置
```json
{
  "name": "moviebonus-frontend",
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["sin1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@next_public_api_url",
    "NEXT_PUBLIC_ENVIRONMENT": "@next_public_environment",
    "NEXT_PUBLIC_DEBUG": "@next_public_debug"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "@next_public_api_url",
      "NEXT_PUBLIC_ENVIRONMENT": "@next_public_environment", 
      "NEXT_PUBLIC_DEBUG": "@next_public_debug"
    }
  },
  "functions": {
    "app/**": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "$NEXT_PUBLIC_API_URL/api/:path*"
    }
  ]
}
```

### 4.2 next.config.ts 最佳化
確保 Next.js 配置支援生產環境：

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 啟用實驗性功能
  experimental: {
    turbopack: true,
  },
  
  // 圖片最佳化
  images: {
    domains: ['placehold.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 效能最佳化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers 配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 🚀 Step 5: 執行部署

### 5.1 觸發部署
1. 在 Vercel 專案頁面點擊 "Deploy"
2. 或者推送新的 commit 到 GitHub (自動觸發部署)

### 5.2 監控部署過程
```bash
# 部署步驟會顯示：
1. Cloning repository...
2. Installing dependencies...
3. Building application...
4. Optimizing for production...
5. Deploying to global edge network...
```

### 5.3 部署時間預估
- **首次部署**: 3-5 分鐘
- **後續部署**: 1-2 分鐘

---

## 🔍 Step 6: 驗證部署

### 6.1 功能測試檢查清單
訪問部署的 URL 並測試：

#### 基本功能
- [ ] 首頁正常載入
- [ ] 電影列表顯示
- [ ] 電影詳情頁功能
- [ ] 搜尋功能正常
- [ ] API 連接正常

#### 效能檢查
- [ ] 首次載入 < 3 秒
- [ ] 圖片載入正常
- [ ] 響應式設計工作
- [ ] SEO meta tags 正確

#### 錯誤處理
- [ ] API 錯誤顯示適當訊息
- [ ] 網路錯誤處理
- [ ] 404 頁面顯示
- [ ] 載入狀態正常

### 6.2 使用 Vercel Analytics
1. 在專案設置中啟用 "Analytics"
2. 監控 Core Web Vitals
3. 追蹤使用者互動

---

## 🌟 Step 7: 自訂域名設置 (可選)

### 7.1 添加自訂域名
1. 在 Vercel 專案設置中選擇 "Domains"
2. 點擊 "Add" 並輸入您的域名
3. 根據提示配置 DNS 記錄

### 7.2 DNS 配置範例
```dns
# A Record
Type: A
Name: @
Value: 76.76.19.19

# CNAME Record  
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 7.3 SSL 憑證
Vercel 會自動提供 SSL 憑證，通常在域名添加後 1-2 小時內生效。

---

## 🔧 Step 8: 高級配置

### 8.1 自動部署分支
配置不同分支的自動部署：

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "develop": true
    }
  },
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ]
}
```

### 8.2 預覽部署
- **主分支 (main)**: 自動部署到生產環境
- **其他分支**: 創建預覽部署
- **Pull Requests**: 自動創建預覽 URL

### 8.3 部署保護
```json
{
  "functions": {
    "app/**": {
      "maxDuration": 30
    }
  },
  "regions": ["sin1", "hkg1"],
  "cleanUrls": true,
  "trailingSlash": false
}
```

---

## 📊 Step 9: 監控和維護

### 9.1 設定監控
1. 啟用 Vercel Analytics
2. 設定效能警報
3. 監控錯誤率

### 9.2 更新和維護
```bash
# 定期更新依賴
npm update

# 檢查安全漏洞
npm audit

# 效能分析
npm run build && npm run analyze
```

### 9.3 備份策略
- GitHub repository 作為主要備份
- Vercel 部署歷史記錄
- 定期檢查部署狀態

---

## 🐛 常見問題排解

### 1. 部署失敗
**錯誤**: Build failed

**解決方案**:
```bash
# 本地測試構建
npm run build

# 檢查錯誤日誌
# 確認所有依賴都在 package.json 中
# 檢查 TypeScript 錯誤
```

### 2. API 連接失敗
**錯誤**: Failed to fetch

**檢查項目**:
- 後端 API URL 是否正確
- CORS 設定是否允許前端域名
- API 是否在生產環境中運行

### 3. 環境變數問題
**錯誤**: Environment variable not found

**解決方案**:
```bash
# 檢查 Vercel 環境變數設定
# 確認變數名稱以 NEXT_PUBLIC_ 開頭
# 重新部署以載入新的環境變數
```

### 4. 圖片載入問題
**錯誤**: Image optimization error

**解決方案**:
```javascript
// 在 next.config.ts 中添加圖片域名
images: {
  domains: ['your-image-domain.com'],
}
```

### 5. 404 錯誤
**問題**: 直接訪問路由返回 404

**解決方案**:
```json
// 在 vercel.json 中添加重寫規則
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## ✅ 部署檢查清單

### 部署前檢查
- [ ] 代碼已推送到 GitHub
- [ ] 環境變數已設定
- [ ] 後端 API 已部署並可存取
- [ ] 本地構建測試通過
- [ ] 所有必要文件已包含

### 部署後檢查  
- [ ] 網站可正常訪問
- [ ] 所有頁面載入正常
- [ ] API 連接正常運作
- [ ] 搜尋功能正常
- [ ] 響應式設計正確
- [ ] 效能指標良好
- [ ] 錯誤處理正常
- [ ] SEO 設定正確

### 生產環境最佳化
- [ ] 啟用 Vercel Analytics
- [ ] 設定自訂域名 (如需要)
- [ ] 配置 CDN 和快取
- [ ] 設定監控警報
- [ ] 建立備份計劃

---

## 🎯 成功部署確認

當您看到以下內容時，表示部署成功：

1. **Vercel 儀表板顯示 "Ready"**
2. **網站可以通過 URL 正常訪問**
3. **所有功能都正常運作**
4. **API 連接沒有問題**
5. **效能指標在可接受範圍內**

### 部署成功後的 URL 範例
- **生產環境**: `https://moviebonus-frontend.vercel.app`
- **自訂域名**: `https://moviebonus.com` (如已設定)

---

## 📞 獲得幫助

如果在部署過程中遇到問題：

1. **Vercel 文檔**: [vercel.com/docs](https://vercel.com/docs)
2. **Next.js 部署指南**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
3. **GitHub Issues**: 檢查項目的 issues
4. **Vercel 社群**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

恭喜！您的 MovieBonus 前端應用程式現在已成功部署到 Vercel！🎉