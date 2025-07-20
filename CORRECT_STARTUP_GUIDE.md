# 🎬 MovieBonus Frontend 正確啟動指南

## 🚨 重要：連接到已部署的 Cloud Run API

由於您已經將後端部署到 Google Cloud Run，前端應該直接連接到該服務，**不需要**啟動本地後端服務。

---

## ✅ 正確的啟動步驟

### 1️⃣ 進入前端目錄
```bash
# 從專案根目錄 (MovieBonus)
cd frontend/MovieBonus

# 確認您在正確的目錄
pwd
# 應該顯示: /Users/kumaneko/Development/project/MovieBonus/frontend/MovieBonus
```

### 2️⃣ 配置環境變數
```bash
# 複製環境變數模板
cp .env.local.example .env.local

# 編輯 .env.local 文件，設定正確的 Cloud Run API URL
```

**重要**: `.env.local` 文件應該包含：
```env
# 連接到您的 Cloud Run 服務
NEXT_PUBLIC_API_URL=https://moviebonus-python-scrapers-777964931661.asia-east1.run.app
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG=true
NODE_ENV=development
```

### 3️⃣ 安裝依賴（如需要）
```bash
npm install
```

### 4️⃣ 啟動前端開發服務器
```bash
npm run dev
```

### 5️⃣ 訪問應用
- 🌐 **前端**: http://localhost:9002
- 🔧 **後端 API 文檔**: https://moviebonus-python-scrapers-777964931661.asia-east1.run.app/docs

---

## 🚫 常見錯誤避免

### ❌ 錯誤做法
```bash
# 不要在專案根目錄執行 npm run dev
cd /Users/kumaneko/Development/project/MovieBonus
npm run dev  # ❌ 這會啟動後端 Node.js 服務

# 不要啟動本地後端服務
cd backend/python-scrapers
uvicorn app.main:app  # ❌ 不需要，已有 Cloud Run
```

### ✅ 正確做法
```bash
# 進入前端目錄
cd /Users/kumaneko/Development/project/MovieBonus/frontend/MovieBonus

# 啟動前端服務
npm run dev  # ✅ 正確，這會啟動 Next.js 前端
```

---

## 🔧 環境變數配置詳解

### 找到您的 Cloud Run URL
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇您的專案
3. 導航至 "Cloud Run"
4. 找到您的服務 (通常名為 `moviebonus-python-scrapers`)
5. 複製服務的 URL

### 更新 .env.local
```bash
# 編輯環境變數文件
nano .env.local

# 或使用其他編輯器
code .env.local
```

確保包含正確的 URL：
```env
NEXT_PUBLIC_API_URL=https://your-actual-cloud-run-url.run.app
```

---

## 🧪 測試 API 連接

在啟動前端之前，測試 Cloud Run API：

```bash
# 測試 API 根端點
curl https://moviebonus-python-scrapers-777964931661.asia-east1.run.app/

# 測試電影 API
curl "https://moviebonus-python-scrapers-777964931661.asia-east1.run.app/api/v1/supabase/movies?limit=2"
```

如果成功，您應該看到 JSON 回應。

---

## 📋 功能測試檢查清單

前端啟動後 (http://localhost:9002)，請測試：

- [ ] 首頁載入並顯示電影列表
- [ ] 切換「正在上映」和「即將上映」標籤
- [ ] 點擊電影卡片進入詳情頁
- [ ] 搜尋功能正常工作
- [ ] 沒有 API 連接錯誤

---

## 🐛 故障排除

### API 連接失敗
如果看到「無法連接到後端服務」錯誤：

1. **檢查 Cloud Run 服務狀態**
   ```bash
   curl https://your-cloud-run-url.run.app/
   ```

2. **驗證環境變數**
   ```bash
   cat .env.local
   ```

3. **檢查 CORS 設定**
   - 確認 Cloud Run 服務允許來自 `localhost:9002` 的請求

### 前端啟動失敗
```bash
# 清除 Next.js 快取
rm -rf .next

# 重新安裝依賴
rm -rf node_modules package-lock.json
npm install

# 重新啟動
npm run dev
```

### Cloud Run URL 不確定
如果不確定正確的 Cloud Run URL：

1. 登入 Google Cloud Console
2. 查看 Cloud Run 服務列表
3. 或者檢查您的部署腳本/文檔

---

## 🎯 成功指標

當一切正常時，您應該看到：

1. **終端顯示**:
   ```
   ▲ Next.js 15.3.3 (Turbopack)
   - Local:        http://localhost:9002
   - Network:      http://192.168.1.110:9002
   ✓ Ready in 1388ms
   ```

2. **瀏覽器**: 
   - 前端正常載入
   - 顯示真實的電影資料
   - 搜尋功能工作正常

3. **無錯誤訊息**: 
   - 沒有 API 連接錯誤
   - 沒有 CORS 錯誤

---

## 📞 如需協助

如果仍有問題：

1. **檢查錯誤日誌**: 瀏覽器開發者工具 > Console
2. **驗證 API**: 直接訪問 Cloud Run URL
3. **確認目錄**: 確保在 `frontend/MovieBonus` 目錄中
4. **重新設定**: 重新複製 `.env.local.example` 並修改

**現在您的前端應該正常連接到 Cloud Run 後端並顯示真實的電影資料！** 🎉