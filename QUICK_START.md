# 🎬 MovieBonus Frontend 快速開始指南

## 🚀 3 分鐘快速啟動

### 1️⃣ 快速設置 (30 秒)
```bash
# 進入前端目錄
cd frontend/MovieBonus

# 執行自動設置腳本
./setup.sh
```

### 2️⃣ 啟動後端服務 (1 分鐘)
```bash
# 在新的終端視窗
cd ../../backend/python-scrapers
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

### 3️⃣ 啟動前端服務 (30 秒)
```bash
# 回到前端目錄
cd frontend/MovieBonus

# 編輯環境變數 (如需要)
cp .env.local.example .env.local

# 啟動開發服務器
npm run dev
```

### 4️⃣ 開始使用 (立即)
- 🌐 前端: http://localhost:9002
- 🔧 後端 API: http://localhost:8080/docs

---

## 📋 本地測試步驟

### ✅ 功能檢查清單
- [ ] 首頁載入顯示電影列表
- [ ] 點擊電影卡片進入詳情頁
- [ ] 搜尋框可以搜尋電影
- [ ] 正在上映/即將上映標籤切換
- [ ] 手機/平板響應式設計正常

### 🐛 問題排解
**如果遇到「無法連接後端」錯誤**:
```bash
# 檢查後端是否運行
curl http://localhost:8080/api/v1/health

# 檢查環境變數
cat .env.local
```

---

## 🌐 Vercel 部署 (5 分鐘)

### 準備部署
```bash
# 1. 推送到 GitHub
git add .
git commit -m "feat: Complete frontend integration"
git push origin main

# 2. 前往 vercel.com
# 3. 連接 GitHub repository
# 4. 設定根目錄為 frontend/MovieBonus
```

### 環境變數設定
```env
NEXT_PUBLIC_API_URL = https://your-backend-api.vercel.app
NEXT_PUBLIC_ENVIRONMENT = production
NEXT_PUBLIC_DEBUG = false
NODE_ENV = production
```

### 驗證部署
- ✅ 網站正常載入
- ✅ API 連接正常
- ✅ 所有功能可用

---

## 📁 專案結構快覽

```
src/
├── app/                 # Next.js 15 App Router
│   ├── page.tsx         # 首頁 - 電影列表
│   └── movie/[movieId]/ # 電影詳情頁
├── components/          # UI 組件
│   ├── SearchBar.tsx    # 搜尋功能
│   └── ui/             # shadcn/ui 組件庫
├── hooks/              # React Hooks
│   ├── useMovies.ts    # 電影資料管理
│   ├── useMovieDetail.ts # 電影詳情管理
│   └── useSearch.ts    # 搜尋功能管理
├── lib/                # 工具庫
│   ├── api-client.ts   # API 客戶端
│   ├── api-endpoints.ts # API 端點封裝
│   ├── types.ts        # TypeScript 類型
│   └── config.ts       # 應用程式配置
└── styles/             # 全域樣式
```

---

## 🛠️ 開發指令

```bash
# 開發服務器
npm run dev              # 啟動開發服務器 (port 9002)

# 構建和測試
npm run build           # 生產構建
npm run start           # 啟動生產服務器
npm run typecheck       # TypeScript 類型檢查
npm run lint            # ESLint 代碼檢查

# 快速設置
./setup.sh              # 自動安裝和配置
```

---

## 🔗 重要連結

- 📖 **本地測試詳細指南**: [LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md)
- 🚀 **Vercel 部署完整教學**: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
- 📚 **專案說明文檔**: [README.md](./README.md)
- 🏗️ **部署配置說明**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 💡 技術要點

- **框架**: Next.js 15 + TypeScript
- **UI 庫**: shadcn/ui + Tailwind CSS
- **狀態管理**: React Hooks + 自訂快取
- **API 整合**: 與 Python FastAPI 後端整合
- **部署**: Vercel 一鍵部署
- **響應式**: 行動優先設計

---

## 🎯 主要功能

- 🎬 **電影瀏覽**: 即時載入正在上映和即將上映的電影
- 🔍 **智慧搜尋**: 即時搜尋建議和歷史記錄
- 🎁 **特典資訊**: 完整的電影特典和禮品資訊
- 📱 **響應式設計**: 支援手機、平板、桌面設備
- ⚡ **效能優化**: 快取機制、懶載入、圖片優化
- 🛡️ **錯誤處理**: 完善的錯誤邊界和重試機制

---

## 🏆 現在就開始使用！

```bash
./setup.sh && npm run dev
```

🎉 **恭喜！您的 MovieBonus 前端應用程式已準備就緒！**