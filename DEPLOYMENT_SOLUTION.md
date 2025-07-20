# 🚀 MovieBonus 部署解決方案

## 問題分析

您的 Firebase Hosting 部署出現 "Page Not Found" 錯誤，主要原因是：

1. **配置錯誤**：`firebase.json` 中的 `public` 目錄指向錯誤位置
2. **Next.js 配置問題**：動態路由與靜態匯出不相容
3. **部署方式不適合**：Firebase Hosting 不適合運行 Next.js 應用程式

## ✅ 解決方案

### 方案一：使用 Vercel 部署（推薦）

Vercel 是 Next.js 的官方平台，完美支援所有 Next.js 功能。

#### 步驟：

1. **安裝 Vercel CLI**：
```bash
npm install -g vercel
```

2. **執行部署腳本**：
```bash
./deploy-vercel.sh
```

3. **或手動部署**：
```bash
# 建置專案
npm run build

# 部署到 Vercel
vercel --prod
```

#### 優點：
- ✅ 完美支援 Next.js 15
- ✅ 自動處理動態路由
- ✅ 全球 CDN
- ✅ 自動 HTTPS
- ✅ 免費方案可用

### 方案二：使用 Firebase Functions（複雜）

如果您堅持使用 Firebase，需要配置 Functions：

1. **安裝 Firebase Functions 依賴**：
```bash
npm install firebase-functions firebase-admin
```

2. **創建 Functions 入口點**：
```javascript
// functions/index.js
const functions = require('firebase-functions');
const { https } = require('firebase-functions');
const { default: next } = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: { distDir: '.next' } });
const handle = app.getRequestHandler();

exports.nextjs = https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});
```

3. **更新 firebase.json**：
```json
{
  "hosting": {
    "public": "public",
    "rewrites": [
      {
        "source": "**",
        "function": "nextjs"
      }
    ]
  },
  "functions": {
    "source": ".",
    "runtime": "nodejs18"
  }
}
```

#### 缺點：
- ❌ 需要付費 Firebase 方案
- ❌ 配置複雜
- ❌ 冷啟動延遲

### 方案三：靜態匯出（功能受限）

如果只需要靜態功能，可以：

1. **修改 next.config.ts**：
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  // ... 其他配置
};
```

2. **移除動態路由**或改為靜態路由

#### 缺點：
- ❌ 失去動態路由功能
- ❌ 無法使用 API 路由
- ❌ 搜尋功能受限

## 🎯 推薦方案

**強烈建議使用 Vercel 部署**，因為：

1. **完美相容**：專為 Next.js 設計
2. **簡單快速**：一鍵部署
3. **功能完整**：支援所有 Next.js 功能
4. **免費方案**：適合個人專案
5. **全球 CDN**：亞洲用戶訪問速度快

## 📝 部署後檢查

部署完成後，請檢查：

1. ✅ 首頁正常載入
2. ✅ 電影列表顯示
3. ✅ 電影詳情頁面可訪問
4. ✅ 搜尋功能正常
5. ✅ API 調用成功

## 🔧 故障排除

如果仍有問題：

1. **檢查環境變數**：確保 `NEXT_PUBLIC_API_URL` 正確
2. **檢查 API 狀態**：確認後端服務正常運行
3. **檢查瀏覽器控制台**：查看錯誤訊息
4. **檢查網路請求**：確認 API 調用成功

## 📞 支援

如需進一步協助，請提供：
- 部署平台（Vercel/Firebase）
- 錯誤訊息截圖
- 瀏覽器控制台錯誤
- 網路請求狀態 