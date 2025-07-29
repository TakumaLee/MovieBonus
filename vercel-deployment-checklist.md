# Vercel Deployment Checklist for MovieBonus Frontend

## 🔍 問題診斷

您遇到的問題是：localhost 可以正常登入管理員面板，但在生產環境 (https://paruparu.vercel.app) 無法登入，出現 400 Bad Request 錯誤。

## 📋 解決方案檢查清單

### 1. ✅ 環境變數配置（已修復）

我已經在 `.env.production` 中添加了缺少的環境變數：
```
NEXT_PUBLIC_NODE_API_URL=https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app
```

### 2. 🔐 Vercel 環境變數設定

請在 Vercel Dashboard 中確認以下環境變數已正確設定：

1. 登入 Vercel Dashboard
2. 進入專案設定 > Environment Variables
3. 確認以下變數存在並正確：

```bash
# Python Scrapers API (用於電影資料)
NEXT_PUBLIC_API_URL=https://moviebonus-python-scrapers-777964931661.asia-east1.run.app

# Node.js Backend API (用於管理員功能) - 這是最重要的！
NEXT_PUBLIC_NODE_API_URL=https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app

# Supabase 設定（用於用戶反饋）
NEXT_PUBLIC_SUPABASE_URL=https://ugacvqteeyyiujpyhqxq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnYWN2cXRlZXl5aXVqcHlocXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNzk5NTQsImV4cCI6MjA1Mjk1NTk1NH0.b_KbYK5gMTmezXsb6FT-ojJJUnEXmT8fQdNLbaBSkxI

# 其他設定
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_DEBUG=false
```

### 3. 🌐 後端 CORS 設定

確認後端的 Cloud Run 服務有正確的環境變數：

```bash
# 檢查後端環境變數
gcloud run services describe moviebonus-nodejs-backend \
  --region=asia-east1 \
  --format="value(spec.template.spec.containers[0].env[?(@.name=='ALLOWED_ORIGINS')].value)"
```

應該包含：`https://paruparu.vercel.app`

### 4. 🔄 重新部署步驟

1. **更新 Vercel 環境變數**（如果需要）：
   - 在 Vercel Dashboard 添加 `NEXT_PUBLIC_NODE_API_URL`
   - 值：`https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app`

2. **重新部署前端**：
   ```bash
   # 推送更新到 Git
   git add .env.production
   git commit -m "fix: 添加 NODE_API_URL 環境變數"
   git push
   ```

3. **清除 Vercel 快取並重新部署**：
   - 在 Vercel Dashboard > Deployments
   - 點擊 "..." > Redeploy
   - 勾選 "Use existing Build Cache" 取消勾選
   - 點擊 "Redeploy"

### 5. 🧪 測試驗證

部署完成後，測試以下項目：

1. **檢查環境變數是否載入**：
   - 打開瀏覽器開發者工具
   - 在 Console 執行：
   ```javascript
   console.log('NODE_API_URL:', process.env.NEXT_PUBLIC_NODE_API_URL);
   ```

2. **檢查 API 請求**：
   - 在 Network 標籤觀察登入請求
   - 確認請求 URL 是：`https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app/api/admin/login`
   - 檢查請求 headers 中是否有 `credentials: include`

3. **檢查 CORS 錯誤**：
   - 如果仍有問題，檢查 Console 是否有 CORS 相關錯誤

### 6. 🚨 常見問題排查

**問題 1：環境變數未生效**
- 解決：確保在 Vercel Dashboard 中設定，而不只是在 .env.production

**問題 2：CORS 錯誤**
- 解決：確認後端服務的 ALLOWED_ORIGINS 包含 https://paruparu.vercel.app

**問題 3：Cookie 無法設定**
- 解決：檢查後端的 cookie 設定是否包含 `sameSite: 'none'` 和 `secure: true`

## 📞 後續支援

如果按照以上步驟操作後仍有問題，請提供：
1. 瀏覽器 Console 的錯誤訊息截圖
2. Network 標籤中失敗請求的詳細資訊
3. 後端服務的日誌（可從 Cloud Run 查看）