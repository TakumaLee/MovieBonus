# 🚀 MovieBonus 部署指南

## 問題分析

您的應用程式在本地運行正常，但部署到 Firebase Hosting 後失去設計樣式，主要原因是：

1. **Firebase Hosting 限制**：不支援 Next.js 的服務端渲染
2. **靜態資源路徑問題**：CSS 和 JS 檔案無法正確載入
3. **動態路由問題**：Firebase Hosting 無法處理 Next.js 的動態路由

## ✅ 推薦解決方案：使用 Vercel

Vercel 是 Next.js 的官方平台，完美支援所有 Next.js 功能。

### 步驟 1：安裝 Vercel CLI

```bash
npm install -g vercel
```

### 步驟 2：執行部署腳本

```bash
# 在 frontend/MovieBonus 目錄下執行
./deploy-vercel.sh
```

### 步驟 3：或手動部署

```bash
# 建置專案
npm run build

# 部署到 Vercel
vercel --prod
```

## 🔧 配置說明

### Vercel 配置 (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["hkg1"],
  "functions": {
    "app/movie/[movieId]/page.tsx": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/movie/(.*)",
      "destination": "/movie/[movieId]"
    }
  ],
  "headers": [
    {
      "source": "**/*.@(js|css)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Next.js 配置 (next.config.ts)

```typescript
const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  assetPrefix: '',
  basePath: '',
  // ... 其他配置
};
```

## 🎯 Vercel 的優勢

1. **完美相容**：專為 Next.js 設計
2. **自動優化**：自動處理靜態資源、圖片優化
3. **全球 CDN**：亞洲用戶訪問速度快
4. **自動 HTTPS**：免費 SSL 證書
5. **環境變數**：簡單的環境變數管理
6. **自動部署**：Git 整合，自動部署
7. **免費方案**：適合個人專案

## 📝 部署後檢查清單

部署完成後，請檢查：

- ✅ 首頁正常載入
- ✅ CSS 樣式正確顯示
- ✅ 電影列表正常顯示
- ✅ 電影詳情頁面可訪問
- ✅ 搜尋功能正常
- ✅ API 調用成功
- ✅ 圖片正常載入

## 🔍 故障排除

### 如果樣式仍然有問題：

1. **檢查環境變數**：
   ```bash
   # 確保 .env.local 中的 API URL 正確
   NEXT_PUBLIC_API_URL=https://moviebonus-python-scrapers-777964931661.asia-east1.run.app
   ```

2. **檢查瀏覽器控制台**：
   - 查看是否有 404 錯誤
   - 檢查 CSS 檔案是否正確載入

3. **檢查網路請求**：
   - 確認 API 調用成功
   - 檢查靜態資源路徑

### 如果 API 調用失敗：

1. **檢查後端服務**：
   ```bash
   curl https://moviebonus-python-scrapers-777964931661.asia-east1.run.app/api/v1/supabase/movies
   ```

2. **檢查 CORS 設定**：
   - 確認後端允許 Vercel 域名

## 🚫 不推薦的方案

### Firebase Hosting（不適合）

**問題**：
- ❌ 不支援 Next.js 服務端渲染
- ❌ 動態路由無法正常工作
- ❌ 靜態資源路徑問題
- ❌ 需要複雜的 Functions 配置

### 靜態匯出（功能受限）

**問題**：
- ❌ 失去動態路由功能
- ❌ 無法使用 API 路由
- ❌ 搜尋功能受限
- ❌ 需要預建置所有頁面

## 📞 支援

如需進一步協助：

1. **檢查 Vercel 部署日誌**
2. **查看瀏覽器開發者工具**
3. **確認環境變數設定**
4. **測試 API 端點可用性**

## 🎉 總結

**強烈建議使用 Vercel 部署**，因為：

- 完美支援 Next.js 15
- 自動處理所有複雜配置
- 全球 CDN，訪問速度快
- 免費方案可用
- 部署簡單快速

使用 Vercel 後，您的應用程式將完全正常運行，包括所有樣式和功能！ 