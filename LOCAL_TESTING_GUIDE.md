# MovieBonus Frontend 本地測試指南

## 🚀 快速開始

### 前置需求
- Node.js 18.0.0 或更高版本
- npm 或 yarn 包管理器
- 後端 Python API 服務 (運行在 port 8080)

### 1. 環境設置

```bash
# 進入前端目錄
cd frontend/MovieBonus

# 安裝依賴
npm install

# 複製環境變數檔案
cp .env.local.example .env.local
```

### 2. 配置環境變數

編輯 `.env.local` 檔案：

```env
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG=true

# 構建配置
NODE_ENV=development
```

### 3. 啟動後端服務

**重要**: 前端需要後端 API 才能正常運作。

```bash
# 在另一個終端視窗，啟動 Python 後端
cd ../../backend/python-scrapers
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

### 4. 啟動前端開發服務器

```bash
# 回到前端目錄
cd frontend/MovieBonus

# 啟動開發服務器 (使用 Turbopack)
npm run dev
```

### 5. 訪問應用

開啟瀏覽器訪問：
- **前端**: http://localhost:9002
- **後端 API 文檔**: http://localhost:8080/docs

---

## 🧪 測試功能

### 基本功能測試

#### 1. 首頁載入測試
- [x] 檢查首頁正常載入
- [x] 驗證「正在上映」和「即將上映」標籤
- [x] 確認電影卡片正常顯示
- [x] 測試響應式設計 (手機、平板、桌面)

#### 2. 電影列表測試
```bash
# 手動測試步驟
1. 訪問 http://localhost:9002
2. 檢查是否顯示電影列表
3. 切換「正在上映」和「即將上映」標籤
4. 驗證載入狀態和錯誤處理
```

#### 3. 電影詳情頁測試
```bash
# 測試步驟
1. 點擊任一電影卡片
2. 檢查電影詳情頁是否正常載入
3. 驗證電影資訊顯示完整
4. 確認特典資訊正常顯示
```

#### 4. 搜尋功能測試
```bash
# 測試步驟
1. 在搜尋框輸入電影名稱
2. 檢查自動建議功能
3. 測試搜尋結果顯示
4. 驗證搜尋歷史記錄
```

### 錯誤處理測試

#### 1. 後端連接失敗測試
```bash
# 停止後端服務
# 重新載入前端頁面
# 檢查錯誤提示和重試功能
```

#### 2. 網路錯誤測試
```bash
# 在瀏覽器開發者工具中模擬網路錯誤
# 檢查錯誤邊界和降級體驗
```

### 效能測試

#### 1. 載入時間測試
```bash
# 使用瀏覽器開發者工具的 Network 面板
# 檢查首次載入時間
# 測試快取機制
```

#### 2. 響應式設計測試
```bash
# 測試不同螢幕尺寸
# 手機: 375px - 414px
# 平板: 768px - 1024px  
# 桌面: 1280px+
```

---

## 🛠️ 開發工具命令

### 構建和測試
```bash
# 類型檢查
npm run typecheck

# 代碼檢查
npm run lint

# 生產構建
npm run build

# 預覽生產構建
npm run start
```

### 除錯模式
```bash
# 啟用詳細日誌
NEXT_PUBLIC_DEBUG=true npm run dev

# 檢查 API 連接
curl http://localhost:8080/api/v1/health
```

---

## 🐛 常見問題排解

### 1. 無法連接到後端 API
**錯誤**: "無法連接到後端服務"

**解決方案**:
```bash
# 檢查後端服務是否運行
curl http://localhost:8080/api/v1/health

# 檢查環境變數
echo $NEXT_PUBLIC_API_URL

# 重啟後端服務
cd ../../backend/python-scrapers
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

### 2. 頁面載入緩慢
**解決方案**:
```bash
# 檢查網路請求
# 開啟瀏覽器開發者工具 > Network
# 查看是否有失敗的請求
```

### 3. 類型錯誤
**解決方案**:
```bash
# 運行類型檢查
npm run typecheck

# 檢查 TypeScript 配置
cat tsconfig.json
```

### 4. 樣式問題
**解決方案**:
```bash
# 檢查 Tailwind CSS 編譯
npm run build

# 清除 Next.js 快取
rm -rf .next
npm run dev
```

### 5. 搜尋功能不工作
**檢查項目**:
- 後端搜尋 API 是否正常
- 搜尋建議 API 回應
- 瀏覽器控制台錯誤訊息

---

## 📊 效能監控

### 1. Core Web Vitals 檢查
```bash
# 使用 Lighthouse 測試
# 開啟 Chrome DevTools > Lighthouse
# 運行效能分析
```

### 2. 網路請求監控
```bash
# 檢查 API 回應時間
# 監控圖片載入效能
# 驗證快取策略
```

### 3. 記憶體使用
```bash
# 檢查記憶體洩漏
# 監控元件重新渲染
# 驗證狀態管理效率
```

---

## 🔍 偵錯技巧

### 1. React DevTools
安裝 React Developer Tools 瀏覽器擴充功能

### 2. 網路請求偵錯
```javascript
// 在瀏覽器控制台執行
fetch('http://localhost:8080/api/v1/supabase/movies')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 3. 狀態偵錯
```javascript
// 檢查 React hooks 狀態
// 使用 React DevTools Profiler
```

### 4. API 連接測試
```bash
# 測試各個 API 端點
curl http://localhost:8080/api/v1/supabase/movies
curl http://localhost:8080/api/v1/supabase/promotions
curl http://localhost:8080/api/v1/search/movies?query=電影
```

---

## ✅ 測試檢查清單

### 功能測試
- [ ] 首頁載入正常
- [ ] 電影列表顯示
- [ ] 電影詳情頁功能
- [ ] 搜尋功能正常
- [ ] 標籤切換功能
- [ ] 錯誤處理機制
- [ ] 載入狀態顯示

### 響應式設計
- [ ] 手機版面 (320px-768px)
- [ ] 平板版面 (768px-1024px)
- [ ] 桌面版面 (1024px+)
- [ ] 觸控互動友善

### 效能
- [ ] 首次載入 < 3 秒
- [ ] 圖片懶載入
- [ ] API 快取機制
- [ ] 無記憶體洩漏

### 無障礙設計
- [ ] 鍵盤導航
- [ ] 螢幕閱讀器友善
- [ ] 適當的對比度
- [ ] 語意化 HTML

這個測試指南涵蓋了本地開發環境的完整測試流程。請依照步驟進行測試，確保所有功能正常運作後再進行部署。